import { getUserFromRequest } from '../../lib/auth.js';
import { getDatabase, getServers, createServer, getUserById } from '../../lib/database.js';
import { enrichServerWithGithubData } from '../../lib/github.js';

export const prerender = false;

export async function GET({ request, locals }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sort = url.searchParams.get('sort') || 'newest';
    
    // Check if database is available
    if (!locals.runtime?.env?.DB) {
      console.error('Database not available:', locals.runtime?.env);
      return new Response(JSON.stringify({ error: 'Database connection failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = getDatabase(locals.runtime.env);
    const servers = await getServers(db, { limit, offset, sort });
    
    // Parse tags from JSON strings
    const serversWithParsedTags = servers.map(server => ({
      ...server,
      tags: server.tags ? JSON.parse(server.tags) : []
    }));
    
    return new Response(JSON.stringify({
      success: true,
      servers: serversWithParsedTags
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get servers error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request, locals }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const serverData = await request.json();
    
    // Validate required fields
    if (!serverData.name) {
      return new Response(JSON.stringify({ error: 'Server name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if database is available
    if (!locals.runtime?.env?.DB) {
      console.error('Database not available:', locals.runtime?.env);
      return new Response(JSON.stringify({ error: 'Database connection failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = getDatabase(locals.runtime.env);
    
    // Verify user exists
    const dbUser = await getUserById(db, user.userId);
    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Enrich with GitHub data if GitHub URL provided
    const enrichedData = await enrichServerWithGithubData({
      ...serverData,
      owner_user_id: user.userId
    });
    
    // Create server
    const result = await createServer(db, enrichedData);
    
    return new Response(JSON.stringify({
      success: true,
      server: {
        id: result.meta.last_row_id,
        ...enrichedData
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Create server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 