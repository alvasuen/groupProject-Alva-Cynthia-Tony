ALTER TABLE public.rep_ingredients ADD CONSTRAINT rep_ingredients_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id);
ALTER TABLE public.rep_ingredients ADD CONSTRAINT rep_ingredients_fk_1 FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(ingredient_id);

