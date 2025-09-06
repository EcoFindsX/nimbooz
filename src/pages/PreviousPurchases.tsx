import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Star, MessageCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

const PreviousPurchases = () => {
  const { orders, loading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPurchases = orders.filter(order => {
    const title = order.products?.title || '';
    const seller = order.seller_profile?.name || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReceipt = (orderId: string) => {
    console.log('Downloading receipt for order:', orderId);
  };

  const contactSeller = (seller: string) => {
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchase List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  <div className="w-24 h-24 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                  {/* Product Image */}
                  <Link to={`/product/${purchase.product_id}`} className="shrink-0">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={purchase.products?.image_url || '/placeholder.svg'}
                        alt={purchase.products?.title || 'Product'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>

                  {/* Purchase Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-2 md:space-y-0">
                      <div>
                        <Link 
                          to={`/product/${purchase.product_id}`}
                          className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                        >
                          {purchase.products?.title || 'Unknown Product'}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">
                            {purchase.products?.categories?.name || 'Uncategorized'}
                          </Badge>
                          <Badge className={getStatusColor(purchase.status)}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sold by {purchase.seller_profile?.name || 'Unknown Seller'} • Order #{purchase.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${purchase.total_price}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadReceipt(purchase.id)}>
                        <Download className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => contactSeller(purchase.seller_profile?.name || '')}>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message Seller
                      </Button>
                      {purchase.status === 'completed' && (
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
      )}

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