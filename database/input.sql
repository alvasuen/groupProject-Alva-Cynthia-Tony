ALTER TABLE public.recipes DROP CONSTRAINT fk_ingredient_to_recipes;
ALTER TABLE public.recipes DROP COLUMN ingredient_id;
