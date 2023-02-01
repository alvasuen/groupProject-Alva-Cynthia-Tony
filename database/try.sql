CREATE TABLE tag_relate (
	tag_re_id SERIAL NOT NULL,
	tag_id integer NULL,
	rep_id integer NULL,
	post_id integer NULL,
  PRIMARY KEY (tag_re_id)
);
