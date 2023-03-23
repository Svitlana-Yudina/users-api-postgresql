CREATE TABLE IF NOT EXISTS profiles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    state character varying(10) NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    "dateCreate" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profile_id integer NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT fk_users_profile FOREIGN KEY (profile_id)
        REFERENCES profiles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

INSERT INTO profiles (
first_name, last_name, state) VALUES 
('Jim'::character varying, 'Karry'::character varying, 'male'::character varying),
('Kate'::character varying, 'Larson'::character varying, 'female'::character varying),
('Pol'::character varying, 'Mackartney'::character varying, 'male'::character varying);

INSERT INTO users (
username, email, role, profile_id) VALUES
('Jim'::character varying, 'mask65@gmail.com'::character varying, 'admin'::character varying, '1'::integer),
('Kate'::character varying, 'kitty@gmail.com'::character varying, 'user'::character varying, '2'::integer),
('Pol'::character varying, 'bit@gmail.com'::character varying, 'admin'::character varying, '3'::integer);
