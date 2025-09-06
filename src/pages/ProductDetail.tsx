import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share2, MessageCircle, ArrowLeft, ShoppingCart, MapPin } from 'lucide-react';

// Mock product data
const mockProduct = {
  id: '1',
  title: 'Vintage Leather Jacket',
  price: 45,
  category: 'Fashion',
  condition: 'Good',
  description: 'Beautiful vintage leather jacket in excellent condition. Perfect for anyone looking to add a classic piece to their wardrobe. Has been well-maintained and shows minimal signs of wear.',
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  location: 'New York, NY',
  seller: {
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    rating: 4.8,
    totalSales: 23,
    joinedDate: '2023-06-15'
  },
  createdAt: '2024-01-15',
  views: 24,
  likes: 12,
  isLiked: false
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product] = useState(mockProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(product.isLiked);

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log('Adding to cart:', product.id);
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
    // TODO: Implement share functionality
    navigator.share?.({
      title: product.title,
      text: product.description,
      url: window.location.href,
    });
  };

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
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
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
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant="outline">{product.condition}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
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
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback>{product.seller.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{product.seller.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ⭐ {product.seller.rating} • {product.seller.totalSales} sales
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Member since {new Date(product.seller.joinedDate).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleContactSeller}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full" size="lg" onClick={handleContactSeller}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div>👁️ {product.views} views</div>
            <div>❤️ {product.likes} likes</div>
            <div>📅 Listed on {new Date(product.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;