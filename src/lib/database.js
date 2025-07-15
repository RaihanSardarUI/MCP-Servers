export function getDatabase(env) {
  return env.DB;
}

export async function createUser(db, { email, password_hash, name, avatar_url }) {
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, name, avatar_url)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = await stmt.bind(email, password_hash, name, avatar_url).run();
  return result;
}

export async function getUserByEmail(db, email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const result = await stmt.bind(email).first();
  return result;
}

export async function getUserById(db, id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const result = await stmt.bind(id).first();
  return result;
}

export async function createServer(db, serverData) {
  const stmt = db.prepare(`
    INSERT INTO servers (slug, name, description, logo_url, website_url, github_repo_url, readme_markdown, tags, stars, forks, owner_user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = await stmt.bind(
    serverData.slug,
    serverData.name,
    serverData.description,
    serverData.logo_url,
    serverData.website_url,
    serverData.github_repo_url,
    serverData.readme_markdown,
    JSON.stringify(serverData.tags || []),
    serverData.stars || 0,
    serverData.forks || 0,
    serverData.owner_user_id
  ).run();
  
  return result;
}

export async function getServers(db, { limit = 50, offset = 0, sort = 'newest' } = {}) {
  let orderBy = 'created_at DESC';
  if (sort === 'stars') orderBy = 'stars DESC';
  if (sort === 'alphabetical') orderBy = 'name ASC';
  
  const stmt = db.prepare(`
    SELECT s.*, u.name as owner_name, u.avatar_url as owner_avatar
    FROM servers s
    JOIN users u ON s.owner_user_id = u.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `);
  
  const result = await stmt.bind(limit, offset).all();
  return result.results || [];
}

export async function getServerBySlug(db, slug) {
  const stmt = db.prepare(`
    SELECT s.*, u.name as owner_name, u.avatar_url as owner_avatar, u.email as owner_email
    FROM servers s
    JOIN users u ON s.owner_user_id = u.id
    WHERE s.slug = ?
  `);
  
  const result = await stmt.bind(slug).first();
  return result;
}

export async function updateServer(db, slug, serverData) {
  const stmt = db.prepare(`
    UPDATE servers 
    SET name = ?, description = ?, logo_url = ?, website_url = ?, github_repo_url = ?, readme_markdown = ?, tags = ?, stars = ?, forks = ?, updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `);
  
  const result = await stmt.bind(
    serverData.name,
    serverData.description,
    serverData.logo_url,
    serverData.website_url,
    serverData.github_repo_url,
    serverData.readme_markdown,
    JSON.stringify(serverData.tags || []),
    serverData.stars || 0,
    serverData.forks || 0,
    slug
  ).run();
  
  return result;
}

export async function deleteServer(db, slug) {
  const stmt = db.prepare('DELETE FROM servers WHERE slug = ?');
  const result = await stmt.bind(slug).run();
  return result;
}

export async function getServersByUserId(db, userId) {
  const stmt = db.prepare('SELECT * FROM servers WHERE owner_user_id = ? ORDER BY created_at DESC');
  const result = await stmt.bind(userId).all();
  return result.results || [];
} 