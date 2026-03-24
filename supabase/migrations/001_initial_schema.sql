-- Habilitar PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- ===========================================
-- TABLA: profiles
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  profile_type TEXT NOT NULL DEFAULT 'ambos' CHECK (profile_type IN ('oferente', 'demandante', 'ambos')),
  location_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nuevo Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- TABLA: categories
-- ===========================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT
);

INSERT INTO categories (slug, name, icon, color) VALUES
  ('economica', 'Económica', 'Banknote', '#10B981'),
  ('empleo', 'Empleo', 'Briefcase', '#3B82F6'),
  ('compania', 'Compañía', 'HeartHandshake', '#EC4899'),
  ('salud', 'Salud', 'HeartPulse', '#EF4444'),
  ('vivienda', 'Vivienda', 'Home', '#F59E0B'),
  ('educacion', 'Educación', 'GraduationCap', '#8B5CF6'),
  ('legal', 'Legal', 'Scale', '#6366F1'),
  ('transporte', 'Transporte', 'Car', '#14B8A6'),
  ('alimentacion', 'Alimentación', 'UtensilsCrossed', '#F97316'),
  ('otro', 'Otro', 'HandHelping', '#6B7280');

-- ===========================================
-- TABLA: posts
-- ===========================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL CHECK (post_type IN ('oferta', 'solicitud')),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  location_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  scope TEXT DEFAULT 'local' CHECK (scope IN ('local', 'global')),
  status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'resuelto', 'cerrado')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_created ON posts (created_at DESC);
CREATE INDEX idx_posts_category ON posts (category_id);
CREATE INDEX idx_posts_author ON posts (author_id);
CREATE INDEX idx_posts_status ON posts (status);

-- ===========================================
-- TABLA: comments
-- ===========================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments (post_id, created_at);

-- ===========================================
-- TABLA: likes
-- ===========================================
CREATE TABLE likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- ===========================================
-- TABLA: conversations
-- ===========================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participant_1, participant_2)
);

-- ===========================================
-- TABLA: messages
-- ===========================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles visibles para todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios crean su perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuarios editan su perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories (lectura pública)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories visibles para todos" ON categories FOR SELECT USING (true);

-- Posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts visibles para todos" ON posts FOR SELECT USING (true);
CREATE POLICY "Usuarios crean posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Autores editan sus posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Autores borran sus posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments visibles para todos" ON comments FOR SELECT USING (true);
CREATE POLICY "Usuarios crean comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Autores borran comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- Likes
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes visibles para todos" ON likes FOR SELECT USING (true);
CREATE POLICY "Usuarios dan like" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios quitan like" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participantes ven conversaciones" ON conversations FOR SELECT
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Usuarios crean conversaciones" ON conversations FOR INSERT
  WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participantes ven mensajes" ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  ));
CREATE POLICY "Usuarios envían mensajes" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  ));
CREATE POLICY "Participantes actualizan mensajes" ON messages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  ));

-- ===========================================
-- STORAGE BUCKET
-- ===========================================
-- Ejecutar en Supabase Dashboard > Storage:
-- Crear bucket "media" con acceso público
