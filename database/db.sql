CREATE TABLE users
(
  user_id       SERIAL        NOT NULL,
  login_email   VARCHAR(255)  NULL    ,
  password      VARCHAR (255) NOT NULL,
  username      VARCHAR (255) NOT NULL,
  icon          TEXT NULL     DEFAULT 'data:image/jpeg;base64,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',
  isAdmin       BOOLEAN       NOT NULL DEFAULT false,
  liked_post_id INTEGER       NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE recipes
(
  recipe_id          SERIAL       NOT NULL,
  recipe_name        VARCHAR (255) NOT NULL,
  image              TEXT          NOT NULL,
  cooking_level      VARCHAR (255) NOT NULL,
  recipe_description VARCHAR (255) NOT NULL,
  PRIMARY KEY (recipe_id)
);

CREATE TABLE steps
(
  step_id          SERIAL        NOT NULL,
  image            TEXT          NOT NULL,
  step_number      INTEGER       NOT NULL,
  step_description VARCHAR (255) NOT NULL,
  recipe_id        INTEGER       NOT NULL,
  PRIMARY KEY (step_id)
);

CREATE TABLE posts
(
  post_id     SERIAL       NOT NULL,
  liked_count INTEGER       NULL DEFAULT 0,
  saved_count INTEGER       NULL DEFAULT 0,
  image       TEXT         NULL DEFAULT 'data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=',
  content     VARCHAR (255) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE      NOT NULL DEFAULT NOW(),
  user_id     INTEGER       NOT NULL,
  PRIMARY KEY (post_id)
);

CREATE TABLE tag
(
  tag_id      SERIAL  NOT NULL,
  tag_content TEXT    NULL    ,
  post_id     INTEGER NOT NULL,
  recipe_id   INTEGER NOT NULL,
  PRIMARY KEY (tag_id)
);

CREATE TABLE ingredient
(
  ingredient_id SERIAL       NOT NULL    ,
  ingredient    TEXT         NOT NULL    ,
  PRIMARY KEY (ingredient_id)
);

CREATE TABLE liked_posts
(
  liked_post_id SERIAL  NOT NULL,
  liked         BOOLEAN NOT NULL DEFAULT false,
  user_id       INTEGER NOT NULL,
  post_id       INTEGER NOT NULL,
  PRIMARY KEY (liked_post_id)
);

CREATE TABLE saved_posts
(
  saved_post_id SERIAL  NOT NULL,
  saved         BOOLEAN NOT NULL,
  user_id       INTEGER NOT NULL,
  post_id       INTEGER NOT NULL,
  PRIMARY KEY (saved_post_id)
);

CREATE TABLE saved_recipe
(
  recipe_id       INTEGER NOT NULL,
  saved_recipe_id SERIAL  NOT NULL,
  user_id         INTEGER NOT NULL,
  PRIMARY KEY (saved_recipe_id)
);

ALTER TABLE posts
  ADD CONSTRAINT FK_users_TO_posts
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE saved_recipe
  ADD CONSTRAINT FK_recipes_TO_saved_recipe
    FOREIGN KEY (recipe_id)
    REFERENCES recipes (recipe_id);

ALTER TABLE saved_recipe
  ADD CONSTRAINT FK_users_TO_saved_recipe
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE saved_posts
  ADD CONSTRAINT FK_users_TO_saved_posts
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE saved_posts
  ADD CONSTRAINT FK_posts_TO_saved_posts
    FOREIGN KEY (post_id)
    REFERENCES posts (post_id);

ALTER TABLE liked_posts
  ADD CONSTRAINT FK_users_TO_liked_posts
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE liked_posts
  ADD CONSTRAINT FK_posts_TO_liked_posts
    FOREIGN KEY (post_id)
    REFERENCES posts (post_id);

ALTER TABLE steps
  ADD CONSTRAINT FK_recipes_TO_steps
    FOREIGN KEY (recipe_id)
    REFERENCES recipes (recipe_id);

ALTER TABLE tag
  ADD CONSTRAINT FK_posts_TO_tag
    FOREIGN KEY (post_id)
    REFERENCES posts (post_id);

ALTER TABLE tag
  ADD CONSTRAINT FK_recipes_TO_tag
    FOREIGN KEY (recipe_id)
    REFERENCES recipes (recipe_id);

CREATE TABLE rep_ingredients (rep_ingre_id SERIAL primary key, recipe_id INTEGER not NULL, ingredient_id INTEGER not NULL);

ALTER TABLE public.rep_ingredients ADD CONSTRAINT rep_ingredients_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id);

ALTER TABLE public.rep_ingredients ADD CONSTRAINT rep_ingredients_fk_1 FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(ingredient_id);

