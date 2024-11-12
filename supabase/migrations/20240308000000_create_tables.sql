-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  author TEXT NOT NULL,
  trust_score INTEGER DEFAULT 50,
  votes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  cuisine_type TEXT,
  prep_time TEXT,
  cooking_time TEXT,
  servings TEXT,
  difficulty TEXT,
  dietary_tags TEXT[],
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create generated_recipes table
CREATE TABLE IF NOT EXISTS public.generated_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time TEXT,
  cook_time TEXT,
  total_time TEXT,
  difficulty TEXT,
  nutrition JSONB,
  plating TEXT,
  history TEXT,
  cuisine_type TEXT,
  dietary_restrictions TEXT[],
  alternative_ingredients JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for recipes
CREATE POLICY "Enable read access for all users"
    ON public.recipes FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.recipes FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on user_id"
    ON public.recipes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.recipes FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for generated_recipes
CREATE POLICY "Enable read for users based on user_id"
    ON public.generated_recipes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.generated_recipes FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on user_id"
    ON public.generated_recipes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.generated_recipes FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to handle recipe votes
CREATE OR REPLACE FUNCTION handle_recipe_vote()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.votes > OLD.votes THEN
        NEW.trust_score = LEAST(100, OLD.trust_score + 2);
    ELSIF NEW.votes < OLD.votes THEN
        NEW.trust_score = GREATEST(0, OLD.trust_score - 2);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote handling
CREATE TRIGGER recipe_vote_trigger
    BEFORE UPDATE OF votes ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION handle_recipe_vote();