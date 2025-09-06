import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
const ecofindsLogo = '/lovable-uploads/009b3627-c86c-4bc3-9c4d-e1e67feb1fcd.png';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/feed', { replace: true });
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-sage via-earth-beige to-earth-sage">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <img src={ecofindsLogo} alt="EcoFinds" className="h-24 w-24 mx-auto" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Eco<span className="text-primary">Finds</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover unique finds while supporting sustainable consumption. 
              Join our community of conscious consumers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/auth?tab=signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/auth?tab=login">Sign In</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Sustainable</h3>
              <p className="text-sm text-muted-foreground">Extend product lifecycles</p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Circular Economy</h3>
              <p className="text-sm text-muted-foreground">Reduce waste together</p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Unique Finds</h3>
              <p className="text-sm text-muted-foreground">Discover one-of-a-kind items</p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Community</h3>
              <p className="text-sm text-muted-foreground">Connect with like-minded people</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
