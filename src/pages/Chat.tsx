import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send } from 'lucide-react';
import { useConversations, useMessages } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const { conversations } = useConversations();
  const { messages, loading, sendMessage } = useMessages(conversationId || '');

  const currentConversation = conversations.find(c => c.id === conversationId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage.trim());
    if (success) {
      setNewMessage('');
    }
  };

  const getOtherParticipant = () => {
    if (!currentConversation || !user) return null;
    
    if (currentConversation.buyer_id === user.id) {
      return currentConversation.seller;
    } else {
      return currentConversation.buyer;
    }
  };

  const otherParticipant = getOtherParticipant();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/chats">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chats
          </Link>
        </Button>
        {currentConversation && (
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-semibold">
                {otherParticipant?.name || 'Unknown User'}
              </h1>
              <p className="text-sm text-muted-foreground">
                About: {currentConversation.products?.title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender_id === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;