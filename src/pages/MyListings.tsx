import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { useMyListings } from '@/hooks/useProducts';

const MyListings = () => {
  const { products: listings, loading, deleteProduct } = useMyListings();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await deleteProduct(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground">Manage your products and track their performance</p>
        </div>
        <Button asChild>
          <Link to="/add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="group">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <img
                    src={listing.image_url || '/placeholder.svg'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 left-2 ${getStatusColor(listing.status)}`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </Badge>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{listing.categories?.name || 'Uncategorized'}</Badge>
                    <span className="text-2xl font-bold text-primary">${listing.price}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{listing.title}</h3>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        0
                      </span>
                      <span>❤️ 0</span>
                    </div>
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/product/${listing.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {listings.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">📦</div>
            <h3 className="text-xl font-semibold text-foreground">No listings yet</h3>
            <p className="text-muted-foreground">Start selling by adding your first product</p>
            <Button asChild>
              <Link to="/add-product">Add Your First Product</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;