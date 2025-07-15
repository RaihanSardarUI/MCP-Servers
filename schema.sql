-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Servers table
CREATE TABLE servers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  github_repo_url TEXT,
  readme_markdown TEXT,
  tags TEXT, -- JSON array as text
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  owner_user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_owner ON servers(owner_user_id);
CREATE INDEX idx_servers_created_at ON servers(created_at);
CREATE INDEX idx_users_email ON users(email); 