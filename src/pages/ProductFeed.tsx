import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Heart } from 'lucide-react';

// Mock data
const mockProducts = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    price: 45,
    category: 'Fashion',
    image: '/placeholder.svg',
    location: 'New York',
    likes: 12
  },
  {
    id: '2',
    title: 'Antique Wooden Chair',
    price: 75,
    category: 'Furniture',
    image: '/placeholder.svg',
    location: 'San Francisco',
    likes: 8
  },
  {
    id: '3',
    title: 'Retro Gaming Console',
    price: 120,
    category: 'Electronics',
    image: '/placeholder.svg',
    location: 'Austin',
    likes: 24
  },
  {
    id: '4',
    title: 'Plant Collection',
    price: 30,
    category: 'Garden',
    image: '/placeholder.svg',
    location: 'Portland',
    likes: 15
  },
  {
    id: '5',
    title: 'Designer Handbag',
    price: 90,
    category: 'Fashion',
    image: '/placeholder.svg',
    location: 'Los Angeles',
    likes: 18
  },
  {
    id: '6',
    title: 'Vintage Camera',
    price: 150,
    category: 'Electronics',
    image: '/placeholder.svg',
    location: 'Chicago',
    likes: 22
  }
];

const categories = ['All', 'Fashion', 'Electronics', 'Furniture', 'Garden', 'Books', 'Sports'];

const ProductFeed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products] = useState(mockProducts);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Discover Finds</h1>
        <p className="text-muted-foreground">Browse unique second-hand items from our community</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <span className="text-sm text-muted-foreground">{product.location}</span>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Heart className="h-3 w-3 mr-1" />
                      {product.likes}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductFeed;