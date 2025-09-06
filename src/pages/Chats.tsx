import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock } from 'lucide-react';
import { useConversations } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';

const Chats = () => {
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No messages yet</h2>
        <p className="text-muted-foreground">Start browsing products to connect with sellers</p>
        <Link 
          to="/feed" 
          className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <Badge variant="secondary">{conversations.length}</Badge>
      </div>

      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Link key={conversation.id} to={`/chat/${conversation.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {conversation.other_user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {conversation.other_user?.name || 'Unknown User'}
                      </h3>
                      {conversation.last_message && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      About: {conversation.product?.title}
                    </p>
                    
                    {conversation.last_message ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                  
                  {conversation.product?.image_url && (
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={conversation.product.image_url} 
                        alt={conversation.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Chats;