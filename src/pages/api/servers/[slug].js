import { getUserFromRequest } from '../../../lib/auth.js';
import { getDatabase, getServerBySlug, updateServer, deleteServer } from '../../../lib/database.js';
import { enrichServerWithGithubData } from '../../../lib/github.js';

export const prerender = false;

export async function GET({ params, locals }) {
  try {
    const { slug } = params;
    const db = getDatabase(locals.runtime.env);
    
    const server = await getServerBySlug(db, slug);
    if (!server) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse tags from JSON string
    const serverWithParsedTags = {
      ...server,
      tags: server.tags ? JSON.parse(server.tags) : []
    };
    
    return new Response(JSON.stringify({
      success: true,
      server: serverWithParsedTags
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT({ params, request, locals }) {
  try {
    const { slug } = params;
    const user = getUserFromRequest(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = getDatabase(locals.runtime.env);
    
    // Check if server exists and user owns it
    const existingServer = await getServerBySlug(db, slug);
    if (!existingServer) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (existingServer.owner_user_id !== user.userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const serverData = await request.json();
    
    // Enrich with GitHub data if GitHub URL provided
    const enrichedData = await enrichServerWithGithubData(serverData);
    
    // Update server
    await updateServer(db, slug, enrichedData);
    
    return new Response(JSON.stringify({
      success: true,
      server: enrichedData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Update server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE({ params, request, locals }) {
  try {
    const { slug } = params;
    const user = getUserFromRequest(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = getDatabase(locals.runtime.env);
    
    // Check if server exists and user owns it
    const existingServer = await getServerBySlug(db, slug);
    if (!existingServer) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (existingServer.owner_user_id !== user.userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete server
    await deleteServer(db, slug);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Server deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Delete server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 