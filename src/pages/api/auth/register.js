import { hashPassword, generateToken } from '../../../lib/auth.js';
import { getDatabase, createUser, getUserByEmail } from '../../../lib/database.js';

export const prerender = false;

export async function POST({ request, locals }) {
  try {
    const { email, password, name } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = getDatabase(locals.runtime.env);
    
    // Check if user already exists
    const existingUser = await getUserByEmail(db, email);
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Hash password and create user
    const password_hash = await hashPassword(password);
    const result = await createUser(db, {
      email,
      password_hash,
      name,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });
    
    // Generate JWT token
    const token = generateToken(result.meta.last_row_id);
    
    return new Response(JSON.stringify({
      success: true,
      token,
      user: {
        id: result.meta.last_row_id,
        email,
        name
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 