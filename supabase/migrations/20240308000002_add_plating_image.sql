-- Add plating_image column to generated_recipes table
ALTER TABLE public.generated_recipes
ADD COLUMN plating_image TEXT;