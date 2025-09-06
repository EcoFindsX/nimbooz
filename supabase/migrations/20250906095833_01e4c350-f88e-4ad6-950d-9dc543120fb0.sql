-- Create function to get user conversations
CREATE OR REPLACE FUNCTION get_user_conversations(user_uuid UUID)
RETURNS TABLE(
  id UUID,
  product_id UUID,
  seller_id UUID,
  buyer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  product JSON,
  other_user JSON,
  last_message JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.product_id,
    c.seller_id,
    c.buyer_id,
    c.created_at,
    c.updated_at,
    json_build_object(
      'title', p.title,
      'image_url', p.image_url
    ) as product,
    CASE 
      WHEN c.buyer_id = user_uuid THEN
        json_build_object('name', seller_profile.name, 'id', seller_profile.id)
      ELSE
        json_build_object('name', buyer_profile.name, 'id', buyer_profile.id)
    END as other_user,
    (
      SELECT json_build_object(
        'content', m.content,
        'created_at', m.created_at
      )
      FROM messages m 
      WHERE m.conversation_id = c.id 
      ORDER BY m.created_at DESC 
      LIMIT 1
    ) as last_message
  FROM conversations c
  JOIN products p ON c.product_id = p.id
  JOIN profiles buyer_profile ON c.buyer_id = buyer_profile.id
  JOIN profiles seller_profile ON c.seller_id = seller_profile.id
  WHERE c.buyer_id = user_uuid OR c.seller_id = user_uuid
  ORDER BY c.updated_at DESC;
END;
$$;

-- Create function to get conversation details
CREATE OR REPLACE FUNCTION get_conversation_details(conversation_uuid UUID, user_uuid UUID)
RETURNS TABLE(
  id UUID,
  product_id UUID,
  seller_id UUID,
  buyer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  product JSON,
  other_user JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.product_id,
    c.seller_id,
    c.buyer_id,
    c.created_at,
    c.updated_at,
    json_build_object(
      'title', p.title,
      'image_url', p.image_url
    ) as product,
    CASE 
      WHEN c.buyer_id = user_uuid THEN
        json_build_object('name', seller_profile.name, 'id', seller_profile.id)
      ELSE
        json_build_object('name', buyer_profile.name, 'id', buyer_profile.id)
    END as other_user
  FROM conversations c
  JOIN products p ON c.product_id = p.id
  JOIN profiles buyer_profile ON c.buyer_id = buyer_profile.id
  JOIN profiles seller_profile ON c.seller_id = seller_profile.id
  WHERE c.id = conversation_uuid 
    AND (c.buyer_id = user_uuid OR c.seller_id = user_uuid);
END;
$$;

-- Create function to get conversation messages
CREATE OR REPLACE FUNCTION get_conversation_messages(conversation_uuid UUID)
RETURNS TABLE(
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  sender JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.created_at,
    json_build_object('name', p.name) as sender
  FROM messages m
  JOIN profiles p ON m.sender_id = p.id
  WHERE m.conversation_id = conversation_uuid
  ORDER BY m.created_at ASC;
END;
$$;

-- Create function to send a message
CREATE OR REPLACE FUNCTION send_message(
  conversation_uuid UUID,
  sender_uuid UUID,
  message_content TEXT
)
RETURNS TABLE(
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  sender JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message_id UUID;
BEGIN
  -- Insert the message
  INSERT INTO messages (conversation_id, sender_id, content)
  VALUES (conversation_uuid, sender_uuid, message_content)
  RETURNING messages.id INTO new_message_id;
  
  -- Update conversation timestamp
  UPDATE conversations 
  SET updated_at = NOW() 
  WHERE conversations.id = conversation_uuid;
  
  -- Return the new message with sender info
  RETURN QUERY
  SELECT 
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.created_at,
    json_build_object('name', p.name) as sender
  FROM messages m
  JOIN profiles p ON m.sender_id = p.id
  WHERE m.id = new_message_id;
END;
$$;

-- Create function to create or get conversation
CREATE OR REPLACE FUNCTION create_or_get_conversation(
  product_uuid UUID,
  buyer_uuid UUID,
  seller_uuid UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Check if conversation already exists
  SELECT id INTO conversation_id
  FROM conversations
  WHERE product_id = product_uuid 
    AND buyer_id = buyer_uuid 
    AND seller_id = seller_uuid;
  
  -- If not found, create new conversation
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (product_id, buyer_id, seller_id)
    VALUES (product_uuid, buyer_uuid, seller_uuid)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$;