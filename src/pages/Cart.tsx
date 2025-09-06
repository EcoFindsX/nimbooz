import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    if (item.products) {
      return sum + (item.products.price * item.quantity);
    }
    return sum;
  }, 0);
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Browse our marketplace to find amazing deals on unique items</p>
        <Button asChild className="mt-6">
          <Link to="/feed">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground">Review your items before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            if (!item.products) return null;
            
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Link to={`/product/${item.product_id}`} className="shrink-0">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.products.image_url || '/placeholder.svg'}
                          alt={item.products.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link 
                            to={`/product/${item.product_id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {item.products.title}
                          </Link>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">
                              {item.products.categories?.name || 'Uncategorized'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {item.products.profiles?.name || 'Unknown Seller'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            ${(item.products.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">${item.products.price} each</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">${shipping.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/feed">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;