CREATE TABLE recipes
(
  recipe_id          INTEGER       NOT NULL,
  recipe_name        VARCHAR (255) NOT NULL,
  image              VARCHAR (255) NOT NULL,
  cooking_level      INTEGER       NOT NULL,
  tag                VARCHAR (255) NOT NULL,
  recipe_description VARCHAR (255) NOT NULL,
  ingredient_id      INTEGER       NOT NULL,
  recipe_comments    VARCHAR (255) NULL     COMMENT 'optional',
  PRIMARY KEY (recipe_id)
);