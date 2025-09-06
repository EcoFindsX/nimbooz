import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Star, MessageCircle } from 'lucide-react';

// Mock purchase history data
const mockPurchases = [
  {
    id: '1',
    orderId: 'ECO-2024-001',
    productId: '2',
    title: 'Antique Wooden Chair',
    price: 75,
    category: 'Furniture',
    image: '/placeholder.svg',
    seller: 'Mike Vintage',
    purchaseDate: '2024-01-20',
    status: 'delivered',
    rating: 5,
    hasReview: true
  },
  {
    id: '2',
    orderId: 'ECO-2024-002',
    productId: '4',
    title: 'Designer Handbag',
    price: 90,
    category: 'Fashion',
    image: '/placeholder.svg',
    seller: 'Emma Style',
    purchaseDate: '2024-01-15',
    status: 'delivered',
    rating: 4,
    hasReview: true
  },
  {
    id: '3',
    orderId: 'ECO-2024-003',
    productId: '5',
    title: 'Retro Gaming Console',
    price: 120,
    category: 'Electronics',
    image: '/placeholder.svg',
    seller: 'GameRetro',
    purchaseDate: '2024-01-10',
    status: 'in-transit',
    rating: null,
    hasReview: false
  },
  {
    id: '4',
    orderId: 'ECO-2023-087',
    productId: '7',
    title: 'Vintage Bicycle',
    price: 200,
    category: 'Sports',
    image: '/placeholder.svg',
    seller: 'CycleVintage',
    purchaseDate: '2023-12-28',
    status: 'delivered',
    rating: 5,
    hasReview: true
  }
];

const PreviousPurchases = () => {
  const [purchases] = useState(mockPurchases);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReceipt = (orderId: string) => {
    // TODO: Implement receipt download
    console.log('Downloading receipt for order:', orderId);
  };

  const contactSeller = (seller: string) => {
    // TODO: Implement messaging
    console.log('Contacting seller:', seller);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Purchase History</h1>
        <p className="text-muted-foreground">Track your orders and manage your purchases</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchase List */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                {/* Product Image */}
                <Link to={`/product/${purchase.productId}`} className="shrink-0">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={purchase.image}
                      alt={purchase.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Purchase Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-2 md:space-y-0">
                    <div>
                      <Link 
                        to={`/product/${purchase.productId}`}
                        className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                      >
                        {purchase.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{purchase.category}</Badge>
                        <Badge className={getStatusColor(purchase.status)}>
                          {purchase.status.replace('-', ' ').charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sold by {purchase.seller} • Order #{purchase.orderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${purchase.price}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Rating (if delivered and reviewed) */}
                  {purchase.status === 'delivered' && purchase.hasReview && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (purchase.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => downloadReceipt(purchase.orderId)}>
                      <Download className="h-3 w-3 mr-1" />
                      Receipt
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => contactSeller(purchase.seller)}>
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message Seller
                    </Button>
                    {purchase.status === 'delivered' && !purchase.hasReview && (
                      <Button variant="outline" size="sm">
                        <Star className="h-3 w-3 mr-1" />
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPurchases.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">📦</div>
            <h3 className="text-xl font-semibold text-foreground">No purchases found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters to see more results'
                : 'Start shopping to see your purchase history here'
              }
            </p>
            <Button asChild>
              <Link to="/feed">Browse Products</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousPurchases;