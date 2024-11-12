import { createClient } from '@supabase/supabase-js';
import type { Recipe } from '../types/recipe';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initializeDatabase = async () => {
  try {
    const { error: recipesError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);

    const { error: generatedError } = await supabase
      .from('generated_recipes')
      .select('id')
      .limit(1);

    if (recipesError) {
      console.error('Recipes table error:', recipesError);
      throw new Error(`Failed to initialize recipes table: ${recipesError.message}`);
    }

    if (generatedError) {
      console.error('Generated recipes table error:', generatedError);
      throw new Error(`Failed to initialize generated recipes table: ${generatedError.message}`);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('OAuth error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      throw error;
    }
    return user;
  } catch (error) {
    console.error('User fetch error:', error);
    throw error;
  }
};

export const submitRecipe = async (recipe: Partial<Recipe>) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert([{
        ...recipe,
        user_id: user.id,
        author: user.user_metadata?.full_name || 'Anonymous'
      }])
      .select()
      .single();

    if (error) {
      console.error('Recipe submission error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Recipe submission error:', error);
    throw error;
  }
};

export const getRecipes = async () => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Recipe fetch error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Recipe fetch error:', error);
    throw error;
  }
};

export const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Recipe update error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Recipe update error:', error);
    throw error;
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Recipe deletion error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Recipe deletion error:', error);
    throw error;
  }
};

export const saveGeneratedRecipe = async (recipe: Partial<Recipe>) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('generated_recipes')
      .insert([{
        ...recipe,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Generated recipe save error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Generated recipe save error:', error);
    throw error;
  }
};

export const getGeneratedRecipes = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('generated_recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Generated recipes fetch error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Generated recipes fetch error:', error);
    throw error;
  }
};

export const updateGeneratedRecipe = async (id: string, updates: Partial<Recipe>) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('generated_recipes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Generated recipe update error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Generated recipe update error:', error);
    throw error;
  }
};

export const deleteGeneratedRecipe = async (id: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('generated_recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Generated recipe deletion error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Generated recipe deletion error:', error);
    throw error;
  }
};