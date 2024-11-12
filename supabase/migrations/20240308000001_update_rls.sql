-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can insert their own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can update their own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can delete their own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can view their own generated recipes" ON public.generated_recipes;
DROP POLICY IF EXISTS "Users can insert their own generated recipes" ON public.generated_recipes;
DROP POLICY IF EXISTS "Users can update their own generated recipes" ON public.generated_recipes;
DROP POLICY IF EXISTS "Users can delete their own generated recipes" ON public.generated_recipes;

-- Create updated policies for recipes
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

-- Create updated policies for generated_recipes
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

-- Ensure RLS is enabled
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_recipes ENABLE ROW LEVEL SECURITY;