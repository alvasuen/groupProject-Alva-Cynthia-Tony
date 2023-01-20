ALTER TABLE public.rep_ingredients ADD CONSTRAINT rep_ingredients_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id);
ALTER TABLE public.rep_ingredients ADD CONSTRAINT rep_ingredients_fk_1 FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(ingredient_id);

INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (2,1),
	 (2,39),
	 (2,3),
	 (2,2),
	 (3,4),
	 (3,3),
	 (3,5),
	 (3,6),
	 (3,7),
	 (3,8);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (3,9),
	 (3,10),
	 (4,11),
	 (4,12),
	 (4,13),
	 (4,14),
	 (4,2),
	 (4,16),
	 (7,12),
	 (7,13);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (7,3),
	 (7,15),
	 (7,5),
	 (7,17),
	 (8,18),
	 (8,5),
	 (8,19),
	 (8,22),
	 (8,23),
	 (9,12);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (9,2),
	 (9,18),
	 (9,19),
	 (12,20),
	 (12,5),
	 (12,21),
	 (12,4),
	 (12,3),
	 (12,24),
	 (12,25);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (12,6),
	 (12,27),
	 (12,26),
	 (12,28),
	 (12,9),
	 (12,29),
	 (11,30),
	 (11,31),
	 (11,32),
	 (11,33);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (11,34),
	 (11,35),
	 (11,36),
	 (11,37),
	 (10,38),
	 (10,28),
	 (10,39),
	 (10,40),
	 (10,4),
	 (10,48);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (10,41),
	 (10,42),
	 (10,43),
	 (10,44),
	 (10,45),
	 (13,38),
	 (13,4),
	 (13,39),
	 (13,3),
	 (13,8);
INSERT INTO public.rep_ingredients (recipe_id,ingredient_id) VALUES
	 (13,47);

ALTER TABLE public.steps ALTER COLUMN image DROP NOT NULL;