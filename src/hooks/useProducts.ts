import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

interface Product extends ProductRow {
  categories?: { id: string; name: string; } | null;
  profiles?: { id: string; name: string; location: string | null; } | null;
  product_images?: { id: string; image_url: string; is_cover: boolean; display_order: number; }[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          profiles (id, name, location),
          product_images (id, image_url, is_cover, display_order)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []) as unknown as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
};

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!user) return [];

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const createProduct = async (
    productData: Omit<ProductInsert, 'user_id'>, 
    imageFiles: File[], 
    coverImageIndex: number = 0
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a product",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      // Create product first
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          ...productData,
          user_id: user.id,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload images if provided
      if (imageFiles.length > 0) {
        const imageUrls = await uploadImages(imageFiles);
        
        // Insert product images
        const productImages = imageUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          is_cover: index === coverImageIndex,
          display_order: index,
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(productImages);

        if (imagesError) throw imagesError;
      }

      toast({
        title: "Success!",
        description: "Product listed successfully",
      });

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Database['public']['Tables']['categories']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

export const useProductDetail = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (id, name),
            profiles (id, name, location),
            product_images (id, image_url, is_cover, display_order)
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setProduct(data as unknown as Product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  return { product, loading };
};

export const useMyListings = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMyProducts = async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          profiles (id, name, location),
          product_images (id, image_url, is_cover, display_order)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []) as unknown as Product[]);
    } catch (error) {
      console.error('Error fetching my products:', error);
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Product deleted successfully",
      });

      fetchMyProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [user]);

  return { products, loading, deleteProduct, refetch: fetchMyProducts };
};