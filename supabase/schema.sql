-- ===================================
-- Studio Cloud Database Schema
-- ===================================

-- ===================================
-- 1. STUDIOS (בתי צילום)
-- ===================================
CREATE TABLE studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp_number TEXT NOT NULL,
  storage_quota BIGINT DEFAULT 107374182400, -- 100GB default
  used_storage BIGINT DEFAULT 0,
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'basic', 'pro', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_studios_email ON studios(email);
CREATE INDEX idx_studios_active ON studios(is_active);

-- ===================================
-- 2. PROJECTS (אירועים/פרויקטים)
-- ===================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT DEFAULT 'wedding' CHECK (event_type IN ('wedding', 'bar_mitzvah', 'corporate', 'birthday', 'other')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'in_backup', 'completed', 'archived')),
  folder_path TEXT NOT NULL,
  total_size BIGINT DEFAULT 0,
  file_count INTEGER DEFAULT 0,
  photographer_name TEXT,
  photographer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  moved_to_work_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_projects_studio ON projects(studio_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_event_date ON projects(event_date);
CREATE INDEX idx_projects_folder_path ON projects(folder_path);

-- ===================================
-- 3. FILES (קבצים)
-- ===================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('video', 'image', 'raw', 'other')),
  mime_type TEXT NOT NULL,
  storage_tier TEXT DEFAULT 'hot' CHECK (storage_tier IN ('hot', 'warm', 'cold')),
  cdn_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_files_type ON files(file_type);
CREATE INDEX idx_files_path ON files(file_path);
CREATE INDEX idx_files_uploaded ON files(uploaded_at DESC);

-- ===================================
-- 4. SHARE_LINKS (קישורים משותפים)
-- ===================================
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64'),
  expires_at TIMESTAMPTZ,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  max_downloads INTEGER,
  download_count INTEGER DEFAULT 0,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_project ON share_links(project_id);
CREATE INDEX idx_share_links_active ON share_links(is_active) WHERE is_active = true;

-- ===================================
-- 5. WHATSAPP_MESSAGES (הודעות WhatsApp)
-- ===================================
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  recipient_number TEXT NOT NULL,
  message_text TEXT NOT NULL,
  link_sent TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
  external_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_whatsapp_project ON whatsapp_messages(project_id);
CREATE INDEX idx_whatsapp_status ON whatsapp_messages(status);

-- ===================================
-- 6. ACTIVITY_LOG (לוג פעילות)
-- ===================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('upload', 'download', 'delete', 'share', 'view', 'create', 'update')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'file', 'share_link')),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activity_project ON activity_log(project_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);

-- ===================================
-- 7. USER_PROFILES (פרופילי משתמשים)
-- ===================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_user_profiles_studio ON user_profiles(studio_id);

-- ===================================
-- TRIGGERS & FUNCTIONS
-- ===================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_studios_updated_at BEFORE UPDATE ON studios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update studio storage usage
CREATE OR REPLACE FUNCTION update_studio_storage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE studios
    SET used_storage = used_storage + NEW.file_size
    WHERE id = (SELECT studio_id FROM projects WHERE id = NEW.project_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE studios
    SET used_storage = used_storage - OLD.file_size
    WHERE id = (SELECT studio_id FROM projects WHERE id = OLD.project_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for storage calculation
CREATE TRIGGER trigger_update_studio_storage
AFTER INSERT OR DELETE ON files
FOR EACH ROW EXECUTE FUNCTION update_studio_storage();

-- Function: Update project total size
CREATE OR REPLACE FUNCTION update_project_size()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects
    SET
      total_size = total_size + NEW.file_size,
      file_count = file_count + 1
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects
    SET
      total_size = total_size - OLD.file_size,
      file_count = file_count - 1
    WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for project size
CREATE TRIGGER trigger_update_project_size
AFTER INSERT OR DELETE ON files
FOR EACH ROW EXECUTE FUNCTION update_project_size();

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS on all tables
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Studios: Users can only see their own studio
CREATE POLICY "Users can view their own studio"
  ON studios FOR SELECT
  USING (id IN (
    SELECT studio_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own studio"
  ON studios FOR UPDATE
  USING (id IN (
    SELECT studio_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Projects: Users can see projects from their studio
CREATE POLICY "Users can view studio projects"
  ON projects FOR SELECT
  USING (studio_id IN (
    SELECT studio_id FROM user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (studio_id IN (
    SELECT studio_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'member')
  ));

CREATE POLICY "Users can update studio projects"
  ON projects FOR UPDATE
  USING (studio_id IN (
    SELECT studio_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'member')
  ));

CREATE POLICY "Users can delete studio projects"
  ON projects FOR DELETE
  USING (studio_id IN (
    SELECT studio_id FROM user_profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Files: Users can see files from their studio's projects
CREATE POLICY "Users can view project files"
  ON files FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM projects p
    JOIN user_profiles up ON p.studio_id = up.studio_id
    WHERE up.id = auth.uid()
  ));

CREATE POLICY "Users can upload files"
  ON files FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM projects p
    JOIN user_profiles up ON p.studio_id = up.studio_id
    WHERE up.id = auth.uid() AND up.role IN ('owner', 'admin', 'member')
  ));

CREATE POLICY "Users can delete files"
  ON files FOR DELETE
  USING (project_id IN (
    SELECT p.id FROM projects p
    JOIN user_profiles up ON p.studio_id = up.studio_id
    WHERE up.id = auth.uid() AND up.role IN ('owner', 'admin', 'member')
  ));

-- Share Links: Users can manage links for their projects
CREATE POLICY "Users can view their share links"
  ON share_links FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM projects p
    JOIN user_profiles up ON p.studio_id = up.studio_id
    WHERE up.id = auth.uid()
  ));

CREATE POLICY "Users can create share links"
  ON share_links FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM projects p
    JOIN user_profiles up ON p.studio_id = up.studio_id
    WHERE up.id = auth.uid() AND up.role IN ('owner', 'admin', 'member')
  ));

-- User Profiles: Users can see and update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

-- Activity Log: Users can view logs for their studio
CREATE POLICY "Users can view activity logs"
  ON activity_log FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM projects p
    JOIN user_profiles up ON p.studio_id = up.studio_id
    WHERE up.id = auth.uid()
  ));
