import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User } from 'lucide-react';
import { useConversations } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';

const Chats = () => {
  const { conversations, loading } = useConversations();
  const { user } = useAuth();

  const getOtherParticipant = (conversation: any) => {
    if (!user) return null;
    
    if (conversation.buyer_id === user.id) {
      return {
        name: conversation.seller?.name || 'Unknown User',
        role: 'Seller'
      };
    } else {
      return {
        name: conversation.buyer?.name || 'Unknown User',
        role: 'Buyer'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Your conversations with other users</p>
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            
            return (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Link to={`/chat/${conversation.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground truncate">
                            {otherParticipant?.name}
                          </h3>
                          <Badge variant="secondary" className="ml-2">
                            {otherParticipant?.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          About: {conversation.products?.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {conversations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">💬</div>
            <h3 className="text-xl font-semibold text-foreground">No conversations yet</h3>
            <p className="text-muted-foreground">
              Start a conversation by contacting a seller on a product page
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;