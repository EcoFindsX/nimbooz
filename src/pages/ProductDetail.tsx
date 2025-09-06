import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share2, MessageCircle, ArrowLeft, MapPin } from 'lucide-react';
import { useProductDetail } from '@/hooks/useProducts';
import { useConversations } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product, loading } = useProductDetail(id || '');
  const { createConversation } = useConversations();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleStartChat = async () => {
    if (product && product.user_id && user?.id !== product.user_id) {
      const conversation = await createConversation(product.user_id, product.id);
      if (conversation) {
        navigate(`/chat/${conversation.id}`);
      }
    }
  };

  const handleContactSeller = () => {
    // TODO: Implement messaging
    console.log('Contacting seller');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleShare = () => {
    if (product) {
      navigator.share?.({
        title: product.title,
        text: product.description || '',
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-20 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-12 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
        <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/feed')} className="mt-4">
          Browse Products
        </Button>
      </div>
    );
  }

  const images = product.product_images && product.product_images.length > 0 
    ? product.product_images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
    : ['/placeholder.svg'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{product.categories?.name || 'Uncategorized'}</Badge>
                  <Badge variant="outline">{product.status}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.profiles?.location || 'Location not specified'}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handleLike}>
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-4xl font-bold text-primary">${product.price}</div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {product.profiles?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">
                    {product.profiles?.name || 'Unknown Seller'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Listed on {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
                {user?.id !== product.user_id && (
                  <Button variant="outline" size="sm" onClick={handleStartChat}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {user?.id !== product.user_id && (
              <Button onClick={handleStartChat} className="w-full" size="lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;