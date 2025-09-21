--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: adjust_goal_on_progress_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.adjust_goal_on_progress_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount - OLD.amount_added + NEW.amount_added
  WHERE goal_id = NEW.goal_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.adjust_goal_on_progress_update() OWNER TO postgres;

--
-- Name: calculate_goal_xp(text, numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_goal_xp(goal_type text, target numeric, current numeric) RETURNS integer
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
  base_points INT := 75;  -- fixed for goal_completed
BEGIN
  RETURN base_points +
    CASE
      WHEN goal_type = 'savings' THEN FLOOR(current / 1000) * 1
      WHEN goal_type = 'debt' THEN FLOOR(current / 500) * 2
      WHEN goal_type = 'investment' THEN FLOOR(current / 1000) * 3
      WHEN goal_type = 'spending limit' THEN FLOOR(target / 1000) * 1
      WHEN goal_type = 'donation' THEN FLOOR(current / 100) * 1
      ELSE 0
    END;
END;
$$;


ALTER FUNCTION public.calculate_goal_xp(goal_type text, target numeric, current numeric) OWNER TO postgres;

--
-- Name: complete_challenge_if_met(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.complete_challenge_if_met() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE challenges
  SET 
    challenge_status = 'completed',
    updated_at = CURRENT_TIMESTAMP
  WHERE 
    challenge_id = NEW.challenge_id
    AND current_amount >= target_amount
    AND challenge_status = 'active';

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.complete_challenge_if_met() OWNER TO postgres;

--
-- Name: expire_challenge_if_overdue(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.expire_challenge_if_overdue() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.challenge_status = 'active' AND NEW.end_date < CURRENT_DATE THEN
    UPDATE challenges
    SET 
      challenge_status = 'expired',
      updated_at = CURRENT_TIMESTAMP
    WHERE challenge_id = NEW.challenge_id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.expire_challenge_if_overdue() OWNER TO postgres;

--
-- Name: prevent_duplicate_category(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_duplicate_category() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.custom_category_name := LOWER(NEW.custom_category_name);
    IF EXISTS (
        SELECT 1 FROM categories WHERE LOWER(category_name) = LOWER(NEW.custom_category_name)
    ) THEN
        RAISE EXCEPTION 'Custom category "%s" already exists in global categories.', NEW.custom_category_name;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_duplicate_category() OWNER TO postgres;

--
-- Name: subtract_goal_on_progress_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.subtract_goal_on_progress_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount - OLD.amount_added
  WHERE goal_id = OLD.goal_id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.subtract_goal_on_progress_delete() OWNER TO postgres;

--
-- Name: update_challenge_progress(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_challenge_progress() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE challenges
  SET 
    current_amount = (
      SELECT COALESCE(SUM(progress_amount), 0)
      FROM challenge_progress
      WHERE challenge_id = NEW.challenge_id
    ),
    updated_at = CURRENT_TIMESTAMP
  WHERE challenge_id = NEW.challenge_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_challenge_progress() OWNER TO postgres;

--
-- Name: update_goal_current_amount(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_goal_current_amount() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount + NEW.amount_added
  WHERE goal_id = NEW.goal_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_goal_current_amount() OWNER TO postgres;

--
-- Name: update_goal_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_goal_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_goal_updated_at_column() OWNER TO postgres;

--
-- Name: update_tier_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_tier_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.tier_status := CASE
    WHEN NEW.total_points >= 15000 THEN 'Diamond'
    WHEN NEW.total_points >= 10000 THEN 'Platinum'
    WHEN NEW.total_points >= 6000 THEN 'Gold'
    WHEN NEW.total_points >= 3000 THEN 'Silver'
    WHEN NEW.total_points >= 1000 THEN 'Bronze'
    ELSE 'Wood'
  END;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_tier_status() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    account_id integer NOT NULL,
    user_id integer NOT NULL,
    bank_name character varying(100) DEFAULT 'GFV Bank'::character varying NOT NULL,
    account_name character varying(100) DEFAULT 'My Account'::character varying NOT NULL,
    account_type character varying(50) NOT NULL,
    currency character varying(20) DEFAULT 'ZAR'::character varying NOT NULL,
    account_balance numeric(14,2) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT accounts_account_type_check CHECK (((account_type)::text = ANY ((ARRAY['current'::character varying, 'cheque'::character varying, 'savings'::character varying, 'investment'::character varying, 'credit'::character varying, 'fixed deposit'::character varying, 'business'::character varying, 'transmission'::character varying, 'tax-free savings'::character varying, 'trust'::character varying, 'corporate trading'::character varying, 'crypto'::character varying, 'forex'::character varying])::text[]))),
    CONSTRAINT accounts_currency_check CHECK (((currency)::text = ANY ((ARRAY['ZAR'::character varying, 'USD'::character varying, 'EUR'::character varying, 'GBP'::character varying, 'JPY'::character varying, 'CAD'::character varying, 'AUD'::character varying, 'CHF'::character varying, 'CNY'::character varying, 'INR'::character varying, 'KES'::character varying, 'NGN'::character varying, 'BTC'::character varying, 'ETH'::character varying, 'USDT'::character varying, 'BUSD'::character varying, 'LTC'::character varying, 'XRP'::character varying, 'SOL'::character varying, 'BNB'::character varying, 'DOGE'::character varying, 'USDC'::character varying])::text[])))
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_account_id_seq OWNER TO postgres;

--
-- Name: accounts_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_account_id_seq OWNED BY public.accounts.account_id;


--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    achievement_id integer NOT NULL,
    parent_id integer,
    badge_id integer NOT NULL,
    achievement_title character varying(100) NOT NULL,
    achievement_description text NOT NULL,
    achievement_type character varying(50) NOT NULL,
    points_awarded integer NOT NULL,
    trigger_condition_json jsonb NOT NULL,
    is_umbrella boolean DEFAULT false NOT NULL,
    display_order integer DEFAULT 0,
    banner_image_path character varying(255),
    CONSTRAINT achievements_achievement_type_check CHECK (((achievement_type)::text = ANY ((ARRAY['goal'::character varying, 'quiz'::character varying, 'challenge'::character varying, 'transaction'::character varying, 'milestone'::character varying, 'tutorial'::character varying, 'misc'::character varying, 'budget'::character varying, 'ar'::character varying])::text[]))),
    CONSTRAINT achievements_points_awarded_check CHECK ((points_awarded >= 0))
);


ALTER TABLE public.achievements OWNER TO postgres;

--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.achievements_achievement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.achievements_achievement_id_seq OWNER TO postgres;

--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.achievements_achievement_id_seq OWNED BY public.achievements.achievement_id;


--
-- Name: ai_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_scores (
    score_id integer NOT NULL,
    user_id integer NOT NULL,
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    score_value integer NOT NULL,
    financial_health_level character varying(50) NOT NULL,
    CONSTRAINT ai_scores_financial_health_level_check CHECK (((financial_health_level)::text = ANY ((ARRAY['poor'::character varying, 'fair'::character varying, 'average'::character varying, 'good'::character varying, 'excellent'::character varying])::text[])))
);


ALTER TABLE public.ai_scores OWNER TO postgres;

--
-- Name: ai_scores_score_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_scores_score_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_scores_score_id_seq OWNER TO postgres;

--
-- Name: ai_scores_score_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_scores_score_id_seq OWNED BY public.ai_scores.score_id;


--
-- Name: ar_scene_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ar_scene_state (
    scene_id integer NOT NULL,
    user_id integer,
    snapshot_jsonb jsonb,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ar_scene_state OWNER TO postgres;

--
-- Name: ar_scene_state_scene_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ar_scene_state_scene_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ar_scene_state_scene_id_seq OWNER TO postgres;

--
-- Name: ar_scene_state_scene_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ar_scene_state_scene_id_seq OWNED BY public.ar_scene_state.scene_id;


--
-- Name: avatar_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avatar_images (
    avatar_id integer NOT NULL,
    avatar_image_path character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.avatar_images OWNER TO postgres;

--
-- Name: avatar_images_avatar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avatar_images_avatar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avatar_images_avatar_id_seq OWNER TO postgres;

--
-- Name: avatar_images_avatar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avatar_images_avatar_id_seq OWNED BY public.avatar_images.avatar_id;


--
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    badge_id integer NOT NULL,
    badge_title character varying(100) NOT NULL,
    image_path character varying(255) NOT NULL,
    rarity character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT badges_rarity_check CHECK (((rarity)::text = ANY ((ARRAY['Common'::character varying, 'Uncommon'::character varying, 'Rare'::character varying, 'Epic'::character varying, 'Legendary'::character varying, 'Obsidian'::character varying])::text[])))
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: badges_badge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.badges_badge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badges_badge_id_seq OWNER TO postgres;

--
-- Name: badges_badge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.badges_badge_id_seq OWNED BY public.badges.badge_id;


--
-- Name: banner_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banner_images (
    banner_id integer NOT NULL,
    banner_image_path character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.banner_images OWNER TO postgres;

--
-- Name: banner_images_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.banner_images_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banner_images_banner_id_seq OWNER TO postgres;

--
-- Name: banner_images_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.banner_images_banner_id_seq OWNED BY public.banner_images.banner_id;


--
-- Name: budget_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_categories (
    budget_category_id integer NOT NULL,
    budget_id integer NOT NULL,
    category_id integer,
    custom_category_id integer,
    current_amount numeric(12,2) DEFAULT 0,
    target_amount numeric(12,2) NOT NULL,
    CONSTRAINT budget_categories_check CHECK ((((category_id IS NOT NULL) AND (custom_category_id IS NULL)) OR ((category_id IS NULL) AND (custom_category_id IS NOT NULL)))),
    CONSTRAINT budget_categories_current_amount_check CHECK ((current_amount >= (0)::numeric)),
    CONSTRAINT budget_categories_target_amount_check CHECK ((target_amount >= (0)::numeric))
);


ALTER TABLE public.budget_categories OWNER TO postgres;

--
-- Name: budget_categories_budget_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_categories_budget_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_categories_budget_category_id_seq OWNER TO postgres;

--
-- Name: budget_categories_budget_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_categories_budget_category_id_seq OWNED BY public.budget_categories.budget_category_id;


--
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    budget_id integer NOT NULL,
    user_id integer NOT NULL,
    budget_name character varying(100) NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- Name: budgets_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budgets_budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budgets_budget_id_seq OWNER TO postgres;

--
-- Name: budgets_budget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budgets_budget_id_seq OWNED BY public.budgets.budget_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    CONSTRAINT categories_category_name_check CHECK (((category_name)::text = ANY ((ARRAY['groceries'::character varying, 'transport'::character varying, 'fuel'::character varying, 'utilities'::character varying, 'rent'::character varying, 'mortgage'::character varying, 'internet'::character varying, 'phone'::character varying, 'insurance'::character varying, 'medical'::character varying, 'health'::character varying, 'fitness'::character varying, 'education'::character varying, 'subscriptions'::character varying, 'entertainment'::character varying, 'restaurants'::character varying, 'clothing'::character varying, 'personal care'::character varying, 'gifts'::character varying, 'charity'::character varying, 'taxes'::character varying, 'savings'::character varying, 'investments'::character varying, 'loan repayment'::character varying, 'debt'::character varying, 'travel'::character varying, 'accommodation'::character varying, 'salary'::character varying, 'freelance'::character varying, 'bonus'::character varying, 'refund'::character varying, 'transfer in'::character varying, 'transfer out'::character varying, 'cash withdrawal'::character varying, 'cash deposit'::character varying, 'business income'::character varying, 'business expense'::character varying, 'maintenance'::character varying, 'repairs'::character varying, 'childcare'::character varying, 'pets'::character varying, 'home improvement'::character varying, 'fees'::character varying, 'commissions'::character varying, 'interest income'::character varying, 'dividends'::character varying, 'crypto purchase'::character varying, 'crypto sale'::character varying, 'forex'::character varying, 'wallet top-up'::character varying, 'wallet withdrawal'::character varying])::text[])))
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: challenge_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenge_progress (
    challenge_id integer NOT NULL,
    user_id integer NOT NULL,
    participation_status character varying(20) DEFAULT 'invited'::character varying NOT NULL,
    join_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    progress_amount numeric(12,2) DEFAULT 0,
    CONSTRAINT challenge_progress_participation_status_check CHECK (((participation_status)::text = ANY ((ARRAY['invited'::character varying, 'joined'::character varying, 'left'::character varying])::text[])))
);


ALTER TABLE public.challenge_progress OWNER TO postgres;

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenges (
    challenge_id integer NOT NULL,
    community_id integer NOT NULL,
    creator_id integer NOT NULL,
    challenge_title character varying(100) NOT NULL,
    challenge_type character varying(50) NOT NULL,
    target_amount numeric(12,2) NOT NULL,
    current_amount numeric(12,2) DEFAULT 0 NOT NULL,
    start_date date NOT NULL,
    target_date date NOT NULL,
    end_date date,
    banner_id integer DEFAULT 1 NOT NULL,
    category_id integer,
    custom_category_id integer,
    measurement_type character varying(50) NOT NULL,
    difficulty character varying(20) DEFAULT 'easy'::character varying NOT NULL,
    challenge_status character varying(50) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT challenges_challenge_status_check CHECK (((challenge_status)::text = ANY ((ARRAY['active'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'expired'::character varying])::text[]))),
    CONSTRAINT challenges_challenge_type_check CHECK (((challenge_type)::text = ANY ((ARRAY['savings'::character varying, 'debt'::character varying, 'investment'::character varying, 'spending limit'::character varying, 'donation'::character varying])::text[]))),
    CONSTRAINT challenges_check CHECK ((((category_id IS NULL) AND (custom_category_id IS NOT NULL)) OR ((category_id IS NOT NULL) AND (custom_category_id IS NULL)))),
    CONSTRAINT challenges_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying, 'extreme'::character varying])::text[]))),
    CONSTRAINT challenges_measurement_type_check CHECK (((measurement_type)::text = ANY ((ARRAY['amount_saved'::character varying, 'goals_completed'::character varying, 'transactions_logged'::character varying, 'amount_invested'::character varying, 'amount_donated'::character varying, 'spending_within_limit'::character varying])::text[]))),
    CONSTRAINT challenges_target_amount_check CHECK ((target_amount > (0)::numeric))
);


ALTER TABLE public.challenges OWNER TO postgres;

--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.challenges_challenge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.challenges_challenge_id_seq OWNER TO postgres;

--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.challenges_challenge_id_seq OWNED BY public.challenges.challenge_id;


--
-- Name: communities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communities (
    community_id integer NOT NULL,
    owner_id integer NOT NULL,
    community_name character varying(100) NOT NULL,
    description text,
    banner_id integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.communities OWNER TO postgres;

--
-- Name: communities_community_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.communities_community_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communities_community_id_seq OWNER TO postgres;

--
-- Name: communities_community_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.communities_community_id_seq OWNED BY public.communities.community_id;


--
-- Name: community_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_members (
    community_id integer NOT NULL,
    user_id integer NOT NULL,
    membership_status character varying(20) NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT community_members_membership_status_check CHECK (((membership_status)::text = ANY ((ARRAY['invited'::character varying, 'requested'::character varying, 'accepted'::character varying, 'declined'::character varying])::text[])))
);


ALTER TABLE public.community_members OWNER TO postgres;

--
-- Name: custom_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_categories (
    custom_category_id integer NOT NULL,
    user_id integer NOT NULL,
    custom_category_name character varying(100) NOT NULL
);


ALTER TABLE public.custom_categories OWNER TO postgres;

--
-- Name: custom_categories_custom_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_categories_custom_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_categories_custom_category_id_seq OWNER TO postgres;

--
-- Name: custom_categories_custom_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_categories_custom_category_id_seq OWNED BY public.custom_categories.custom_category_id;


--
-- Name: friendships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendships (
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    relationship_status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT friendships_relationship_status_check CHECK (((relationship_status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'declined'::character varying])::text[])))
);


ALTER TABLE public.friendships OWNER TO postgres;

--
-- Name: goal_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goal_progress (
    progress_id integer NOT NULL,
    goal_id integer NOT NULL,
    contributor_id integer NOT NULL,
    progress_date date DEFAULT CURRENT_DATE NOT NULL,
    amount_added numeric(12,2) NOT NULL,
    CONSTRAINT goal_progress_amount_added_check CHECK ((amount_added > (0)::numeric))
);


ALTER TABLE public.goal_progress OWNER TO postgres;

--
-- Name: goal_progress_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.goal_progress_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goal_progress_progress_id_seq OWNER TO postgres;

--
-- Name: goal_progress_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.goal_progress_progress_id_seq OWNED BY public.goal_progress.progress_id;


--
-- Name: goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goals (
    goal_id integer NOT NULL,
    user_id integer NOT NULL,
    goal_name character varying(100) NOT NULL,
    goal_type character varying(50) NOT NULL,
    target_amount numeric(12,2) NOT NULL,
    current_amount numeric(12,2) DEFAULT 0 NOT NULL,
    start_date date NOT NULL,
    target_date date NOT NULL,
    end_date date,
    banner_id integer DEFAULT 1 NOT NULL,
    category_id integer,
    custom_category_id integer,
    goal_status character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT goals_check CHECK ((((category_id IS NULL) AND (custom_category_id IS NOT NULL)) OR ((category_id IS NOT NULL) AND (custom_category_id IS NULL)))),
    CONSTRAINT goals_goal_status_check CHECK (((goal_status)::text = ANY ((ARRAY['in-progress'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'failed'::character varying])::text[]))),
    CONSTRAINT goals_goal_type_check CHECK (((goal_type)::text = ANY ((ARRAY['savings'::character varying, 'debt'::character varying, 'investment'::character varying, 'spending limit'::character varying, 'donation'::character varying])::text[]))),
    CONSTRAINT goals_target_amount_check CHECK ((target_amount > (0)::numeric))
);


ALTER TABLE public.goals OWNER TO postgres;

--
-- Name: goals_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.goals_goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goals_goal_id_seq OWNER TO postgres;

--
-- Name: goals_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.goals_goal_id_seq OWNED BY public.goals.goal_id;


--
-- Name: leaderboard_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaderboard_entries (
    entry_id integer NOT NULL,
    user_id integer NOT NULL,
    leaderboard_score integer NOT NULL,
    ranking integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leaderboard_entries OWNER TO postgres;

--
-- Name: leaderboard_entries_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leaderboard_entries_entry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leaderboard_entries_entry_id_seq OWNER TO postgres;

--
-- Name: leaderboard_entries_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leaderboard_entries_entry_id_seq OWNED BY public.leaderboard_entries.entry_id;


--
-- Name: learning_modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.learning_modules (
    module_id integer NOT NULL,
    module_title character varying(100) NOT NULL,
    topic character varying(100) NOT NULL,
    difficulty character varying(50),
    module_banner_id integer DEFAULT 1 NOT NULL,
    CONSTRAINT learning_modules_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying])::text[])))
);


ALTER TABLE public.learning_modules OWNER TO postgres;

--
-- Name: learning_modules_module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.learning_modules_module_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.learning_modules_module_id_seq OWNER TO postgres;

--
-- Name: learning_modules_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.learning_modules_module_id_seq OWNED BY public.learning_modules.module_id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    lesson_id integer NOT NULL,
    module_id integer NOT NULL,
    lesson_number integer NOT NULL,
    lesson_title character varying(100) NOT NULL,
    content text NOT NULL,
    estimated_duration integer
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: lessons_lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_lesson_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lessons_lesson_id_seq OWNER TO postgres;

--
-- Name: lessons_lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lessons_lesson_id_seq OWNED BY public.lessons.lesson_id;


--
-- Name: module_banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_banners (
    module_banner_id integer NOT NULL,
    banner_image_path character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.module_banners OWNER TO postgres;

--
-- Name: module_banners_module_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.module_banners_module_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.module_banners_module_banner_id_seq OWNER TO postgres;

--
-- Name: module_banners_module_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.module_banners_module_banner_id_seq OWNED BY public.module_banners.module_banner_id;


--
-- Name: point_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.point_rules (
    rule_id integer NOT NULL,
    action_type character varying(50) NOT NULL,
    base_points integer NOT NULL,
    CONSTRAINT point_rules_action_type_check CHECK (((action_type)::text = ANY ((ARRAY['transaction'::character varying, 'goal_created'::character varying, 'goal_completed'::character varying, 'quiz_completed'::character varying, 'achievement_unlocked'::character varying, 'challenge_completed'::character varying])::text[]))),
    CONSTRAINT point_rules_base_points_check CHECK ((base_points >= 0))
);


ALTER TABLE public.point_rules OWNER TO postgres;

--
-- Name: point_rules_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.point_rules_rule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.point_rules_rule_id_seq OWNER TO postgres;

--
-- Name: point_rules_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.point_rules_rule_id_seq OWNED BY public.point_rules.rule_id;


--
-- Name: points_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.points_log (
    log_id integer NOT NULL,
    user_id integer NOT NULL,
    source character varying(50) NOT NULL,
    source_id integer,
    points integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT points_log_points_check CHECK ((points > 0)),
    CONSTRAINT points_log_source_check CHECK (((source)::text = ANY ((ARRAY['achievement'::character varying, 'quiz'::character varying, 'goal'::character varying, 'challenge'::character varying, 'transaction'::character varying])::text[])))
);


ALTER TABLE public.points_log OWNER TO postgres;

--
-- Name: points_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.points_log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.points_log_log_id_seq OWNER TO postgres;

--
-- Name: points_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.points_log_log_id_seq OWNED BY public.points_log.log_id;


--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_comments (
    comment_id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.post_comments OWNER TO postgres;

--
-- Name: post_comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_comments_comment_id_seq OWNER TO postgres;

--
-- Name: post_comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_comments_comment_id_seq OWNED BY public.post_comments.comment_id;


--
-- Name: post_community_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_community_tags (
    post_id integer NOT NULL,
    community_id integer NOT NULL
);


ALTER TABLE public.post_community_tags OWNER TO postgres;

--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_likes (
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    liked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.post_likes OWNER TO postgres;

--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_attempts (
    attempt_id integer NOT NULL,
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    attempt_score integer NOT NULL,
    passed boolean,
    attempt_number integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quiz_attempts OWNER TO postgres;

--
-- Name: quiz_attempts_attempt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_attempts_attempt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_attempts_attempt_id_seq OWNER TO postgres;

--
-- Name: quiz_attempts_attempt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_attempts_attempt_id_seq OWNED BY public.quiz_attempts.attempt_id;


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    quiz_id integer NOT NULL,
    module_id integer NOT NULL,
    questions_jsonb jsonb NOT NULL,
    max_score integer NOT NULL,
    pass_score integer NOT NULL,
    CONSTRAINT quizzes_check CHECK ((pass_score <= max_score))
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- Name: quizzes_quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quizzes_quiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_quiz_id_seq OWNER TO postgres;

--
-- Name: quizzes_quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quizzes_quiz_id_seq OWNED BY public.quizzes.quiz_id;


--
-- Name: recurring_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_transactions (
    recurring_id integer NOT NULL,
    transaction_id integer,
    frequency character varying(50) NOT NULL,
    next_occurrence date NOT NULL,
    end_date date,
    last_run date,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT recurring_transactions_frequency_check CHECK (((frequency)::text = ANY ((ARRAY['daily'::character varying, 'weekly'::character varying, 'biweekly'::character varying, 'monthly'::character varying, 'quarterly'::character varying, 'yearly'::character varying])::text[])))
);


ALTER TABLE public.recurring_transactions OWNER TO postgres;

--
-- Name: recurring_transactions_recurring_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recurring_transactions_recurring_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recurring_transactions_recurring_id_seq OWNER TO postgres;

--
-- Name: recurring_transactions_recurring_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recurring_transactions_recurring_id_seq OWNED BY public.recurring_transactions.recurring_id;


--
-- Name: social_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_posts (
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    caption text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.social_posts OWNER TO postgres;

--
-- Name: social_posts_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_posts_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_posts_post_id_seq OWNER TO postgres;

--
-- Name: social_posts_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_posts_post_id_seq OWNED BY public.social_posts.post_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    account_id integer NOT NULL,
    category_id integer,
    custom_category_id integer,
    budget_id integer,
    transaction_amount numeric(12,2) NOT NULL,
    transaction_type character varying(20) NOT NULL,
    transaction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_name text DEFAULT ''::text NOT NULL,
    is_recurring boolean DEFAULT false NOT NULL,
    linked_goal_id integer,
    linked_challenge_id integer,
    points_awarded integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT transactions_check CHECK ((((category_id IS NULL) AND (custom_category_id IS NOT NULL)) OR ((category_id IS NOT NULL) AND (custom_category_id IS NULL)))),
    CONSTRAINT transactions_points_awarded_check CHECK ((points_awarded >= 0)),
    CONSTRAINT transactions_transaction_amount_check CHECK ((transaction_amount <> (0)::numeric)),
    CONSTRAINT transactions_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['expense'::character varying, 'income'::character varying, 'transfer'::character varying, 'fee'::character varying, 'withdrawal'::character varying, 'deposit'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_transaction_id_seq OWNER TO postgres;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_achievements (
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    awarded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    achievement_status character varying(20) DEFAULT 'incomplete'::character varying NOT NULL,
    progress_value integer DEFAULT 0,
    CONSTRAINT user_achievements_achievement_status_check CHECK (((achievement_status)::text = ANY ((ARRAY['incomplete'::character varying, 'complete'::character varying])::text[])))
);


ALTER TABLE public.user_achievements OWNER TO postgres;

--
-- Name: user_lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_lessons (
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_lessons OWNER TO postgres;

--
-- Name: user_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_points (
    user_id integer NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tier_status character varying(20) NOT NULL,
    CONSTRAINT user_points_tier_status_check CHECK (((tier_status)::text = ANY ((ARRAY['Wood'::character varying, 'Bronze'::character varying, 'Silver'::character varying, 'Gold'::character varying, 'Platinum'::character varying, 'Diamond'::character varying])::text[])))
);


ALTER TABLE public.user_points OWNER TO postgres;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    user_id integer NOT NULL,
    theme character varying(50),
    in_app_notifications_enabled boolean DEFAULT true,
    avatar_id integer DEFAULT 1 NOT NULL,
    banner_id integer DEFAULT 1 NOT NULL,
    ar_customizations_jsonb jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_preferences_theme_check CHECK (((theme)::text = ANY ((ARRAY['light'::character varying, 'dark'::character varying])::text[])))
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- Name: user_push_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_push_subscriptions (
    push_id integer NOT NULL,
    user_id integer,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    enabled boolean DEFAULT true
);


ALTER TABLE public.user_push_subscriptions OWNER TO postgres;

--
-- Name: user_push_subscriptions_push_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_push_subscriptions_push_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_push_subscriptions_push_id_seq OWNER TO postgres;

--
-- Name: user_push_subscriptions_push_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_push_subscriptions_push_id_seq OWNED BY public.user_push_subscriptions.push_id;


--
-- Name: user_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tokens (
    token_id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.user_tokens OWNER TO postgres;

--
-- Name: user_tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tokens_token_id_seq OWNER TO postgres;

--
-- Name: user_tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_tokens_token_id_seq OWNED BY public.user_tokens.token_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(50) NOT NULL,
    full_name character varying(100) NOT NULL,
    hashed_password text NOT NULL,
    two_factor_enabled boolean DEFAULT false,
    two_factor_mandatory boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: visual_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visual_assets (
    asset_id integer NOT NULL,
    user_id integer NOT NULL,
    asset_type character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT visual_assets_asset_type_check CHECK (((asset_type)::text = ANY ((ARRAY['house'::character varying, 'flat'::character varying, 'shop'::character varying, 'shop_cafe'::character varying, 'shop_bakery'::character varying, 'bank'::character varying, 'school'::character varying, 'fountain'::character varying, 'tree'::character varying, 'bench'::character varying, 'car'::character varying, 'sign_post'::character varying, 'road'::character varying, 'pavement'::character varying, 'grass'::character varying, 'floor'::character varying, 'bushes'::character varying, 'parking_lot'::character varying, 'lamp_post'::character varying])::text[])))
);


ALTER TABLE public.visual_assets OWNER TO postgres;

--
-- Name: visual_assets_asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visual_assets_asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visual_assets_asset_id_seq OWNER TO postgres;

--
-- Name: visual_assets_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visual_assets_asset_id_seq OWNED BY public.visual_assets.asset_id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: accounts account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts ALTER COLUMN account_id SET DEFAULT nextval('public.accounts_account_id_seq'::regclass);


--
-- Name: achievements achievement_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements ALTER COLUMN achievement_id SET DEFAULT nextval('public.achievements_achievement_id_seq'::regclass);


--
-- Name: ai_scores score_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_scores ALTER COLUMN score_id SET DEFAULT nextval('public.ai_scores_score_id_seq'::regclass);


--
-- Name: ar_scene_state scene_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ar_scene_state ALTER COLUMN scene_id SET DEFAULT nextval('public.ar_scene_state_scene_id_seq'::regclass);


--
-- Name: avatar_images avatar_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_images ALTER COLUMN avatar_id SET DEFAULT nextval('public.avatar_images_avatar_id_seq'::regclass);


--
-- Name: badges badge_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges ALTER COLUMN badge_id SET DEFAULT nextval('public.badges_badge_id_seq'::regclass);


--
-- Name: banner_images banner_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banner_images ALTER COLUMN banner_id SET DEFAULT nextval('public.banner_images_banner_id_seq'::regclass);


--
-- Name: budget_categories budget_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_categories ALTER COLUMN budget_category_id SET DEFAULT nextval('public.budget_categories_budget_category_id_seq'::regclass);


--
-- Name: budgets budget_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets ALTER COLUMN budget_id SET DEFAULT nextval('public.budgets_budget_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: challenges challenge_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges ALTER COLUMN challenge_id SET DEFAULT nextval('public.challenges_challenge_id_seq'::regclass);


--
-- Name: communities community_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities ALTER COLUMN community_id SET DEFAULT nextval('public.communities_community_id_seq'::regclass);


--
-- Name: custom_categories custom_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_categories ALTER COLUMN custom_category_id SET DEFAULT nextval('public.custom_categories_custom_category_id_seq'::regclass);


--
-- Name: goal_progress progress_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_progress ALTER COLUMN progress_id SET DEFAULT nextval('public.goal_progress_progress_id_seq'::regclass);


--
-- Name: goals goal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals ALTER COLUMN goal_id SET DEFAULT nextval('public.goals_goal_id_seq'::regclass);


--
-- Name: leaderboard_entries entry_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaderboard_entries ALTER COLUMN entry_id SET DEFAULT nextval('public.leaderboard_entries_entry_id_seq'::regclass);


--
-- Name: learning_modules module_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learning_modules ALTER COLUMN module_id SET DEFAULT nextval('public.learning_modules_module_id_seq'::regclass);


--
-- Name: lessons lesson_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons ALTER COLUMN lesson_id SET DEFAULT nextval('public.lessons_lesson_id_seq'::regclass);


--
-- Name: module_banners module_banner_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_banners ALTER COLUMN module_banner_id SET DEFAULT nextval('public.module_banners_module_banner_id_seq'::regclass);


--
-- Name: point_rules rule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_rules ALTER COLUMN rule_id SET DEFAULT nextval('public.point_rules_rule_id_seq'::regclass);


--
-- Name: points_log log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_log ALTER COLUMN log_id SET DEFAULT nextval('public.points_log_log_id_seq'::regclass);


--
-- Name: post_comments comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comments ALTER COLUMN comment_id SET DEFAULT nextval('public.post_comments_comment_id_seq'::regclass);


--
-- Name: quiz_attempts attempt_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts ALTER COLUMN attempt_id SET DEFAULT nextval('public.quiz_attempts_attempt_id_seq'::regclass);


--
-- Name: quizzes quiz_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN quiz_id SET DEFAULT nextval('public.quizzes_quiz_id_seq'::regclass);


--
-- Name: recurring_transactions recurring_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions ALTER COLUMN recurring_id SET DEFAULT nextval('public.recurring_transactions_recurring_id_seq'::regclass);


--
-- Name: social_posts post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts ALTER COLUMN post_id SET DEFAULT nextval('public.social_posts_post_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: user_push_subscriptions push_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_push_subscriptions ALTER COLUMN push_id SET DEFAULT nextval('public.user_push_subscriptions_push_id_seq'::regclass);


--
-- Name: user_tokens token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tokens ALTER COLUMN token_id SET DEFAULT nextval('public.user_tokens_token_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: visual_assets asset_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visual_assets ALTER COLUMN asset_id SET DEFAULT nextval('public.visual_assets_asset_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (account_id, user_id, bank_name, account_name, account_type, currency, account_balance, created_at) FROM stdin;
1	1	Capitec	Everyday Savings	savings	ZAR	12500.50	2025-08-19 14:32:54.840928
2	1	FNB	Crypto Vault	crypto	BTC	0.05	2025-08-19 14:32:54.840928
3	1	ABSA	Credit Line	credit	ZAR	-3500.00	2025-08-19 14:32:54.840928
6	3	Investec	Forex Trader	forex	USD	23000.00	2025-08-19 14:32:54.840928
7	3	FNB	Business Wallet	business	ZAR	74000.00	2025-08-19 14:32:54.840928
8	3	Binance	Ethereum Wallet	crypto	ETH	1.80	2025-08-19 14:32:54.840928
9	4	Capitec	My Primary	cheque	ZAR	9800.00	2025-08-19 14:32:54.840928
10	4	TymeBank	Goal Save	savings	ZAR	1500.00	2025-08-19 14:32:54.840928
11	5	Discovery Bank	Lifestyle Account	current	ZAR	12200.00	2025-08-19 14:32:54.840928
12	5	ABSA	Education Fund	tax-free savings	ZAR	3000.00	2025-08-19 14:32:54.840928
13	5	FNB	USD Vault	savings	USD	1100.00	2025-08-19 14:32:54.840928
14	6	Standard Bank	Main Account	current	ZAR	6800.00	2025-08-19 14:32:54.840928
15	6	Binance	Litecoin Wallet	crypto	LTC	4.50	2025-08-19 14:32:54.840928
16	7	Capitec	Monthly Spend	current	ZAR	2200.00	2025-08-19 14:32:54.840928
17	7	Old Mutual	Investment Account	investment	ZAR	40500.00	2025-08-19 14:32:54.840928
19	8	TymeBank	Student Account	savings	ZAR	2700.00	2025-08-19 14:32:54.840928
20	9	Investec	Trading Account	corporate trading	USD	9000.00	2025-08-19 14:32:54.840928
21	9	Nedbank	Crypto Backup	crypto	USDT	125.40	2025-08-19 14:32:54.840928
22	10	Capitec	Main ZAR Account	current	ZAR	9500.00	2025-08-19 14:32:54.840928
23	10	Binance	Bitcoin Wallet	crypto	BTC	0.01	2025-08-19 14:32:54.840928
24	10	ABSA	Bonus Account	current	ZAR	1800.00	2025-08-19 14:32:54.840928
18	7	Coinbase	Dogecoin Wallet	crypto	DOGE	14164.98	2025-08-19 14:32:54.840928
4	2	Nedbank	Travel Fund	fixed deposit	USD	48640.49	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (achievement_id, parent_id, badge_id, achievement_title, achievement_description, achievement_type, points_awarded, trigger_condition_json, is_umbrella, display_order, banner_image_path) FROM stdin;
1	\N	1	Goal Getter	Complete savings and financial goals to become a Goal Getter.	goal	55	{}	t	1	achievements banners/13.png
2	1	1	Starter Saver	Complete your first goal.	goal	50	{"type": "goal_completed", "count": 1}	f	2	\N
3	1	1	Halfway Hero	Reach 50% of your target goal.	goal	30	{"type": "goal_progress", "percent": 50}	f	3	\N
4	1	1	Goal Smasher	Complete 5 financial goals.	goal	100	{"type": "goal_completed", "count": 5}	f	4	\N
5	1	1	Consistent Closer	Complete a goal 3 months in a row.	goal	75	{"type": "goal_streak", "months": 3}	f	5	\N
6	\N	6	Challenge Champion	Engage and excel in community challenges.	challenge	250	{}	t	6	achievements banners/23.png
7	6	6	First Challenge	Join your first challenge.	challenge	20	{"type": "challenge_participation", "count": 1}	f	7	\N
8	6	6	Top Contributor	Contribute the most in a challenge.	challenge	100	{"type": "challenge_top_contributor"}	f	8	\N
9	6	6	Streak Star	Complete 3 challenges in a row.	challenge	75	{"type": "challenge_streak", "count": 3}	f	9	\N
10	6	6	Consistent Contender	Join or complete 5 challenges in total.	challenge	60	{"type": "challenges_total", "count": 5}	f	10	\N
11	\N	10	Transaction Master	Master your spending and income tracking.	transaction	250	{}	t	11	achievements banners/19.png
12	11	10	First Transaction	Logged your very first transaction!	transaction	50	{"type": "transaction_count", "count": 1}	f	12	\N
13	11	10	Tracker Beginner	Log 10 transactions.	transaction	20	{"type": "transaction_count", "count": 10}	f	13	\N
14	11	10	Budget Buddy	Link a transaction to a budget.	transaction	30	{"type": "linked_to_budget"}	f	14	\N
15	11	10	Classifier Pro	Classify 50 transactions.	transaction	60	{"type": "classified_count", "count": 50}	f	15	\N
16	\N	1	Money Mover	Show advanced mastery of spending habits.	transaction	0	{}	t	16	achievements banners/10.png
17	16	1	Big Spender	Make a single transaction of R1000 or more.	transaction	100	{"type": "single_transaction", "min_amount": 1000}	f	17	\N
18	16	1	Transaction Tycoon	Log over 500 transactions.	transaction	150	{"type": "transaction_count", "count": 500}	f	18	\N
19	16	1	No-Fees Month	Go an entire month with no fee transactions.	transaction	120	{"type": "no_fees_month", "months": 1}	f	19	\N
20	16	1	All Tagged	Have 100% of this month's transactions categorized.	transaction	120	{"type": "month_categorized", "percent": 100}	f	20	\N
21	\N	2	Quiz Conqueror	Show off your financial literacy.	quiz	0	{}	t	21	achievements banners/2.png
22	21	2	First Answer	Complete your first quiz.	quiz	20	{"type": "quiz_completed", "count": 1}	f	22	\N
23	21	2	Quiz Streak	Score 80%+ on 3 quizzes in a row.	quiz	50	{"type": "quiz_streak", "count": 3, "min_score": 80}	f	23	\N
24	21	2	Perfect Score	Get 100% in a quiz.	quiz	100	{"type": "quiz_pass", "min_score": 100}	f	24	\N
25	21	2	Brainstormer	Complete 20 quizzes.	quiz	150	{"type": "quiz_completed", "count": 20}	f	25	\N
26	\N	4	Tutorial Trailblazer	Master the onboarding process with tutorials.	tutorial	0	{}	t	26	achievements banners/5.png
27	26	4	First Steps	Complete your first tutorial.	tutorial	10	{"type": "tutorial_completed", "count": 1}	f	27	\N
28	26	4	Quick Learner	Finish 3 tutorials.	tutorial	30	{"type": "tutorial_completed", "count": 3}	f	28	\N
29	26	4	System Savvy	Complete all onboarding tutorials.	tutorial	60	{"type": "tutorial_all_completed"}	f	29	\N
30	26	4	Tutorial Streak	Complete tutorials on 3 consecutive days.	tutorial	40	{"days": 3, "type": "tutorial_streak_days"}	f	30	\N
31	\N	11	Community Champion	Empower others through social engagement.	milestone	0	{}	t	31	achievements banners/21.png
32	31	11	Friend of Finance	Make 5 friends.	milestone	40	{"type": "friends_made", "count": 5}	f	32	\N
33	31	11	Community Pillar	Participate in 5 communities.	milestone	60	{"type": "communities_joined", "count": 5}	f	33	\N
34	31	11	Weekly Winner	Be top of the leaderboard for a week.	milestone	75	{"type": "leaderboard_week_top", "weeks": 1}	f	34	\N
35	31	11	Top Ranker	Reach the #1 spot on any leaderboard.	milestone	200	{"rank": 1, "type": "leaderboard_rank"}	f	35	\N
36	\N	8	Point Pursuer	Unlock point-based milestones.	milestone	0	{}	t	36	achievements banners/17.png
37	36	8	100 Points Club	Reach 100 total points.	milestone	20	{"type": "points_total", "points": 100}	f	37	\N
38	36	8	250 Points Club	Reach 250 total points.	milestone	40	{"type": "points_total", "points": 250}	f	38	\N
39	36	8	500 Points Club	Reach 500 total points.	milestone	80	{"type": "points_total", "points": 500}	f	39	\N
40	36	8	1,000 Points Club	Reach 1,000 total points.	milestone	150	{"type": "points_total", "points": 1000}	f	40	\N
41	\N	13	Investment Guru	Recognize consistent and strategic investing habits.	goal	105	{}	t	41	achievements banners/11.png
42	41	13	Stock Starter	Complete your first investment goal.	goal	40	{"type": "investment_goal", "count": 1}	f	42	\N
43	41	13	Smart Reinvestor	Reinvest dividends or interest at least twice.	goal	60	{"type": "reinvest_events", "count": 2}	f	43	\N
44	41	13	Auto-Investor	Set up a recurring monthly investment.	goal	70	{"type": "auto_invest_enabled", "months": 1}	f	44	\N
45	41	13	Risk Balancer	Rebalance your investment goal once.	goal	80	{"type": "rebalance_performed", "count": 1}	f	45	\N
46	\N	14	Budget Boss	Master the art of budgeting	budget	300	{}	t	42	achievements banners/18.png
47	46	14	Budget Beginner	Create your first budget	budget	30	{"type": "budget_created", "count": 1}	f	43	\N
48	46	14	Category King	Create budgets in 5 different categories	budget	50	{"type": "budget_categories", "count": 5}	f	44	\N
49	46	14	Month Master	Stay under budget in all categories for a month	budget	100	{"type": "budget_success_month", "months": 1}	f	45	\N
50	46	14	Quarterly Saver	Stay under budget for 3 consecutive months	budget	150	{"type": "budget_streak", "months": 3}	f	46	\N
51	\N	2	Avid Scholar	Complete most available learning modules.	quiz	0	{}	t	47	achievements banners/1.png
52	51	2	Module Novice	Complete 3 learning modules.	quiz	20	{"type": "modules_completed", "count": 3}	f	48	\N
53	51	2	Module Enthusiast	Complete 10 learning modules.	quiz	40	{"type": "modules_completed", "count": 10}	f	49	\N
54	51	2	Curriculum Closer	Complete all beginner & intermediate modules.	quiz	75	{"type": "modules_completed_by_level", "levels": ["beginner", "intermediate"]}	f	50	\N
55	51	2	Avid Scholar Badge	Complete 80% of all available modules across the catalog.	quiz	120	{"type": "modules_completion_rate", "percent": 80}	f	51	\N
56	\N	2	Financial Ace	Score 100% on a quiz attempt.	quiz	0	{}	t	52	achievements banners/3.png
57	56	2	First Perfect	Score 100% on any quiz once.	quiz	40	{"type": "quiz_pass", "count": 1, "min_score": 100}	f	53	\N
58	56	2	Perfectionist	Score 100% on quizzes 3 times.	quiz	80	{"type": "quiz_pass", "count": 3, "min_score": 100}	f	54	\N
59	56	2	Lightning Perfect	Score 100% on a quiz in under 60 seconds.	quiz	90	{"type": "quiz_perfect_under_time", "seconds": 60, "min_score": 100}	f	55	\N
60	56	2	Advanced Ace	Score 100% on an advanced-difficulty quiz.	quiz	120	{"type": "quiz_pass_on_difficulty", "min_score": 100, "difficulty": "advanced"}	f	56	\N
61	\N	2	Over Achiever	Complete all advanced learning modules.	quiz	0	{}	t	57	achievements banners/6.png
62	61	2	Advanced Starter	Complete your first advanced module.	quiz	40	{"type": "modules_completed_by_difficulty", "count": 1, "difficulty": "advanced"}	f	58	\N
63	61	2	Advanced Explorer	Complete 5 advanced modules.	quiz	70	{"type": "modules_completed_by_difficulty", "count": 5, "difficulty": "advanced"}	f	59	\N
64	61	2	Advanced Streak	Complete an advanced module each week for 3 weeks.	quiz	100	{"type": "module_completion_streak_weeks", "weeks": 3, "difficulty": "advanced"}	f	60	\N
65	61	2	Over Achiever Badge	Complete all advanced modules in the catalog.	quiz	150	{"type": "all_modules_completed_by_difficulty", "difficulty": "advanced"}	f	61	\N
66	\N	2	Quiz Maniac	Attempt all quizzes a total of 25 times.	quiz	0	{}	t	62	achievements banners/7.png
67	66	2	Quiz Tourist	Attempt quizzes 5 times in total.	quiz	15	{"type": "quiz_attempts_total", "count": 5}	f	63	\N
68	66	2	Quiz Regular	Attempt quizzes 10 times in total.	quiz	30	{"type": "quiz_attempts_total", "count": 10}	f	64	\N
69	66	2	Quiz Addict	Attempt quizzes 25 times in total.	quiz	60	{"type": "quiz_attempts_total", "count": 25}	f	65	\N
70	66	2	Quiz Marathon	Attempt quizzes 100 times in total.	quiz	120	{"type": "quiz_attempts_total", "count": 100}	f	66	\N
71	\N	11	New World	Unlock all city model view themes.	ar	0	{}	t	67	achievements banners/4.png
72	71	11	Theme Explorer	Unlock your first city model theme.	ar	20	{"type": "ar_theme_unlocked", "count": 1}	f	68	\N
73	71	11	City Stylist	Unlock 3 city model themes.	ar	50	{"type": "ar_theme_unlocked", "count": 3}	f	69	\N
74	71	11	Urban Designer	Unlock 5 city model themes.	ar	75	{"type": "ar_theme_unlocked", "count": 5}	f	70	\N
75	71	11	Master Architect	Unlock all available city model themes.	ar	100	{"type": "ar_theme_unlocked", "count": "all"}	f	71	\N
76	\N	11	AR Viewer	Explore the world of augmented reality.	ar	0	{}	t	72	achievements banners/8.png
77	76	11	First Steps in AR	View any AR scene for the first time.	ar	10	{"type": "ar_scene_viewed", "count": 1}	f	73	\N
78	76	11	Immersive Explorer	View 5 AR scenes.	ar	30	{"type": "ar_scene_viewed", "count": 5}	f	74	\N
79	76	11	Augmented Adventurer	View 10 AR scenes.	ar	50	{"type": "ar_scene_viewed", "count": 10}	f	75	\N
80	76	11	AR Pioneer	Spend over 1 hour in AR mode.	ar	75	{"type": "ar_time_spent", "minutes": 60}	f	76	\N
81	\N	1	Speed Runner	Complete a financial goal in under 7 days.	goal	0	{}	t	77	achievements banners/9.png
82	81	1	Quick Start	Complete a goal within 14 days.	goal	40	{"days": 14, "type": "goal_completed_under_days"}	f	78	\N
83	81	1	Speed Runner	Complete a goal within 7 days.	goal	75	{"days": 7, "type": "goal_completed_under_days"}	f	79	\N
84	81	1	Sprint Saver	Complete a goal within 3 days.	goal	120	{"days": 3, "type": "goal_completed_under_days"}	f	80	\N
85	81	1	Lightning Closer	Complete a goal within 24 hours.	goal	200	{"type": "goal_completed_under_hours", "hours": 24}	f	81	\N
86	\N	14	Budget Hero	Stay under budget for 3 straight months.	budget	0	{}	t	82	achievements banners/14.png
87	86	14	Month on Track	Stay under budget for 1 month.	budget	50	{"type": "budget_streak", "months": 1}	f	83	\N
88	86	14	Quarter Tamer	Stay under budget for 3 months.	budget	120	{"type": "budget_streak", "months": 3}	f	84	\N
89	86	14	Half-Year Hero	Stay under budget for 6 months.	budget	180	{"type": "budget_streak", "months": 6}	f	85	\N
90	86	14	Annual Aegis	Stay under budget for 12 months.	budget	300	{"type": "budget_streak", "months": 12}	f	86	\N
91	\N	10	Transaction Tycoon	Import over 50 transactions via bank statements.	transaction	0	{}	t	87	achievements banners/15.png
92	91	10	Bank Linker	Import transactions once via bank import.	transaction	25	{"type": "bank_import_count", "count": 1}	f	88	\N
93	91	10	Statement Streamer	Import transactions 5 times.	transaction	60	{"type": "bank_import_count", "count": 5}	f	89	\N
94	91	10	Data Drip	Import transactions 20 times.	transaction	120	{"type": "bank_import_count", "count": 20}	f	90	\N
95	91	10	Transaction Tycoon	Import 50+ transactions via statements.	transaction	200	{"type": "bank_import_total", "count": 50}	f	91	\N
96	\N	8	Points Hoarder	Reach 50,000 total points.	milestone	0	{}	t	92	achievements banners/12.png
97	96	8	Points Collector	Reach 5,000 total points.	milestone	40	{"type": "points_total", "points": 5000}	f	93	\N
98	96	8	Points Saver	Reach 10,000 total points.	milestone	80	{"type": "points_total", "points": 10000}	f	94	\N
99	96	8	Points Pro	Reach 25,000 total points.	milestone	150	{"type": "points_total", "points": 25000}	f	95	\N
100	96	8	Points Hoarder	Reach 50,000 total points.	milestone	300	{"type": "points_total", "points": 50000}	f	96	\N
101	\N	11	Custom King	Create over 10 different custom categories.	misc	0	{}	t	97	achievements banners/16.png
102	101	11	Category Creator	Create your first custom category.	misc	10	{"type": "custom_categories_created", "count": 1}	f	98	\N
103	101	11	Customizer	Create 5 custom categories.	misc	25	{"type": "custom_categories_created", "count": 5}	f	99	\N
104	101	11	Custom Kingpin	Create 10 custom categories.	misc	50	{"type": "custom_categories_created", "count": 10}	f	100	\N
105	101	11	Palette Architect	Create 20 custom categories.	misc	100	{"type": "custom_categories_created", "count": 20}	f	101	\N
106	\N	11	Top Ranker	Reach #1 on the leaderboard for 3 weeks in a row.	milestone	0	{}	t	102	achievements banners/20.png
107	106	11	Week One Wonder	Hold the #1 leaderboard spot for 1 week.	milestone	50	{"rank": 1, "type": "leaderboard_rank_streak", "weeks": 1}	f	103	\N
108	106	11	Two-Week Titan	Hold the #1 leaderboard spot for 2 weeks.	milestone	100	{"rank": 1, "type": "leaderboard_rank_streak", "weeks": 2}	f	104	\N
109	106	11	Three-Week Throne	Hold the #1 leaderboard spot for 3 weeks.	milestone	150	{"rank": 1, "type": "leaderboard_rank_streak", "weeks": 3}	f	105	\N
110	106	11	Monthly Monarch	Hold the #1 leaderboard spot for 4 weeks.	milestone	200	{"rank": 1, "type": "leaderboard_rank_streak", "weeks": 4}	f	106	\N
111	\N	6	Challenge Accepted	Join your first community financial challenge.	challenge	0	{}	t	107	achievements banners/22.png
112	111	6	First Steps In	Join your first community financial challenge.	challenge	10	{"type": "challenge_participation", "count": 1}	f	108	\N
113	111	6	Challenge Regular	Join 3 community financial challenges.	challenge	30	{"type": "challenge_participation", "count": 3}	f	109	\N
114	111	6	Challenge Enthusiast	Join 5 community financial challenges.	challenge	60	{"type": "challenge_participation", "count": 5}	f	110	\N
115	111	6	Challenge Veteran	Join 10 community financial challenges.	challenge	120	{"type": "challenge_participation", "count": 10}	f	111	\N
116	\N	11	Trending Now	Have a single social post reach 50 likes.	milestone	0	{}	t	112	achievements banners/24.png
117	116	11	Getting Noticed	Have a post reach 10 likes.	milestone	10	{"type": "post_likes", "count": 10}	f	113	\N
118	116	11	On The Radar	Have a post reach 25 likes.	milestone	25	{"type": "post_likes", "count": 25}	f	114	\N
119	116	11	Trending Now	Have a post reach 50 likes.	milestone	50	{"type": "post_likes", "count": 50}	f	115	\N
120	116	11	Viral Vibes	Have a post reach 100 likes.	milestone	100	{"type": "post_likes", "count": 100}	f	116	\N
121	\N	11	Social Butterfly	Comment on 10 or more users' social posts.	milestone	0	{}	t	117	achievements banners/25.png
122	121	11	First Hello	Leave your first comment on a user's post.	milestone	10	{"type": "comments_made", "count": 1}	f	118	\N
123	121	11	Chatty	Leave 10 comments on users' posts.	milestone	20	{"type": "comments_made", "count": 10}	f	119	\N
124	121	11	Conversationalist	Leave 25 comments on users' posts.	milestone	40	{"type": "comments_made", "count": 25}	f	120	\N
125	121	11	Social Butterfly+	Leave 50 comments on users' posts.	milestone	80	{"type": "comments_made", "count": 50}	f	121	\N
\.


--
-- Data for Name: ai_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_scores (score_id, user_id, generated_at, score_value, financial_health_level) FROM stdin;
\.


--
-- Data for Name: ar_scene_state; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ar_scene_state (scene_id, user_id, snapshot_jsonb, last_updated) FROM stdin;
\.


--
-- Data for Name: avatar_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avatar_images (avatar_id, avatar_image_path, created_at) FROM stdin;
1	avatars/BeachShore.png	2025-08-19 14:32:54.840928
2	avatars/BlueSky.png	2025-08-19 14:32:54.840928
3	avatars/bumbleBee.png	2025-08-19 14:32:54.840928
4	avatars/CityBuilding.png	2025-08-19 14:32:54.840928
5	avatars/koiFish.png	2025-08-19 14:32:54.840928
6	avatars/LakeBoat.png	2025-08-19 14:32:54.840928
7	avatars/LightPost.png	2025-08-19 14:32:54.840928
8	avatars/Lily.png	2025-08-19 14:32:54.840928
9	avatars/panda.png	2025-08-19 14:32:54.840928
10	avatars/Ramen.png	2025-08-19 14:32:54.840928
11	avatars/snake.png	2025-08-19 14:32:54.840928
12	avatars/Totoro.png	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badges (badge_id, badge_title, image_path, rarity, created_at) FROM stdin;
1	Accepted	badges/accepted.png	Uncommon	2025-08-19 14:32:54.840928
2	Balance Scale	badges/balance-scale.png	Uncommon	2025-08-19 14:32:54.840928
3	Bank	badges/bank.png	Common	2025-08-19 14:32:54.840928
4	Banknote	badges/banknote.png	Uncommon	2025-08-19 14:32:54.840928
5	Brainstorming	badges/brainstorming.png	Rare	2025-08-19 14:32:54.840928
6	Coin	badges/coin.png	Common	2025-08-19 14:32:54.840928
7	Customer	badges/customer.png	Common	2025-08-19 14:32:54.840928
8	Discussion	badges/discussion.png	Rare	2025-08-19 14:32:54.840928
9	Expense	badges/expense.png	Common	2025-08-19 14:32:54.840928
10	Goal	badges/goal.png	Legendary	2025-08-19 14:32:54.840928
11	Growth	badges/growth.png	Rare	2025-08-19 14:32:54.840928
12	High Five	badges/hi5.png	Obsidian	2025-08-19 14:32:54.840928
13	Idea	badges/idea.png	Uncommon	2025-08-19 14:32:54.840928
14	Income	badges/income.png	Uncommon	2025-08-19 14:32:54.840928
15	Investment	badges/investment.png	Epic	2025-08-19 14:32:54.840928
16	Lighthouse	badges/lighthouse.png	Rare	2025-08-19 14:32:54.840928
17	Meeting	badges/meeting.png	Common	2025-08-19 14:32:54.840928
18	Money Bag	badges/money-bag.png	Obsidian	2025-08-19 14:32:54.840928
19	Planning	badges/planing.png	Uncommon	2025-08-19 14:32:54.840928
20	Presentation	badges/presentation.png	Rare	2025-08-19 14:32:54.840928
21	Profit	badges/profit.png	Epic	2025-08-19 14:32:54.840928
22	Profit (Alt)	badges/profit (2).png	Epic	2025-08-19 14:32:54.840928
23	Start Up	badges/start-up.png	Epic	2025-08-19 14:32:54.840928
24	Support	badges/support.png	Common	2025-08-19 14:32:54.840928
25	Target	badges/target.png	Common	2025-08-19 14:32:54.840928
26	Team	badges/team.png	Common	2025-08-19 14:32:54.840928
27	Trophy	badges/trophy.png	Legendary	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: banner_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banner_images (banner_id, banner_image_path, created_at) FROM stdin;
1	banners/pixelAllyway.jpeg	2025-08-19 14:32:54.840928
2	banners/pixelApartment.gif	2025-08-19 14:32:54.840928
3	banners/pixelBalcony.gif	2025-08-19 14:32:54.840928
4	banners/pixelCornerStore.gif	2025-08-19 14:32:54.840928
5	banners/pixelGirl.gif	2025-08-19 14:32:54.840928
6	banners/pixelGirlAlly.gif	2025-08-19 14:32:54.840928
7	banners/pixelHouse.gif	2025-08-19 14:32:54.840928
8	banners/pixelOffice.gif	2025-08-19 14:32:54.840928
9	banners/pixelOffice1.gif	2025-08-19 14:32:54.840928
10	banners/pixelOffice2.gif	2025-08-19 14:32:54.840928
11	banners/pixelOffice3.gif	2025-08-19 14:32:54.840928
12	banners/pixelPorch.gif	2025-08-19 14:32:54.840928
13	banners/pixelStore.gif	2025-08-19 14:32:54.840928
14	banners/pixelStudents.jpeg	2025-08-19 14:32:54.840928
15	banners/pixelWindow.gif	2025-08-19 14:32:54.840928
16	banners/pixelWoodShop.gif	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: budget_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_categories (budget_category_id, budget_id, category_id, custom_category_id, current_amount, target_amount) FROM stdin;
1	1	1	\N	0.00	2000.00
2	1	17	\N	0.00	1500.00
3	2	24	\N	0.00	3000.00
4	2	13	\N	0.00	2500.00
5	3	\N	3	0.00	1800.00
6	3	20	\N	0.00	500.00
7	4	23	\N	0.00	10000.00
8	4	\N	5	0.00	2000.00
9	5	\N	8	0.00	1200.00
10	5	1	\N	0.00	800.00
11	6	13	\N	0.00	4000.00
12	6	\N	10	0.00	3000.00
13	7	\N	11	0.00	2500.00
14	7	\N	12	0.00	800.00
15	8	26	\N	0.00	7500.00
16	8	\N	13	0.00	1000.00
17	9	22	\N	0.00	15000.00
18	9	17	\N	0.00	5000.00
20	11	36	\N	0.00	4500.00
21	12	12	\N	0.00	5000.00
22	13	30	\N	0.00	40.00
23	14	13	\N	0.00	7000.00
24	15	30	\N	0.00	12345.00
\.


--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (budget_id, user_id, budget_name, period_start, period_end, created_at) FROM stdin;
1	1	June Budget	2025-06-01	2025-06-30	2025-08-19 14:32:54.840928
2	1	Q2 Spending	2025-04-01	2025-06-30	2025-08-19 14:32:54.840928
3	2	Sustainability Budget	2025-05-01	2025-06-30	2025-08-19 14:32:54.840928
4	3	Crypto Strategy	2025-03-01	2025-06-30	2025-08-19 14:32:54.840928
5	4	Art & Living	2025-05-01	2025-07-01	2025-08-19 14:32:54.840928
6	5	Family Essentials	2025-01-01	2025-04-01	2025-08-19 14:32:54.840928
7	7	Gamer Budget	2025-04-01	2025-06-01	2025-08-19 14:32:54.840928
8	9	Conference Prep	2025-02-01	2025-05-01	2025-08-19 14:32:54.840928
9	10	Wedding Tracker	2025-01-01	2025-12-31	2025-08-19 14:32:54.840928
11	9	business income	2025-08-19	2025-09-18	2025-08-19 19:58:59.631762
12	9	fitness	2025-08-19	2025-09-18	2025-08-19 19:59:48.759192
13	7	bonus	2025-08-19	2025-09-18	2025-08-19 21:00:20.995511
14	7	education	2025-08-19	2025-09-18	2025-08-19 22:22:55.040016
15	2	bonus	2025-09-08	2025-10-07	2025-09-08 00:23:22.841849
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, category_name) FROM stdin;
1	groceries
2	transport
3	fuel
4	utilities
5	rent
6	mortgage
7	internet
8	phone
9	insurance
10	medical
11	health
12	fitness
13	education
14	subscriptions
15	entertainment
16	restaurants
17	clothing
18	personal care
19	gifts
20	charity
21	taxes
22	savings
23	investments
24	loan repayment
25	debt
26	travel
27	accommodation
28	salary
29	freelance
30	bonus
31	refund
32	transfer in
33	transfer out
34	cash withdrawal
35	cash deposit
36	business income
37	business expense
38	maintenance
39	repairs
40	childcare
41	pets
42	home improvement
43	fees
44	commissions
45	interest income
46	dividends
47	crypto purchase
48	crypto sale
49	forex
50	wallet top-up
51	wallet withdrawal
\.


--
-- Data for Name: challenge_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challenge_progress (challenge_id, user_id, participation_status, join_date, last_updated, progress_amount) FROM stdin;
1	1	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	1000.00
1	2	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	1000.00
1	5	invited	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	0.00
2	3	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	10000.00
2	7	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	5000.00
2	9	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	5000.00
3	4	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	800.00
3	2	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	1000.00
4	7	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	3000.00
4	5	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	5000.00
5	9	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	6000.00
5	3	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	3000.00
5	10	invited	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	0.00
6	1	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	0.00
6	4	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	0.00
7	3	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	1500.00
7	6	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	2500.00
8	6	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	2500.00
8	4	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	2500.00
9	8	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	3500.00
9	9	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	2500.00
10	9	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	4000.00
10	7	joined	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928	3000.00
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challenges (challenge_id, community_id, creator_id, challenge_title, challenge_type, target_amount, current_amount, start_date, target_date, end_date, banner_id, category_id, custom_category_id, measurement_type, difficulty, challenge_status, created_at, updated_at) FROM stdin;
1	1	1	No Spend June	spending limit	5000.00	2000.00	2025-06-01	2025-06-30	2025-06-30	1	17	\N	spending_within_limit	medium	expired	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
2	3	4	Declutter Donation Drive	donation	3000.00	20000.00	2025-05-01	2025-06-30	2025-06-30	3	20	\N	amount_donated	easy	expired	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
3	5	9	Q2 Growth Investment	investment	15000.00	1800.00	2025-04-01	2025-06-30	2025-06-30	5	23	\N	amount_invested	hard	expired	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
4	2	3	Bonus Blitz	savings	10000.00	8000.00	2025-06-15	2025-07-15	2025-07-15	2	22	\N	amount_saved	medium	expired	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
5	4	8	Altcoin Marathon	investment	25000.00	9000.00	2025-05-01	2025-08-01	2025-08-01	4	23	\N	amount_invested	hard	expired	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
6	1	2	July Grocery Cap	spending limit	2500.00	0.00	2025-07-01	2025-07-31	2025-07-31	1	1	\N	spending_within_limit	easy	expired	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
7	2	3	Altcoin Fundraiser	investment	20000.00	4000.00	2025-03-01	2025-04-15	2025-04-10	2	23	\N	amount_invested	hard	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
8	4	7	Side Gig Savings	savings	8000.00	5000.00	2025-02-01	2025-05-01	2025-04-30	4	22	\N	amount_saved	medium	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
9	3	6	Charity Challenge	donation	5000.00	6000.00	2025-04-01	2025-05-01	2025-04-30	3	20	\N	amount_donated	medium	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
10	5	9	Freelance Frenzy	savings	7000.00	7000.00	2025-01-01	2025-03-01	2025-02-28	5	22	\N	amount_saved	extreme	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
11	4	7	Test	investment	10000.00	0.00	2025-08-20	2025-08-31	\N	3	34	\N	transactions_logged	extreme	active	2025-08-19 21:28:52.464137	2025-08-19 21:28:52.464137
\.


--
-- Data for Name: communities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communities (community_id, owner_id, community_name, description, banner_id, created_at) FROM stdin;
1	1	Money Masters	A club for budgeting pros and goal slayers.	1	2025-08-19 14:32:54.840928
2	3	Crypto Crusaders	We ride the blockchain waves together.	2	2025-08-19 14:32:54.840928
3	4	Frugal & Free	Minimalist living and financial freedom.	3	2025-08-19 14:32:54.840928
4	7	Side Hustlers United	Build wealth through multiple income streams.	4	2025-08-19 14:32:54.840928
5	9	Invest Buds	Investment talk and challenge groups.	5	2025-08-19 14:32:54.840928
6	1	Group Chat	Just vibes :)	1	2025-09-13 23:20:40.50639
\.


--
-- Data for Name: community_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community_members (community_id, user_id, membership_status, joined_at) FROM stdin;
1	1	accepted	2025-08-19 14:32:54.840928
1	2	accepted	2025-08-19 14:32:54.840928
1	5	invited	2025-08-19 14:32:54.840928
1	6	declined	2025-08-19 14:32:54.840928
2	3	accepted	2025-08-19 14:32:54.840928
2	4	requested	2025-08-19 14:32:54.840928
2	7	accepted	2025-08-19 14:32:54.840928
2	9	accepted	2025-08-19 14:32:54.840928
3	4	accepted	2025-08-19 14:32:54.840928
3	2	requested	2025-08-19 14:32:54.840928
3	1	accepted	2025-08-19 14:32:54.840928
4	7	accepted	2025-08-19 14:32:54.840928
4	8	invited	2025-08-19 14:32:54.840928
4	5	requested	2025-08-19 14:32:54.840928
5	9	accepted	2025-08-19 14:32:54.840928
5	3	accepted	2025-08-19 14:32:54.840928
5	10	requested	2025-08-19 14:32:54.840928
4	1	accepted	2025-08-19 21:19:57.600744
6	1	accepted	2025-09-13 23:20:40.869693
6	4	invited	2025-09-13 23:20:42.339513
6	2	invited	2025-09-13 23:20:42.698613
\.


--
-- Data for Name: custom_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_categories (custom_category_id, user_id, custom_category_name) FROM stdin;
1	1	side hustle
2	1	streaming services
3	2	eco groceries
4	2	mental wellness
5	3	crypto staking
6	3	family gifts
7	3	trading bots
8	4	art supplies
9	5	gym supplements
10	5	kids education
11	7	gaming expenses
12	7	bike maintenance
13	9	conference travel
\.


--
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friendships (user_id, friend_id, relationship_status, created_at) FROM stdin;
1	2	accepted	2025-08-19 14:32:54.840928
1	4	accepted	2025-08-19 14:32:54.840928
2	5	accepted	2025-08-19 14:32:54.840928
3	7	accepted	2025-08-19 14:32:54.840928
6	10	accepted	2025-08-19 14:32:54.840928
3	9	accepted	2025-08-19 14:32:54.840928
2	3	pending	2025-08-19 14:32:54.840928
4	5	pending	2025-08-19 14:32:54.840928
8	9	pending	2025-08-19 14:32:54.840928
1	6	declined	2025-08-19 14:32:54.840928
7	10	declined	2025-08-19 14:32:54.840928
7	9	pending	2025-08-20 01:24:02.317806
2	4	pending	2025-09-11 13:00:08.314032
2	6	pending	2025-09-11 13:00:16.555574
\.


--
-- Data for Name: goal_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goal_progress (progress_id, goal_id, contributor_id, progress_date, amount_added) FROM stdin;
1	1	1	2025-01-10	2000.00
2	1	1	2025-02-15	3000.00
3	1	1	2025-04-01	2500.00
4	2	1	2025-03-05	2500.00
5	2	1	2025-05-15	2500.00
6	3	1	2024-11-10	2000.00
7	3	1	2025-02-25	2000.00
10	5	2	2025-01-30	4000.00
11	5	2	2025-04-10	5000.00
12	6	2	2025-05-05	1500.00
13	6	2	2025-06-01	1350.00
14	7	2	2024-12-15	1000.00
15	7	2	2025-02-10	1000.00
16	8	3	2025-03-10	30000.00
17	9	3	2025-04-01	500.00
18	10	3	2025-02-01	5000.00
19	10	3	2025-05-01	5500.00
20	11	3	2024-06-10	8000.00
21	11	3	2024-12-20	12000.00
22	12	4	2025-01-10	10000.00
23	12	4	2025-03-01	5000.00
24	13	4	2025-05-10	500.00
25	13	4	2025-06-01	350.00
26	14	5	2025-02-15	6000.00
27	15	5	2025-01-10	2000.00
28	15	5	2025-03-05	2000.00
29	16	5	2024-07-10	1000.00
30	16	5	2024-09-01	2000.00
31	17	7	2025-01-20	10000.00
32	17	7	2025-03-05	16000.00
33	18	7	2025-04-10	2000.00
34	20	9	2025-04-01	1500.00
35	20	9	2025-04-20	1500.00
36	21	9	2024-10-01	3000.00
37	21	9	2024-12-01	4500.00
38	22	10	2025-02-01	5000.00
39	22	10	2025-04-01	5000.00
8	4	2	2025-04-15	12850.00
9	4	2	2025-05-10	13050.00
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goals (goal_id, user_id, goal_name, goal_type, target_amount, current_amount, start_date, target_date, end_date, banner_id, category_id, custom_category_id, goal_status, created_at, updated_at) FROM stdin;
23	10	Wedding Fund	savings	25000.00	10000.00	2025-01-01	2026-01-01	\N	4	22	\N	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
4	2	Charity Run Donation	donation	2000.00	27100.00	2025-04-10	2025-07-01	\N	1	20	\N	completed	2025-08-19 14:32:54.840928	2025-09-11 22:57:02.385801
5	2	Wedding Budget Cap	spending limit	15000.00	18000.00	2025-01-01	2025-12-01	\N	1	17	\N	completed	2025-08-19 14:32:54.840928	2025-09-11 22:57:02.385801
6	2	Sustainable Grocery Plan	spending limit	3000.00	5700.00	2025-05-01	2025-06-30	\N	3	\N	2	completed	2025-08-19 14:32:54.840928	2025-09-11 22:57:02.385801
7	2	Charity Marathon	donation	2000.00	4000.00	2024-12-01	2025-03-01	2025-03-10	4	20	\N	completed	2025-08-19 14:32:54.840928	2025-09-11 22:57:02.385801
19	7	Bike Fixes	savings	2500.00	0.00	2024-12-01	2025-03-01	\N	2	\N	7	failed	2025-08-19 14:32:54.840928	2025-09-12 09:47:39.585973
17	7	Gaming PC Cap	spending limit	25000.00	52000.00	2025-01-15	2025-04-30	2025-04-29	4	\N	12	completed	2025-08-19 14:32:54.840928	2025-09-12 09:47:39.585973
18	7	Gaming PC Upgrade	savings	12000.00	4000.00	2025-04-01	2025-12-01	\N	5	\N	6	in-progress	2025-08-19 14:32:54.840928	2025-09-12 09:47:39.585973
8	3	Crypto Investment Pool	investment	30000.00	60000.00	2025-02-15	2025-05-15	2025-05-10	2	23	\N	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
9	3	Trading Bot Funding	savings	10000.00	1000.00	2025-03-20	2025-09-01	\N	1	\N	3	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
10	3	Crypto Portfolio	investment	15000.00	21000.00	2025-01-15	2025-12-31	\N	5	\N	5	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
11	3	Tech Stash	investment	20000.00	40000.00	2024-06-01	2025-01-01	2025-01-02	1	23	\N	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
12	4	Student Loan Repayment	debt	20000.00	30000.00	2025-01-01	2025-10-01	\N	3	24	\N	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
13	4	Art Supplies Budget	spending limit	1000.00	1700.00	2025-05-01	2025-07-01	\N	2	\N	4	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
14	5	Sponsor School Fees	donation	6000.00	12000.00	2025-02-01	2025-07-01	2025-06-20	2	\N	11	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
15	5	School Fees	savings	8000.00	8000.00	2025-01-01	2025-04-01	\N	3	13	\N	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
16	5	Weight Loss Coaching	spending limit	3000.00	6000.00	2024-07-01	2024-11-01	2024-10-25	4	12	\N	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
20	9	Conference Flights	savings	8000.00	6000.00	2025-03-01	2025-07-01	\N	5	\N	13	in-progress	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
21	9	Conference Flight	savings	7500.00	15000.00	2024-09-01	2025-02-01	2025-01-30	3	26	\N	completed	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
1	1	Emergency Fund	savings	10000.00	15000.00	2025-01-01	2025-12-01	\N	1	22	\N	completed	2025-08-19 14:32:54.840928	2025-09-06 22:24:24.482916
2	1	Pay Off Credit Card	debt	5000.00	10000.00	2025-03-01	2025-06-30	2025-06-28	2	24	\N	completed	2025-08-19 14:32:54.840928	2025-09-06 22:24:24.482916
3	1	Credit Card Debt	debt	4000.00	8000.00	2024-11-01	2025-03-01	2025-03-02	2	24	\N	completed	2025-08-19 14:32:54.840928	2025-09-06 22:24:24.482916
22	10	Pet Rescue Fund	donation	3000.00	10000.00	2025-04-01	2025-10-01	\N	1	20	\N	cancelled	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: leaderboard_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leaderboard_entries (entry_id, user_id, leaderboard_score, ranking, created_at) FROM stdin;
1	5	1350	1	2025-08-19 14:32:54.840928
2	3	1020	2	2025-08-19 14:32:54.840928
3	10	970	3	2025-08-19 14:32:54.840928
4	8	880	4	2025-08-19 14:32:54.840928
5	1	780	5	2025-08-19 14:32:54.840928
6	7	560	6	2025-08-19 14:32:54.840928
7	2	430	7	2025-08-19 14:32:54.840928
8	4	265	8	2025-08-19 14:32:54.840928
9	9	190	9	2025-08-19 14:32:54.840928
10	6	120	10	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: learning_modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.learning_modules (module_id, module_title, topic, difficulty, module_banner_id) FROM stdin;
1	Budgeting Basics	Personal Finance	beginner	1
2	Investment Fundamentals	Wealth Building	intermediate	2
3	Credit Sensei	Smart Borrowing	beginner	3
4	FOMO vs. Future You	Social Budgeting	beginner	4
5	Retrenchment Rescue	Crisis Management	beginner	5
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (lesson_id, module_id, lesson_number, lesson_title, content, estimated_duration) FROM stdin;
1	1	1	What is Budgeting and Why it Matters	Budgeting is the act of creating a plan to manage your income and expenses. It gives you control over your money by helping you understand where it goes and how much you can allocate to your needs, wants, and future goals. A budget isn't about restricting your lifestyle—it's about making sure your spending aligns with what you truly value and want to achieve.\n\n  Without a budget, it's easy to overspend and find yourself falling short when emergencies arise or bills are due. Budgeting reduces financial stress, helps avoid debt, and empowers you to make informed financial decisions. Whether you're a student managing an allowance or an adult with a salary, budgeting is a foundational skill that builds financial independence.	6
2	1	2	Understanding Your Income and Expenses	The first step in budgeting is understanding how much money you have and where it's going. Income includes anything you earn—your salary, side hustles, stipends, or allowances. Expenses, on the other hand, are the things you spend money on. These are usually split into two categories: fixed (like rent, subscriptions, school fees) and variable (like groceries, entertainment, or dining out).\n\n  Tracking every expense, even the small ones, helps reveal patterns in your spending. Many people underestimate how much they spend on daily coffees or spontaneous takeouts. Using tools like budgeting apps or even a simple spreadsheet can give you a clear view of your financial habits. Once you see your income versus expenses laid out, you can start making smarter choices about where to cut back and where to allocate more.	7
3	1	3	Setting Financial Goals	Financial goals are the targets you aim to reach with your money. They help you stay motivated and focused when making spending decisions. Goals can be short-term (saving for a concert, emergency fund), medium-term (paying off a loan, getting a new laptop), or long-term (saving for university or a car). The clearer your goals are, the easier it becomes to prioritize your spending around them.\n\n  When setting goals, make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. For example, instead of saying "I want to save money," a SMART goal would be: “I want to save R1,500 in 3 months for a new phone by saving R125 each week.” Having a plan like this makes it easier to stay on track and adjust your budget if needed.	6
4	1	4	Building a Simple Monthly Budget	Now that you understand your income, expenses, and goals, it's time to create your actual budget. A popular method is the 50/30/20 rule: 50% of your income goes to needs (rent, transport, groceries), 30% to wants (clothes, takeout, hobbies), and 20% to savings or debt repayments. This method gives structure while leaving room for flexibility and enjoyment.\n\n  Start by writing down your monthly income, then subtract your fixed and variable expenses. Allocate money to each category using the rule as a guide, adjusting percentages based on your situation. Don't forget to review your budget at the end of each month—look at what worked and what didn't. Budgeting is not static—it evolves with your lifestyle, goals, and unexpected changes.	8
5	1	5	Sticking to Your Budget	Creating a budget is one thing—sticking to it is where the real challenge lies. Consistency is key. You can use mobile apps, reminders, or a weekly financial check-in to keep your spending in check. Keep track of your receipts or transactions and review them every few days. This habit keeps you aware of where your money is going and helps you avoid end-of-month surprises.\n\n  It's also important to allow flexibility. Life happens—maybe an emergency pops up or a one-time deal you can't miss. If you overspend one week, reduce your spending the next. Forgive slip-ups, but always get back on track. Reward yourself (in small, affordable ways) for hitting savings goals or sticking to your plan. Financial success doesn't come from perfection—it comes from persistence.	7
6	2	1	Introduction to Investing	Investing is the process of allocating money with the expectation of generating profit or income. Unlike saving, which focuses on preserving money, investing aims to grow your wealth over time through various assets like stocks, bonds, and real estate.\n\n  Key Benefits:\n  - Potential for higher returns than savings accounts\n  - Protection against inflation\n  - Building long-term wealth\n  - Generating passive income\n\n  Common Investment Vehicles:\n  1. Stocks (Equities)\n  2. Bonds (Fixed Income)\n  3. Mutual Funds & ETFs\n  4. Real Estate\n  5. Commodities (Gold, Oil, etc.)\n\n  Understanding your risk tolerance and investment horizon is crucial before beginning your investment journey.	7
7	2	2	Understanding Risk and Return	The relationship between risk and return is fundamental to investing. Generally, higher potential returns come with higher risk.\n\n  Types of Investment Risk:\n  - Market Risk: Overall market fluctuations\n  - Inflation Risk: Purchasing power erosion\n  - Interest Rate Risk: Bond price sensitivity\n  - Liquidity Risk: Difficulty selling assets\n  - Concentration Risk: Overexposure to one asset\n\n  Risk Management Strategies:\n  1. Diversification: Spreading investments across different assets\n  2. Asset Allocation: Balancing stocks, bonds, and other assets\n  3. Dollar-Cost Averaging: Investing fixed amounts regularly\n  4. Rebalancing: Adjusting portfolio periodically\n\n  Historical Average Annual Returns:\n  - Stocks: ~7-10%\n  - Bonds: ~3-5%\n  - Savings Accounts: ~0.5-2%	8
8	2	3	Stock Market: Your Money’s Playground	Think of the stock market like a giant marketplace where pieces of companies (called shares) are bought and sold. It's where your money can grow while you focus on living your life!\n\n  🔍 Quick Cheat Sheet:\n  - NYSE/NASDAQ/JSE = Different "shops" where stocks are traded\n  - Bull market = Prices going up (🔼 like a bull’s horns)\n  - Bear market = Prices going down (🔽 like a bear swiping down)\n  - Market cap = Company size (Large = established, Small = up-and-coming)\n\n  💰 How People Make Money:\n  1. Price goes up → Sell for profit (Capital gains)\n  2. Company shares profits → You get paid (Dividends)\n\n  🎯 Pro Tips for Beginners:\n  • Start with companies you know (Love their products? Research them!)\n  • Don't put all your cash in one stock (That's like only eating pizza forever)\n  • Ignore the hype (If everyone's screaming "BUY NOW!", take a breath)\n\n  💡 Fun Fact: \n  If you'd invested R1,000 in Naspers in 1994, it'd be worth over R2 million today! But remember – past performance ≠ future results.\n\n  🛒 Buying Stocks is Easier Than You Think:\n  1. Choose an app (EasyEquities, ETFSA, etc.)\n  2. Deposit money\n  3. Buy shares (as little as R100!)\n  4. Watch your money work for you (but don't check daily!)	8
9	2	4	Building a Diversified Portfolio	A well-diversified portfolio reduces risk while maximizing returns potential. Your asset allocation should match your goals and risk tolerance.\n\n  Portfolio Construction Principles:\n  1. The 60/40 Rule: 60% stocks, 40% bonds (traditional)\n  2. Age-Based Allocation: (100 - age)% in stocks\n  3. Core-Satellite Approach: Index funds + individual picks\n\n  Rebalancing Strategies:\n  - Calendar-Based: Quarterly/annually\n  - Threshold-Based: When allocations deviate 5-10%\n\n  Example Portfolio for Moderate Risk:\n  - 50% Domestic Stocks\n  - 20% International Stocks\n  - 20% Bonds\n  - 5% Real Estate (REITs)\n  - 5% Cash	8
10	2	5	Long-Term Investment Strategies	Successful investing requires patience and discipline. These proven strategies help investors build wealth over time.\n\n  Buy-and-Hold Strategy:\n  - Invest in quality companies\n  - Hold through market fluctuations\n  - Benefit from compounding returns\n\n  Index Investing:\n  - Low-cost index funds/ETFs\n  - Matches market performance\n  - Minimal maintenance required\n\n  Dividend Growth Investing:\n  - Focus on companies with growing dividends\n  - Reinvest dividends for compounding\n  - Provides income in retirement\n\n  Common Mistakes to Avoid:\n  - Emotional trading\n  - Chasing "hot" stocks\n  - Market timing attempts\n  - Overconcentration in one sector	7
11	3	1	Credit 101 - The Adulting Hack	💳 Credit = Borrowing money now that you promise to pay back later (with interest!). It's like a financial trust score that follows you everywhere.\n\n  🔥 Why It Matters:\n  - Can help you buy a car/home/start business\n  - Affects cellphone contracts & apartment rentals\n  - Good credit = lower interest rates = more money saved\n\n  💸 Credit Golden Rule:\n  "Only borrow what you can DEFINITELY pay back by payday" - Your Future Self\n\n  🚦 Credit Types:\n  • Credit cards (like a reusable loan)\n  • Store accounts (Hi, Mr Price!)\n  • Personal loans (Bigger amounts)\n  • Student loans (Education investment)\n\n  📱 Pro Tip: \n  Check your credit report for free once a year at TransUnion or Experian!	6
12	3	2	Credit Scores Demystified	Your credit score is like a financial report card (but way more important than matric!). Scores range 0-999:\n\n  🟢 767+ = Credit Ninja\n  🟡 681-766 = On Your Way\n  🔴 0-680 = Needs Work\n\n  🧮 What Affects Your Score:\n  1. Payment History (35%) - Pay on time, every time!\n  2. Amounts Owed (30%) - Keep balances <30% of limit\n  3. Credit Age (15%) - Older accounts help\n  4. Credit Mix (10%) - Different types (but don't overdo it)\n  5. New Credit (10%) - Too many applications = red flag\n\n  💯 Quick Boosters:\n  • Set up debit orders for minimum payments\n  • Keep old accounts open (even if unused)\n  • Space out credit applications	7
13	3	3	Credit Cards - Friend or Foe?	Credit cards are like fire - useful tool or dangerous weapon depending on how you use them!\n\n  ✅ The Good:\n  • Build credit history\n  • Earn rewards/cashback\n  • Fraud protection\n  • Emergency cushion\n\n  ❌ The Bad:\n  • 20%+ interest if not paid in full\n  • Easy to overspend\n  • Fees add up quickly\n\n  🛡️ Safety Rules:\n  1. ALWAYS pay full balance monthly\n  2. Never use >30% of your limit\n  3. Skip "buy now, pay later" unless essential\n  4. Freeze your card in an actual freezer if tempted!\n\n  💡 Pro Hack: \n  Use your credit card like a debit card - only spend what's in your bank account right now.	8
14	3	4	Debt Dig-Out Strategies	In a debt hole? Stop digging! Here's your escape ladder:\n\n  🚨 Danger Signs:\n  • Paying one credit card with another\n  • Minimum payments only\n  • Lying to friends/family about debt\n\n  🔧 Fix-It Tools:\n  1️⃣ Snowball Method: \n  - Pay smallest debt first (quick wins!)\n  - Then roll that payment to next debt\n\n  2️⃣ Avalanche Method:\n  - Attack highest interest debt first\n  - Saves most money long-term\n\n  3️⃣ Debt Consolidation:\n  - Combine debts into one lower-interest loan\n  - BUT don't run up cards again!\n\n  📞 Lifelines:\n  • National Debtline (0800 20 57 28)\n  • Debt counseling (it's confidential!)	7
15	3	5	Credit Hacks for Big Goals	Want a car/home/business loan someday? Start prepping NOW:\n\n  🚗 Car Loan Prep (12+ months before):\n  • Get credit score >650\n  • Save 20% deposit = better rates\n  • Keep debt-to-income ratio <35%\n\n  🏡 Home Loan Game Plan:\n  • Need 650+ credit score\n  • No missed payments for 2 years\n  • Stable job history matters too\n\n  💼 Business Funding:\n  • Personal credit still counts\n  • Separate business account ASAP\n  • Build relationships with local banks\n\n  🌟 Golden Rule: \n  The best time to fix your credit was last year. The second-best time? TODAY!	8
16	4	1	Why FOMO Costs More Than Money	💸 **FOMO Fact:** The average South African spends **R1,200/month** on unplanned social outings (yes, that's **R14k/year!**).  \n\n  🔍 **What's Really Happening?**  \n  - You say *"It's just one night out!"* → But 5 "just one nights" = a month's savings.  \n  - **Hidden Cost:** The *"I'll fix it later"* mindset keeps you stuck in paycheck-to-paycheck mode.  \n\n  🎯 **This Lesson's Goal:**  \n  Identify your **FOMO Triggers**:  \n  1. **Scrolling Instagram** → "They're all at the club!"  \n  2. **Group Chats** → "Everyone's going!"  \n  3. **FOMO Discounts** → "Last chance! Sale ends tonight!"  \n\n  💡 **Try This:**  \n  Next time you feel FOMO, **pause and ask**:  \n  *"Will I remember this in 3 months? Or would Future Me rather have R500 closer to a car deposit?"*	6
17	4	2	The 50/30/20 Rule for Fun & Savings	💰 **Budget Like a Pro:**  \n  Split your after-tax income like this:  \n  - **50% Needs** (Rent, food, transport)  \n  - **30% Wants** (Social life, Netflix, takeout)  \n  - **20% Future You** (Savings, investments)  \n\n  📌 **Example (R10k salary):**  \n  - **R3k for fun** = R750/week (still enough for 2-3 outings!)  \n  - **R2k savings** = R24k/year → Hello, emergency fund!  \n\n  🔥 **Hack:**  \n  Open a **separate "Guilt-Free Fun" bank account**. When the R750 is gone, **get creative**:  \n  - Host a *bring-and-braai* (cheaper than clubs!)  \n  - Swap pricey cocktails for *DIY gin tastings*  \n  - Try *free events* (comedy nights, hiking, beach days)  \n\n  💡 **Pro Tip:**  \n  Automate your savings **right after payday** – Future You will high-five you later!	7
18	4	3	The 24-Hour Rule to Stop Impulse Spending	🛑 **The Problem:**  \n  FOMO makes us **spend fast** → regret later.  \n\n  ✅ **The Fix:** **Wait 24 hours** before saying *"YES"* to any non-essential spend.  \n\n  📱 **Real-Life Test:**  \n  1. **You see:** "Concert tickets on sale now!"  \n  2. **Instead of buying immediately**, set a reminder for **tomorrow**.  \n  3. **Ask yourself:**  \n    - *"Can I afford this without touching savings?"*  \n    - *"Is there a cheaper alternative?"* (e.g., watch the live stream?)  \n\n  📊 **Results:**  \n  - **80% of the time**, you'll realize you *don't actually need it*.  \n  - **20% of the time**, you'll buy it **with zero guilt** because it was a *real* priority.  \n\n  💬 **Challenge:**  \n  Try this for **one week** and track how much you save!	6
19	4	4	"Fake Rich" vs. "Real Rich" Habits	🎭 **Fake Rich Habits:**  \n  - Buying rounds for the whole squad *"to look cool"*  \n  - Leasing a fancy car *just for Instagram*  \n  - Maxing out credit cards on designer sales  \n\n  🏆 **Real Rich Habits:**  \n  - **Saying NO** to events you can't afford  \n  - **Investing in skills** (online courses > overpriced bottles)  \n  - **Delayed gratification** (e.g., saving for a trip instead of clubbing weekly)  \n\n  💡 **Reality Check:**  \n  That friend who *always* posts luxury trips?  \n  - They might be **in serious debt**.  \n  - **OR** they budgeted for months to afford it.  \n\n  🔑 **Takeaway:**  \n  *"We buy things we don't need, with money we don't have, to impress people we don't like."* – Fight the FOMO illusion!	7
20	4	5	How to Politely Say "I'm on a Budget"	🚨 **The Struggle:**  \n  Your friends want to go to an expensive restaurant, but you're saving. What do you say?  \n\n  💬 **Scripts That Work:**  \n  1. *"I'm saving for [goal], but I'll join for drinks later!"*  \n  2. *"Let's try [cheaper alternative] instead – my treat next time!"*  \n  3. *"I'm doing a no-spend month, but let's plan a braai soon!"*  \n\n  🔄 **Better Yet – Suggest Alternatives:**  \n  - **"Picnic in the park"** > R200 cocktails  \n  - **"Game night at home"** > R500 club cover  \n  - **"Hike + coffee"** > R300 brunch  \n\n  💡 **Truth Bomb:**  \n  *Real friends* won't judge you for budgeting. If they do? **Time for new friends.**	6
21	5	1	Your 30-Day Survival Plan	💥 **First 72 Hours Checklist:**  \n  1. **Breathe.** Job loss = shock. Don't make rash money decisions.  \n  2. **Confirm paperwork** – Get retrenchment letter & UIF forms signed.  \n  3. **Cut non-essentials** NOW (subscriptions, eating out).  \n\n  📉 **Cash Flow Triage:**  \n  - **Priority 1:** Rent, utilities, food  \n  - **Priority 2:** Minimum debt payments  \n  - **Pause:** Savings, investments, luxury spending  \n\n  💡 **SA Pro Tip:**  \n  Call providers *before* missing payments – many offer **payment holidays** for retrenchment (Cell C, DSTV, banks).  \n\n  🛠️ **Action Step:**  \n  List your **last 3 months' expenses** – highlight what can be paused or reduced.	7
22	5	2	How to Claim UIF Like a Pro	🇿🇦 **UIF Fast Facts:**  \n  - You get **38-58% of your salary** for up to 12 months.  \n  - First payment takes **6-8 weeks** → act FAST.  \n\n  📝 **Documents Needed:**  \n  1. ID copy  \n  2. UI-2.8 form (from employer)  \n  3. UI-19 form (proof of termination)  \n  4. 3 months' bank statements  \n\n  🚀 **Online Application Steps:**  \n  1. Register on [uFiling](https://ufiling.labour.gov.za)  \n  2. Upload documents  \n  3. Track status via SMS  \n\n  ⚠️ **Avoid These Mistakes:**  \n  - Waiting >12 months to claim  \n  - Not following up if payment delays  \n  - Forgetting to **re-apply every 4 months**  \n\n  💡 **Hack:** Visit a **Labour Centre** early morning to skip queues.	8
23	5	3	Emergency Side Hustles That Pay Fast	💰 **Quick Cash Options (R500+ daily):**  \n  - **Food Delivery** (Mr D, Uber Eats) – Use a bicycle/scooter  \n  - **Freelancing** (Upwork, Fiverr) – Data entry, basic graphic design  \n  - **Tutoring** – Maths/English via Zoom (R150-300/hour)  \n\n  🛒 **Sell Smart:**  \n  1. **Facebook Marketplace** – Old gadgets, clothes, furniture  \n  2. **Back-a-Buddy** – Crowdfund upskilling courses  \n  3. **Airvoice/Flash** – Resell prepaid data/Airtime  \n\n  🔥 **Low-Cost Ideas:**  \n  - **Car Washing** (R100/car, 5 cars/day = R500)  \n  - **CV Writing** (R200 per CV for job seekers)  \n\n  💡 **Pro Tip:**  \n  Use free Google Certificates (IT support, digital marketing) to boost earning potential.	7
24	5	4	Emotional & Mental Health First Aid	💔 **It's Not Just Money – It's Grief:**  \n  - Allow yourself to feel anger/sadness (but set a *"worry time"* limit)  \n  - Avoid isolation → join free support groups ([SADAG](https://www.sadag.org))  \n\n  🧠 **Crisis Mindset Shifts:**  \n  - **"I lost a job, not my worth."**  \n  - **"This is temporary – what can I control?"**  \n\n  🆘 **Free SA Resources:**  \n  1. **SADAG Helpline:** 0800 456 789  \n  2. **LifeLine:** 0861 322 322  \n  3. **Local churches/NGOs** often offer free counseling  \n\n  💡 **Action Step:**  \n  Schedule **one small win daily** (e.g., 10 job applications, 1 networking call).	6
25	5	5	Bouncing Back Stronger	🚀 **Rebuild Strategy:**  \n  1. **Upskill for Free:**  \n    - Google Digital Garage (certificates)  \n    - Coursera Financial Aid (apply for free courses)  \n  2. **Network Relentlessly:**  \n    - LinkedIn messages: *"I'm exploring X roles – any advice?"*  \n  3. **Consider Pivoting:**  \n    - Remote work (international companies hire SA talent)  \n\n  📈 **Future-Proofing:**  \n  - **Build a 6-month emergency fund** (start small – R500/month)  \n  - **Diversify income** (always have 2+ income streams)  \n\n  💡 **Success Story:**  \n  *"After retrenchment, I learned coding via YouTube. Now I earn 3x my old salary remotely."* – Thando, 28	8
\.


--
-- Data for Name: module_banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_banners (module_banner_id, banner_image_path, created_at) FROM stdin;
1	module_banners/budgeting_banner.jpg	2025-08-19 14:32:54.840928
2	module_banners/investment_banner.jpg	2025-08-19 14:32:54.840928
3	module_banners/credit_banner.jpg	2025-08-19 14:32:54.840928
4	module_banners/fomo_banner.jpg	2025-08-19 14:32:54.840928
5	module_banners/retrenchment_banner.jpg	2025-08-19 14:32:54.840928
\.


--
-- Data for Name: point_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.point_rules (rule_id, action_type, base_points) FROM stdin;
1	transaction	10
2	goal_created	15
3	goal_completed	75
4	quiz_completed	30
5	achievement_unlocked	50
6	challenge_completed	60
\.


--
-- Data for Name: points_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.points_log (log_id, user_id, source, source_id, points, created_at) FROM stdin;
1	1	goal	93	30	2025-06-28 15:00:00
2	1	transaction	18	10	2025-06-04 22:00:00
3	1	goal	16	75	2025-06-02 22:00:00
4	1	challenge	54	10	2025-07-02 00:00:00
5	1	transaction	35	50	2025-06-11 10:00:00
6	1	challenge	97	10	2025-06-13 10:00:00
7	1	transaction	7	10	2025-06-21 15:00:00
8	1	goal	1	75	2025-06-30 01:00:00
9	1	transaction	38	30	2025-06-18 12:00:00
10	1	goal	1	50	2025-06-14 06:00:00
11	1	achievement	41	50	2025-06-14 04:00:00
12	1	challenge	32	100	2025-06-30 09:00:00
13	1	goal	99	20	2025-06-23 05:00:00
14	1	quiz	98	30	2025-07-01 23:00:00
15	1	quiz	87	30	2025-06-24 11:00:00
16	1	quiz	83	30	2025-06-14 17:00:00
17	1	transaction	30	50	2025-06-01 23:00:00
18	1	transaction	26	30	2025-06-20 18:00:00
19	2	transaction	30	75	2025-06-30 00:00:00
20	2	quiz	47	30	2025-06-30 12:00:00
21	2	achievement	28	10	2025-06-12 09:00:00
22	2	challenge	17	100	2025-06-16 23:00:00
23	2	goal	65	100	2025-06-04 14:00:00
24	2	challenge	89	100	2025-06-19 18:00:00
25	2	challenge	26	10	2025-06-08 21:00:00
26	2	challenge	37	5	2025-06-13 03:00:00
27	3	goal	8	10	2025-06-14 22:00:00
28	3	transaction	19	100	2025-06-27 03:00:00
29	3	achievement	50	10	2025-06-25 00:00:00
30	3	quiz	11	20	2025-06-13 08:00:00
31	3	goal	36	75	2025-06-04 01:00:00
32	3	quiz	19	50	2025-06-26 12:00:00
33	3	transaction	85	20	2025-06-30 06:00:00
34	3	challenge	49	100	2025-06-13 11:00:00
35	3	transaction	49	100	2025-06-22 07:00:00
36	3	achievement	14	75	2025-06-30 11:00:00
37	3	transaction	97	20	2025-06-03 00:00:00
38	3	achievement	28	30	2025-06-26 23:00:00
39	3	achievement	39	20	2025-06-15 06:00:00
40	3	challenge	1	20	2025-06-08 20:00:00
41	3	achievement	44	30	2025-06-10 16:00:00
42	3	transaction	69	20	2025-06-12 12:00:00
43	3	challenge	8	100	2025-06-22 01:00:00
44	3	quiz	7	50	2025-06-28 02:00:00
45	4	challenge	9	100	2025-06-19 11:00:00
46	4	quiz	56	20	2025-06-10 06:00:00
47	4	challenge	94	75	2025-06-20 13:00:00
48	4	quiz	41	20	2025-06-17 19:00:00
49	4	challenge	43	30	2025-06-23 11:00:00
50	5	quiz	6	100	2025-06-20 23:00:00
51	5	challenge	100	100	2025-06-16 17:00:00
52	5	goal	5	100	2025-06-04 10:00:00
53	5	transaction	78	20	2025-06-25 12:00:00
54	5	achievement	45	30	2025-06-18 17:00:00
55	5	transaction	22	30	2025-06-12 04:00:00
56	5	quiz	85	20	2025-06-30 00:00:00
57	5	challenge	10	20	2025-06-18 23:00:00
58	5	challenge	69	50	2025-06-04 02:00:00
59	5	goal	43	100	2025-06-06 04:00:00
60	5	goal	65	75	2025-06-29 18:00:00
61	5	goal	24	100	2025-06-13 23:00:00
62	5	challenge	10	20	2025-07-01 05:00:00
63	5	goal	49	100	2025-06-25 10:00:00
64	5	quiz	48	50	2025-06-08 14:00:00
65	5	quiz	10	10	2025-06-24 09:00:00
66	5	goal	72	30	2025-06-13 03:00:00
67	5	transaction	67	10	2025-06-19 10:00:00
68	5	transaction	48	50	2025-06-05 12:00:00
69	5	challenge	67	75	2025-06-15 01:00:00
70	5	quiz	59	75	2025-06-05 23:00:00
71	5	transaction	5	100	2025-06-16 07:00:00
72	5	quiz	75	55	2025-06-03 19:00:00
73	6	quiz	57	100	2025-06-03 15:00:00
74	6	challenge	56	20	2025-06-30 21:00:00
75	7	achievement	9	10	2025-06-26 07:00:00
76	7	transaction	90	100	2025-06-26 06:00:00
77	7	goal	17	10	2025-06-22 12:00:00
78	7	challenge	42	30	2025-06-18 03:00:00
79	7	goal	98	30	2025-06-24 14:00:00
80	7	quiz	99	10	2025-06-04 04:00:00
81	7	transaction	98	50	2025-06-01 15:00:00
82	7	challenge	66	75	2025-06-22 00:00:00
83	7	quiz	54	30	2025-06-23 16:00:00
84	7	transaction	66	30	2025-06-12 14:00:00
85	7	achievement	23	50	2025-06-10 21:00:00
86	7	quiz	50	75	2025-06-02 08:00:00
87	7	goal	90	60	2025-06-17 23:00:00
88	8	goal	8	20	2025-06-15 17:00:00
89	8	goal	43	30	2025-06-28 12:00:00
90	8	transaction	88	20	2025-06-30 20:00:00
91	8	challenge	72	75	2025-06-17 07:00:00
92	8	challenge	87	100	2025-06-04 04:00:00
93	8	quiz	76	10	2025-06-16 12:00:00
94	8	transaction	17	100	2025-06-04 20:00:00
95	8	quiz	16	75	2025-06-01 19:00:00
96	8	goal	93	30	2025-06-11 09:00:00
97	8	challenge	52	50	2025-06-30 20:00:00
98	8	challenge	1	75	2025-06-11 17:00:00
99	8	achievement	60	10	2025-07-01 06:00:00
100	8	goal	30	20	2025-07-01 21:00:00
101	8	goal	14	20	2025-06-04 23:00:00
102	8	goal	76	30	2025-06-18 20:00:00
103	8	challenge	47	100	2025-06-26 18:00:00
104	9	transaction	80	10	2025-06-26 15:00:00
105	9	quiz	71	20	2025-06-11 15:00:00
106	9	transaction	88	20	2025-06-23 20:00:00
107	9	transaction	97	50	2025-06-02 23:00:00
108	9	quiz	96	50	2025-06-28 11:00:00
109	9	transaction	24	10	2025-06-07 09:00:00
110	9	achievement	33	30	2025-06-11 21:00:00
111	10	quiz	72	100	2025-06-16 07:00:00
112	10	achievement	30	50	2025-06-12 09:00:00
113	10	challenge	27	100	2025-06-13 18:00:00
114	10	transaction	89	30	2025-06-21 15:00:00
115	10	goal	93	30	2025-06-13 02:00:00
116	10	transaction	41	50	2025-06-09 20:00:00
117	10	transaction	82	50	2025-06-09 21:00:00
118	10	quiz	42	30	2025-07-01 14:00:00
119	10	challenge	93	75	2025-06-28 12:00:00
120	10	challenge	53	10	2025-06-07 00:00:00
121	10	quiz	83	30	2025-06-14 11:00:00
122	10	transaction	76	100	2025-06-15 04:00:00
123	10	achievement	5	75	2025-06-11 06:00:00
124	10	transaction	31	50	2025-06-22 03:00:00
125	10	goal	65	20	2025-06-23 08:00:00
\.


--
-- Data for Name: post_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_comments (comment_id, post_id, user_id, comment, created_at) FROM stdin;
1	1	1	Congrats!	2025-08-19 15:51:21.898084
2	1	1	Congrats to meeeeeeee! 🎉	2025-08-19 20:11:48.07793
6	4	1	This is my first achievement.	2025-09-13 21:09:55.204833
7	4	2	Well done pookie!	2025-09-13 21:11:19.766678
9	11	1	Comment	2025-09-13 23:51:39.99794
10	11	1	Comment 2	2025-09-13 23:51:51.835548
12	11	2	Comment 4	2025-09-13 23:53:09.036842
13	11	1	me? or you?	2025-09-13 23:54:26.468381
14	11	1	me? or you again?	2025-09-13 23:54:50.226869
15	13	1	Hi from collabs!	2025-09-14 00:06:24.603378
17	13	2	I seeeeeee	2025-09-14 00:07:19.015107
19	13	2	A	2025-09-14 00:29:15.94992
20	13	2	B	2025-09-14 00:29:19.805243
21	13	2	45	2025-09-14 00:29:25.572834
22	13	2	checking again	2025-09-14 00:29:40.724815
23	15	1	xx	2025-09-14 00:34:22.508955
24	15	2	hey	2025-09-14 00:51:56.626491
\.


--
-- Data for Name: post_community_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_community_tags (post_id, community_id) FROM stdin;
1	1
1	3
6	4
7	4
8	6
9	3
10	1
12	3
13	3
14	3
15	3
\.


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_likes (post_id, user_id, liked_at) FROM stdin;
4	1	2025-09-13 21:13:20.105931
4	2	2025-09-13 21:14:56.180608
15	2	2025-09-14 00:50:43.656337
14	2	2025-09-14 00:50:46.156931
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_attempts (attempt_id, user_id, quiz_id, attempt_score, passed, attempt_number, "timestamp") FROM stdin;
1	1	1	1	f	1	2025-08-19 14:32:54.840928
2	1	1	1	f	2	2025-08-19 14:32:54.840928
3	1	1	2	f	3	2025-08-19 14:32:54.840928
4	1	1	3	t	4	2025-08-19 14:32:54.840928
5	1	2	3	t	1	2025-08-19 14:32:54.840928
6	1	3	4	t	1	2025-08-19 14:32:54.840928
7	2	1	3	t	1	2025-08-19 14:32:54.840928
8	2	2	5	t	1	2025-08-19 14:32:54.840928
9	2	4	2	f	1	2025-08-19 14:32:54.840928
10	3	2	2	f	1	2025-08-19 14:32:54.840928
11	3	2	4	t	2	2025-08-19 14:32:54.840928
12	3	4	5	t	1	2025-08-19 14:32:54.840928
13	3	5	1	f	1	2025-08-19 14:32:54.840928
14	4	1	5	t	1	2025-08-19 14:32:54.840928
15	4	3	2	f	1	2025-08-19 14:32:54.840928
16	4	3	5	t	2	2025-08-19 14:32:54.840928
17	5	5	4	t	1	2025-08-19 14:32:54.840928
18	5	5	2	f	2	2025-08-19 14:32:54.840928
19	5	4	3	t	1	2025-08-19 14:32:54.840928
20	6	1	5	t	1	2025-08-19 14:32:54.840928
21	6	2	5	t	1	2025-08-19 14:32:54.840928
22	6	3	5	t	1	2025-08-19 14:32:54.840928
23	6	4	3	t	1	2025-08-19 14:32:54.840928
24	7	2	1	f	1	2025-08-19 14:32:54.840928
25	7	2	5	t	2	2025-08-19 14:32:54.840928
26	7	3	2	f	1	2025-08-19 14:32:54.840928
27	8	4	3	t	1	2025-08-19 14:32:54.840928
28	8	5	3	t	1	2025-08-19 14:32:54.840928
29	9	1	4	t	1	2025-08-19 14:32:54.840928
30	9	2	2	f	1	2025-08-19 14:32:54.840928
31	9	2	3	t	2	2025-08-19 14:32:54.840928
32	9	3	1	f	1	2025-08-19 14:32:54.840928
33	9	5	5	t	1	2025-08-19 14:32:54.840928
34	10	1	2	f	1	2025-08-19 14:32:54.840928
35	10	3	2	f	1	2025-08-19 14:32:54.840928
36	10	4	2	f	1	2025-08-19 14:32:54.840928
37	10	4	4	t	2	2025-08-19 14:32:54.840928
38	7	5	2	f	1	2025-08-19 21:31:29.75119
39	7	1	0	f	1	2025-08-20 01:22:26.172443
40	2	1	0	f	2	2025-09-10 20:52:05.118759
41	2	1	0	f	3	2025-09-10 20:52:06.434445
42	2	5	1	f	1	2025-09-10 21:19:15.322741
43	2	4	5	t	2	2025-09-11 11:24:08.917574
44	2	4	5	t	3	2025-09-11 11:24:10.062613
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (quiz_id, module_id, questions_jsonb, max_score, pass_score) FROM stdin;
1	1	[{"points": 1, "options": ["To restrict your spending completely", "To help you manage your income and expenses effectively", "To make you rich quickly", "To track only your large purchases"], "question": "What is the primary purpose of budgeting?", "correct_answer": 1}, {"points": 1, "options": ["Income and savings", "Fixed and variable", "Large and small", "Personal and business"], "question": "What are the two main categories of expenses?", "correct_answer": 1}, {"points": 1, "options": ["Simple, Manageable, Achievable, Realistic, Timely", "Specific, Measurable, Achievable, Relevant, Time-bound", "Strategic, Meaningful, Actionable, Responsible, Targeted", "Savings, Money, Assets, Resources, Treasury"], "question": "What does the SMART acronym stand for in financial goal setting?", "correct_answer": 1}, {"points": 1, "options": ["20%", "30%", "50%", "70%"], "question": "According to the 50/30/20 rule, what percentage should go to needs?", "correct_answer": 2}, {"points": 1, "options": ["Perfection in following the budget", "Complete avoidance of all wants", "Persistence and consistency", "Earning more money"], "question": "What is the key to successful budgeting?", "correct_answer": 2}]	5	3
2	2	[{"points": 1, "options": ["To keep money completely safe", "To grow wealth over time", "To avoid paying taxes", "To impress friends with financial knowledge"], "question": "What is the primary purpose of investing?", "correct_answer": 1}, {"points": 1, "options": ["Government bonds", "Savings accounts", "Blue-chip stocks", "Cryptocurrencies"], "question": "Which investment typically carries the highest risk?", "correct_answer": 3}, {"points": 1, "options": ["Maximize returns on a single stock", "Reduce overall portfolio risk", "Time the market perfectly", "Avoid all investment losses"], "question": "What does diversification aim to achieve?", "correct_answer": 1}, {"points": 1, "options": ["Eliminates all investment risk", "Guarantees above-market returns", "Reduces impact of market volatility", "Requires large upfront capital"], "question": "What is a key benefit of dollar-cost averaging?", "correct_answer": 2}, {"points": 1, "options": ["Market timing", "Day trading", "Dividend growth investing", "Short selling"], "question": "Which strategy focuses on reinvesting profits?", "correct_answer": 2}]	5	3
3	3	[{"points": 1, "options": ["100% - max it out!", "30% - the golden rule", "75% - shows you need credit", "0% - never use it"], "question": "What percentage of your credit limit should you ideally use?", "correct_answer": 1}, {"points": 1, "options": ["Checking your own score", "Missing a payment", "Having a student loan", "Using a debit card"], "question": "Which action hurts your credit score MOST?", "correct_answer": 1}, {"points": 1, "options": ["Pay minimum balance monthly", "Pay full balance monthly", "Use it only for emergencies", "Max it out then get another"], "question": "What's the smartest way to use a credit card?", "correct_answer": 1}, {"points": 1, "options": ["Snowball method", "Avalanche method", "Ostrich method (ignore it)", "YOLO method"], "question": "Which debt repayment method focuses on quick wins?", "correct_answer": 0}, {"points": 1, "options": ["Lower credit utilization", "Accumulating new debt", "Faster credit score improvement", "Higher interest rates"], "question": "What's the MAIN risk of debt consolidation?", "correct_answer": 1}]	5	3
4	4	[{"points": 1, "options": ["Buy now, worry later", "Use the 24-hour rule", "Only use credit cards", "Avoid friends who spend money"], "question": "What's the BEST way to handle FOMO spending?", "correct_answer": 1}, {"points": 1, "options": ["10%", "30%", "50%", "80%"], "question": "How much of your income should go to /wants/ like social outings?", "correct_answer": 1}, {"points": 1, "options": ["Leasing a car to look successful", "Saving R500/month for a future goal", "Buying drinks for everyone at the club", "Maxing out credit cards on sales"], "question": "What's a \\"Real Rich\\" habit?", "correct_answer": 1}, {"points": 1, "options": ["Encourages impulse buying", "Reduces buyer's remorse", "Increases social media usage", "Guarantees lowest prices"], "question": "What's the psychological benefit of the 24-hour rule?", "correct_answer": 1}, {"points": 1, "options": ["Premium cocktail lounge", "DIY gin tasting at home", "Beach picnic with friends", "Public hiking trails"], "question": "Which is NOT an effective budget-friendly alternative?", "correct_answer": 0}]	5	3
5	5	[{"points": 1, "options": ["Panic and withdraw all savings", "Get UIF forms signed by employer", "Buy lottery tickets", "Post about it on social media"], "question": "What's the FIRST thing to do after retrenchment?", "correct_answer": 1}, {"points": 1, "options": ["10-20%", "38-58%", "80-100%", "UIF doesn't pay retrenched workers"], "question": "How much of your salary can UIF cover?", "correct_answer": 1}, {"points": 1, "options": ["Selling old clothes online", "Freelancing on Fiverr", "Waiting for the perfect job", "Tutoring via Zoom"], "question": "Which is NOT a fast side hustle?", "correct_answer": 2}, {"points": 1, "options": ["Isolate yourself completely", "Schedule small daily wins", "Avoid discussing job loss", "Blame yourself constantly"], "question": "What's a key mental health strategy?", "correct_answer": 1}, {"points": 1, "options": ["Rent/mortgage", "Groceries", "Streaming subscriptions", "Medical insurance"], "question": "Which expense should be PAUSED first?", "correct_answer": 2}]	5	3
\.


--
-- Data for Name: recurring_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_transactions (recurring_id, transaction_id, frequency, next_occurrence, end_date, last_run, is_active, created_at) FROM stdin;
1	4	yearly	2025-03-14	2025-06-01	2025-02-12	t	2025-02-12 00:00:00
2	5	weekly	2025-06-20	2025-08-16	2025-05-21	t	2025-05-21 00:00:00
3	9	quarterly	2025-03-27	2025-07-31	2025-02-25	t	2025-02-25 00:00:00
4	15	biweekly	2025-02-15	2025-06-30	2025-01-16	t	2025-01-16 00:00:00
5	21	monthly	2025-03-18	2025-07-27	2025-02-16	t	2025-02-16 00:00:00
6	27	daily	2025-02-19	2025-04-16	2025-01-20	t	2025-01-20 00:00:00
7	77	daily	2025-03-23	2025-06-02	2025-02-21	t	2025-02-21 00:00:00
8	81	quarterly	2025-05-17	2025-10-02	2025-04-17	t	2025-04-17 00:00:00
9	110	quarterly	2025-05-18	2025-08-29	2025-04-18	t	2025-04-18 00:00:00
10	122	yearly	2025-04-04	2025-08-10	2025-03-05	t	2025-03-05 00:00:00
11	142	weekly	2025-06-06	2025-09-27	2025-05-07	t	2025-05-07 00:00:00
12	149	weekly	2025-03-03	2025-07-04	2025-02-01	t	2025-02-01 00:00:00
13	154	monthly	2025-03-22	2025-04-25	2025-02-20	t	2025-02-20 00:00:00
15	184	yearly	2025-05-22	2025-08-26	2025-04-22	t	2025-04-22 00:00:00
16	194	daily	2025-04-14	2025-08-29	2025-03-15	t	2025-03-15 00:00:00
18	211	quarterly	2025-03-16	2025-05-31	2025-02-14	t	2025-02-14 00:00:00
19	214	monthly	2025-07-05	2025-09-25	2025-06-05	t	2025-06-05 00:00:00
20	217	biweekly	2025-03-26	2025-06-26	2025-02-24	t	2025-02-24 00:00:00
21	221	daily	2025-03-31	2025-05-06	2025-03-01	t	2025-03-01 00:00:00
22	234	yearly	2025-05-14	2025-07-26	2025-04-14	t	2025-04-14 00:00:00
23	236	weekly	2025-05-21	2025-06-20	2025-04-21	t	2025-04-21 00:00:00
29	274	daily	2025-02-01	2025-05-01	2025-01-02	t	2025-01-02 00:00:00
30	275	biweekly	2025-02-16	2025-07-05	2025-01-17	t	2025-01-17 00:00:00
31	278	daily	2025-05-05	2025-07-23	2025-04-05	t	2025-04-05 00:00:00
32	286	quarterly	2025-04-26	2025-08-07	2025-03-27	t	2025-03-27 00:00:00
33	289	yearly	2025-06-25	2025-07-30	2025-05-26	t	2025-05-26 00:00:00
34	291	daily	2025-02-16	2025-04-28	2025-01-17	t	2025-01-17 00:00:00
35	308	daily	2025-07-01	2025-10-04	2025-06-01	t	2025-06-01 00:00:00
36	326	daily	2025-06-24	2025-11-13	2025-05-25	t	2025-05-25 00:00:00
37	334	weekly	2025-05-20	2025-06-28	2025-04-20	t	2025-04-20 00:00:00
38	340	biweekly	2025-02-23	2025-06-07	2025-01-24	t	2025-01-24 00:00:00
39	345	monthly	2025-02-23	2025-06-07	2025-01-24	t	2025-01-24 00:00:00
40	354	monthly	2025-05-18	2025-07-14	2025-04-18	t	2025-04-18 00:00:00
41	358	quarterly	2025-03-23	2025-04-26	2025-02-21	t	2025-02-21 00:00:00
42	381	biweekly	2025-06-10	2025-08-30	2025-05-11	t	2025-05-11 00:00:00
43	385	daily	2025-06-23	2025-08-20	2025-05-24	t	2025-05-24 00:00:00
44	410	yearly	2025-06-01	2025-07-09	2025-05-02	t	2025-05-02 00:00:00
45	411	daily	2025-04-27	2025-07-03	2025-03-28	t	2025-03-28 00:00:00
46	413	monthly	2025-07-02	2025-08-15	2025-06-02	t	2025-06-02 00:00:00
47	416	weekly	2025-06-26	2025-09-19	2025-05-27	t	2025-05-27 00:00:00
48	443	monthly	2025-07-13	2025-10-23	2025-06-13	t	2025-06-13 00:00:00
49	457	daily	2025-04-03	2025-06-14	2025-03-04	t	2025-03-04 00:00:00
50	472	quarterly	2025-04-09	2025-05-12	2025-03-10	t	2025-03-10 00:00:00
51	473	weekly	2025-02-11	2025-05-04	2025-01-12	t	2025-01-12 00:00:00
52	474	monthly	2025-05-24	2025-10-20	2025-04-24	t	2025-04-24 00:00:00
53	479	weekly	2025-06-23	2025-10-10	2025-05-24	t	2025-05-24 00:00:00
54	480	weekly	2025-04-20	2025-09-07	2025-03-21	t	2025-03-21 00:00:00
55	482	daily	2025-06-19	2025-09-18	2025-05-20	t	2025-05-20 00:00:00
56	516	monthly	2025-06-03	2025-10-07	2025-05-04	t	2025-05-04 00:00:00
57	524	monthly	2025-05-16	2025-10-05	2025-04-16	t	2025-04-16 00:00:00
58	545	daily	2025-07-12	2025-09-09	2025-06-12	t	2025-06-12 00:00:00
59	548	monthly	2025-03-19	2025-06-11	2025-02-17	t	2025-02-17 00:00:00
60	572	daily	2025-04-30	2025-06-13	2025-03-31	t	2025-03-31 00:00:00
61	582	monthly	2025-05-21	2025-10-13	2025-04-21	t	2025-04-21 00:00:00
62	590	biweekly	2025-06-16	2025-10-07	2025-05-17	t	2025-05-17 00:00:00
63	601	daily	2025-03-12	2025-05-30	2025-02-10	t	2025-02-10 00:00:00
64	608	yearly	2025-02-15	2025-04-08	2025-01-16	t	2025-01-16 00:00:00
65	627	weekly	2025-05-06	2025-06-07	2025-04-06	t	2025-04-06 00:00:00
66	630	biweekly	2025-03-19	2025-06-24	2025-02-17	t	2025-02-17 00:00:00
67	668	biweekly	2025-05-03	2025-09-27	2025-04-03	t	2025-04-03 00:00:00
68	707	weekly	2025-07-18	2025-12-08	2025-06-18	t	2025-06-18 00:00:00
69	711	weekly	2025-07-15	2025-10-23	2025-06-15	t	2025-06-15 00:00:00
70	715	yearly	2025-02-16	2025-03-26	2025-01-17	t	2025-01-17 00:00:00
71	724	biweekly	2025-06-16	2025-08-21	2025-05-17	t	2025-05-17 00:00:00
72	725	daily	2025-02-16	2025-06-10	2025-01-17	t	2025-01-17 00:00:00
73	728	monthly	2025-04-24	2025-08-18	2025-03-25	t	2025-03-25 00:00:00
74	747	monthly	2025-04-25	2025-06-02	2025-03-26	t	2025-03-26 00:00:00
75	750	monthly	2025-06-05	2025-10-25	2025-05-06	t	2025-05-06 00:00:00
76	755	monthly	2025-06-04	2025-08-08	2025-05-05	t	2025-05-05 00:00:00
77	768	weekly	2025-02-07	2025-06-16	2025-01-08	t	2025-01-08 00:00:00
78	775	quarterly	2025-04-02	2025-05-23	2025-03-03	t	2025-03-03 00:00:00
79	782	biweekly	2025-04-19	2025-08-29	2025-03-20	t	2025-03-20 00:00:00
80	814	yearly	2025-07-03	2025-09-24	2025-06-03	t	2025-06-03 00:00:00
81	829	biweekly	2025-03-03	2025-05-21	2025-02-01	t	2025-02-01 00:00:00
82	832	quarterly	2025-06-04	2025-07-05	2025-05-05	t	2025-05-05 00:00:00
83	849	biweekly	2025-05-27	2025-08-31	2025-04-27	t	2025-04-27 00:00:00
84	852	biweekly	2025-03-07	2025-06-06	2025-02-05	t	2025-02-05 00:00:00
85	861	daily	2025-03-20	2025-06-14	2025-02-18	t	2025-02-18 00:00:00
86	866	yearly	2025-05-16	2025-07-23	2025-04-16	t	2025-04-16 00:00:00
87	878	quarterly	2025-06-10	2025-09-19	2025-05-11	t	2025-05-11 00:00:00
88	883	daily	2025-02-22	2025-04-23	2025-01-23	t	2025-01-23 00:00:00
89	885	quarterly	2025-06-28	2025-09-04	2025-05-29	t	2025-05-29 00:00:00
90	886	monthly	2025-03-31	2025-07-01	2025-03-01	t	2025-03-01 00:00:00
91	894	daily	2025-05-08	2025-08-03	2025-04-08	t	2025-04-08 00:00:00
92	899	biweekly	2025-05-11	2025-09-11	2025-04-11	t	2025-04-11 00:00:00
93	907	weekly	2025-04-02	2025-05-08	2025-03-03	t	2025-03-03 00:00:00
94	916	monthly	2025-05-25	2025-09-08	2025-04-25	t	2025-04-25 00:00:00
95	942	yearly	2025-07-27	2025-10-22	2025-06-27	t	2025-06-27 00:00:00
96	954	quarterly	2025-06-23	2025-11-19	2025-05-24	t	2025-05-24 00:00:00
97	958	daily	2025-02-03	2025-04-30	2025-01-04	t	2025-01-04 00:00:00
98	963	daily	2025-06-18	2025-08-15	2025-05-19	t	2025-05-19 00:00:00
99	964	weekly	2025-04-15	2025-06-02	2025-03-16	t	2025-03-16 00:00:00
100	968	biweekly	2025-07-19	2025-08-19	2025-06-19	t	2025-06-19 00:00:00
101	974	biweekly	2025-06-28	2025-08-20	2025-05-29	t	2025-05-29 00:00:00
102	976	biweekly	2025-07-07	2025-08-06	2025-06-07	t	2025-06-07 00:00:00
103	994	weekly	2025-07-08	2025-11-16	2025-06-08	t	2025-06-08 00:00:00
104	999	daily	2025-04-07	2025-07-12	2025-03-08	t	2025-03-08 00:00:00
105	1006	weekly	2025-03-27	2025-06-25	2025-02-25	t	2025-02-25 00:00:00
106	1009	biweekly	2025-02-18	2025-04-04	2025-01-19	t	2025-01-19 00:00:00
107	1010	yearly	2025-03-22	2025-07-09	2025-02-20	t	2025-02-20 00:00:00
108	1032	quarterly	2025-03-27	2025-07-13	2025-02-25	t	2025-02-25 00:00:00
109	1034	weekly	2025-03-03	2025-05-08	2025-02-01	t	2025-02-01 00:00:00
110	1040	yearly	2025-03-21	2025-06-08	2025-02-19	t	2025-02-19 00:00:00
111	1045	biweekly	2025-06-30	2025-10-07	2025-05-31	t	2025-05-31 00:00:00
112	1054	monthly	2025-06-30	2025-10-03	2025-05-31	t	2025-05-31 00:00:00
113	1061	yearly	2025-06-06	2025-07-15	2025-05-07	t	2025-05-07 00:00:00
114	1064	daily	2025-04-08	2025-07-30	2025-03-09	t	2025-03-09 00:00:00
115	1077	quarterly	2025-02-18	2025-05-22	2025-01-19	t	2025-01-19 00:00:00
116	1091	daily	2025-02-09	2025-04-14	2025-01-10	t	2025-01-10 00:00:00
117	1104	weekly	2025-03-05	2025-05-02	2025-02-03	t	2025-02-03 00:00:00
118	1130	weekly	2025-07-03	2025-11-10	2025-06-03	t	2025-06-03 00:00:00
119	1138	daily	2025-05-16	2025-08-03	2025-04-16	t	2025-04-16 00:00:00
120	1156	yearly	2025-05-30	2025-08-05	2025-04-30	t	2025-04-30 00:00:00
121	1163	yearly	2025-04-16	2025-07-20	2025-03-17	t	2025-03-17 00:00:00
122	1171	daily	2025-02-13	2025-04-21	2025-01-14	t	2025-01-14 00:00:00
123	1176	yearly	2025-06-24	2025-08-04	2025-05-25	t	2025-05-25 00:00:00
124	1185	biweekly	2025-07-27	2025-11-13	2025-06-27	t	2025-06-27 00:00:00
125	1190	monthly	2025-04-23	2025-07-15	2025-03-24	t	2025-03-24 00:00:00
126	1225	monthly	2025-05-24	2025-08-17	2025-04-24	t	2025-04-24 00:00:00
127	1227	biweekly	2025-06-16	2025-09-03	2025-05-17	t	2025-05-17 00:00:00
128	1229	yearly	2025-04-07	2025-07-03	2025-03-08	t	2025-03-08 00:00:00
129	1237	biweekly	2025-07-07	2025-08-24	2025-06-07	t	2025-06-07 00:00:00
130	1243	monthly	2025-03-02	2025-06-18	2025-01-31	t	2025-01-31 00:00:00
131	1266	yearly	2025-02-19	2025-07-08	2025-01-20	t	2025-01-20 00:00:00
132	1281	quarterly	2025-05-09	2025-06-24	2025-04-09	t	2025-04-09 00:00:00
133	1296	daily	2025-04-15	2025-09-07	2025-03-16	t	2025-03-16 00:00:00
134	1306	daily	2025-06-08	2025-11-04	2025-05-09	t	2025-05-09 00:00:00
135	1308	monthly	2025-02-17	2025-05-03	2025-01-18	t	2025-01-18 00:00:00
136	1336	quarterly	2025-04-08	2025-07-20	2025-03-09	t	2025-03-09 00:00:00
137	1340	biweekly	2025-02-26	2025-04-08	2025-01-27	t	2025-01-27 00:00:00
138	1342	biweekly	2025-02-05	2025-05-23	2025-01-06	t	2025-01-06 00:00:00
139	1348	weekly	2025-04-25	2025-09-04	2025-03-26	t	2025-03-26 00:00:00
140	1349	quarterly	2025-02-02	2025-06-20	2025-01-03	t	2025-01-03 00:00:00
141	1350	quarterly	2025-06-30	2025-08-28	2025-05-31	t	2025-05-31 00:00:00
142	1359	quarterly	2025-07-18	2025-10-13	2025-06-18	t	2025-06-18 00:00:00
143	1385	quarterly	2025-02-03	2025-06-25	2025-01-04	t	2025-01-04 00:00:00
144	1386	daily	2025-02-14	2025-03-21	2025-01-15	t	2025-01-15 00:00:00
145	1393	weekly	2025-05-04	2025-06-04	2025-04-04	t	2025-04-04 00:00:00
146	1405	yearly	2025-04-07	2025-08-23	2025-03-08	t	2025-03-08 00:00:00
147	1435	daily	2025-07-22	2025-11-16	2025-06-22	t	2025-06-22 00:00:00
148	1439	yearly	2025-02-05	2025-05-01	2025-01-06	t	2025-01-06 00:00:00
149	1449	quarterly	2025-02-19	2025-05-14	2025-01-20	t	2025-01-20 00:00:00
150	1453	biweekly	2025-05-05	2025-06-17	2025-04-05	t	2025-04-05 00:00:00
151	1460	yearly	2025-02-18	2025-06-13	2025-01-19	t	2025-01-19 00:00:00
152	1465	monthly	2025-07-26	2025-11-22	2025-06-26	t	2025-06-26 00:00:00
153	1466	daily	2025-03-23	2025-06-26	2025-02-21	t	2025-02-21 00:00:00
154	1483	biweekly	2025-04-06	2025-06-30	2025-03-07	t	2025-03-07 00:00:00
155	1486	biweekly	2025-02-20	2025-06-27	2025-01-21	t	2025-01-21 00:00:00
158	1504	yearly	2025-05-28	2025-09-14	2025-04-28	t	2025-04-28 00:00:00
159	1515	biweekly	2025-06-01	2025-10-16	2025-05-02	t	2025-05-02 00:00:00
160	1519	quarterly	2025-02-09	2025-03-17	2025-01-10	t	2025-01-10 00:00:00
161	1521	biweekly	2025-06-05	2025-10-14	2025-05-06	t	2025-05-06 00:00:00
162	1530	quarterly	2025-03-16	2025-05-09	2025-02-14	t	2025-02-14 00:00:00
163	1536	yearly	2025-02-26	2025-07-09	2025-01-27	t	2025-01-27 00:00:00
164	1558	quarterly	2025-06-22	2025-09-13	2025-05-23	t	2025-05-23 00:00:00
165	1559	quarterly	2025-05-03	2025-08-05	2025-04-03	t	2025-04-03 00:00:00
166	1564	daily	2025-02-20	2025-05-13	2025-01-21	t	2025-01-21 00:00:00
167	1580	yearly	2025-07-01	2025-10-12	2025-06-01	t	2025-06-01 00:00:00
168	1583	weekly	2025-03-29	2025-05-17	2025-02-27	t	2025-02-27 00:00:00
169	1599	quarterly	2025-06-25	2025-08-11	2025-05-26	t	2025-05-26 00:00:00
170	1626	biweekly	2025-07-09	2025-10-14	2025-06-09	t	2025-06-09 00:00:00
171	1633	quarterly	2025-03-23	2025-06-16	2025-02-21	t	2025-02-21 00:00:00
172	1646	quarterly	2025-03-09	2025-05-18	2025-02-07	t	2025-02-07 00:00:00
173	1652	yearly	2025-07-16	2025-12-02	2025-06-16	t	2025-06-16 00:00:00
174	1657	biweekly	2025-03-18	2025-04-23	2025-02-16	t	2025-02-16 00:00:00
175	1678	biweekly	2025-04-23	2025-08-10	2025-03-24	t	2025-03-24 00:00:00
176	1684	biweekly	2025-03-07	2025-05-06	2025-02-05	t	2025-02-05 00:00:00
177	1698	biweekly	2025-06-27	2025-08-06	2025-05-28	t	2025-05-28 00:00:00
178	1727	yearly	2025-06-30	2025-11-18	2025-05-31	t	2025-05-31 00:00:00
179	1731	yearly	2025-07-20	2025-11-02	2025-06-20	t	2025-06-20 00:00:00
180	1742	quarterly	2025-05-03	2025-06-22	2025-04-03	t	2025-04-03 00:00:00
181	1746	biweekly	2025-05-16	2025-08-27	2025-04-16	t	2025-04-16 00:00:00
182	1750	daily	2025-07-10	2025-08-18	2025-06-10	t	2025-06-10 00:00:00
183	1755	quarterly	2025-02-18	2025-06-15	2025-01-19	t	2025-01-19 00:00:00
184	1758	weekly	2025-03-10	2025-06-22	2025-02-08	t	2025-02-08 00:00:00
185	1778	weekly	2025-06-06	2025-08-07	2025-05-07	t	2025-05-07 00:00:00
186	1803	quarterly	2025-04-26	2025-06-06	2025-03-27	t	2025-03-27 00:00:00
187	1806	yearly	2025-06-23	2025-07-29	2025-05-24	t	2025-05-24 00:00:00
188	1817	yearly	2025-05-25	2025-07-21	2025-04-25	t	2025-04-25 00:00:00
189	1820	yearly	2025-05-09	2025-10-04	2025-04-09	t	2025-04-09 00:00:00
190	1832	daily	2025-02-12	2025-04-01	2025-01-13	t	2025-01-13 00:00:00
191	1835	yearly	2025-03-29	2025-07-09	2025-02-27	t	2025-02-27 00:00:00
192	1841	quarterly	2025-07-21	2025-12-12	2025-06-21	t	2025-06-21 00:00:00
193	1844	yearly	2025-03-28	2025-07-14	2025-02-26	t	2025-02-26 00:00:00
194	1848	weekly	2025-04-13	2025-06-25	2025-03-14	t	2025-03-14 00:00:00
195	1849	biweekly	2025-06-06	2025-09-12	2025-05-07	t	2025-05-07 00:00:00
196	1850	weekly	2025-05-26	2025-07-04	2025-04-26	t	2025-04-26 00:00:00
197	1857	yearly	2025-04-14	2025-09-04	2025-03-15	t	2025-03-15 00:00:00
198	1859	biweekly	2025-02-07	2025-06-20	2025-01-08	t	2025-01-08 00:00:00
199	1861	quarterly	2025-02-15	2025-05-03	2025-01-16	t	2025-01-16 00:00:00
\.


--
-- Data for Name: social_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_posts (post_id, user_id, achievement_id, caption, created_at) FROM stdin;
1	1	21	Just unlocked a big one!	2025-08-19 14:47:35.75337
4	1	21	Testing	2025-09-13 21:08:52.839333
5	2	6	Washa	2025-09-13 23:01:25.47448
6	1	21	Test 6	2025-09-13 23:19:46.760599
7	1	21	Test 6	2025-09-13 23:19:48.17707
8	1	21	Test 3	2025-09-13 23:21:06.264835
9	1	21	Again	2025-09-13 23:44:20.844103
10	1	21	Again x2	2025-09-13 23:44:34.815444
11	1	21	qfe	2025-09-13 23:47:10.805167
12	1	21	gfw	2025-09-14 00:06:05.044869
13	1	21	gfw	2025-09-14 00:06:06.760316
14	1	21	a	2025-09-14 00:33:57.801588
15	1	21	a	2025-09-14 00:33:59.270706
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (transaction_id, account_id, category_id, custom_category_id, budget_id, transaction_amount, transaction_type, transaction_date, transaction_name, is_recurring, linked_goal_id, linked_challenge_id, points_awarded, created_at) FROM stdin;
1	1	\N	5	\N	1233.87	fee	2025-06-25 00:00:00	Monthly Account Fee	f	13	\N	12	2025-06-25 00:00:00
2	1	22	\N	\N	1951.90	income	2025-06-20 00:00:00	Dividend Payment	f	6	\N	46	2025-06-20 00:00:00
3	1	\N	2	\N	595.99	deposit	2025-02-02 00:00:00	Online Deposit	f	14	\N	11	2025-02-02 00:00:00
4	1	\N	12	7	1410.56	fee	2025-02-12 00:00:00	ATM Withdrawal Fee	t	\N	5	1	2025-02-12 00:00:00
5	1	42	\N	5	271.46	fee	2025-05-21 00:00:00	Monthly Account Fee	t	10	\N	45	2025-05-21 00:00:00
6	1	18	\N	\N	4945.37	transfer	2025-05-28 00:00:00	Transfer to Savings	f	\N	\N	43	2025-05-28 00:00:00
7	1	50	\N	3	3550.73	expense	2025-03-11 00:00:00	Streaming Subscription	f	\N	\N	3	2025-03-11 00:00:00
8	1	49	\N	\N	3337.78	transfer	2025-06-01 00:00:00	Transfer to Savings	f	\N	\N	0	2025-06-01 00:00:00
9	1	44	\N	4	3923.30	withdrawal	2025-02-25 00:00:00	Cash Removed from Account	t	15	\N	10	2025-02-25 00:00:00
10	1	7	\N	6	1446.74	transfer	2025-03-17 00:00:00	Transfer from Checking	f	\N	5	17	2025-03-17 00:00:00
11	1	4	\N	\N	4619.04	deposit	2025-04-16 00:00:00	Cash Deposit at Branch	f	\N	2	28	2025-04-16 00:00:00
12	1	\N	13	\N	1904.23	income	2025-02-12 00:00:00	Dividend Payment	f	\N	\N	50	2025-02-12 00:00:00
13	1	39	\N	1	1629.77	income	2025-01-01 00:00:00	Refund Processed	f	\N	\N	38	2025-01-01 00:00:00
14	1	17	\N	7	3213.51	deposit	2025-04-04 00:00:00	Cash Deposit at Branch	f	\N	\N	21	2025-04-04 00:00:00
15	1	5	\N	\N	1740.31	fee	2025-01-16 00:00:00	Monthly Account Fee	t	\N	\N	6	2025-01-16 00:00:00
16	1	\N	13	\N	793.02	fee	2025-05-18 00:00:00	ATM Withdrawal Fee	f	\N	\N	43	2025-05-18 00:00:00
17	1	\N	13	\N	2840.83	withdrawal	2025-06-28 00:00:00	ATM Cash Withdrawal	f	\N	\N	33	2025-06-28 00:00:00
18	1	37	\N	3	3351.18	fee	2025-02-04 00:00:00	ATM Withdrawal Fee	f	\N	\N	31	2025-02-04 00:00:00
19	1	37	\N	\N	4232.45	fee	2025-04-27 00:00:00	Monthly Account Fee	f	19	\N	31	2025-04-27 00:00:00
20	1	\N	12	6	172.46	withdrawal	2025-03-01 00:00:00	Cash Removed from Account	f	\N	\N	30	2025-03-01 00:00:00
21	1	\N	9	8	1485.23	income	2025-02-16 00:00:00	Dividend Payment	t	\N	\N	25	2025-02-16 00:00:00
22	1	40	\N	5	1105.86	transfer	2025-03-20 00:00:00	Transfer to Savings	f	\N	5	22	2025-03-20 00:00:00
23	1	\N	3	\N	4152.17	deposit	2025-06-28 00:00:00	Cash Deposit at Branch	f	\N	5	9	2025-06-28 00:00:00
24	1	\N	3	\N	509.97	expense	2025-06-17 00:00:00	Coffee Shop	f	\N	3	33	2025-06-17 00:00:00
25	1	\N	4	3	1401.00	expense	2025-06-24 00:00:00	Clothing Store Purchase	f	5	2	44	2025-06-24 00:00:00
26	1	22	\N	\N	1066.42	expense	2025-01-17 00:00:00	Clothing Store Purchase	f	\N	2	22	2025-01-17 00:00:00
27	1	30	\N	\N	1176.80	deposit	2025-01-20 00:00:00	Cash Deposit at Branch	t	1	4	31	2025-01-20 00:00:00
28	1	\N	1	\N	2350.00	withdrawal	2025-06-26 00:00:00	Cash Removed from Account	f	\N	\N	32	2025-06-26 00:00:00
29	1	47	\N	\N	148.29	deposit	2025-05-14 00:00:00	Online Deposit	f	\N	\N	45	2025-05-14 00:00:00
30	1	1	\N	4	1120.48	fee	2025-04-20 00:00:00	Monthly Account Fee	f	\N	\N	6	2025-04-20 00:00:00
31	1	10	\N	4	3139.48	expense	2025-01-25 00:00:00	Grocery Store Purchase	f	\N	2	41	2025-01-25 00:00:00
32	1	39	\N	8	4692.50	withdrawal	2025-02-04 00:00:00	ATM Cash Withdrawal	f	\N	3	38	2025-02-04 00:00:00
33	1	22	\N	8	1009.28	transfer	2025-06-28 00:00:00	Bank Internal Transfer	f	\N	\N	45	2025-06-28 00:00:00
34	1	\N	6	\N	712.89	withdrawal	2025-05-04 00:00:00	Cash Removed from Account	f	\N	\N	3	2025-05-04 00:00:00
35	1	25	\N	7	4332.06	income	2025-02-28 00:00:00	Dividend Payment	f	20	\N	38	2025-02-28 00:00:00
36	1	2	\N	\N	4871.62	expense	2025-02-19 00:00:00	Restaurant Dinner	f	\N	\N	27	2025-02-19 00:00:00
37	1	4	\N	\N	241.11	deposit	2025-03-09 00:00:00	Online Deposit	f	3	\N	44	2025-03-09 00:00:00
38	1	51	\N	4	4966.87	deposit	2025-02-06 00:00:00	Cash Deposit at Branch	f	9	\N	11	2025-02-06 00:00:00
39	1	\N	10	\N	3983.97	fee	2025-05-17 00:00:00	ATM Withdrawal Fee	f	\N	3	14	2025-05-17 00:00:00
40	1	\N	13	\N	3586.61	deposit	2025-03-29 00:00:00	Online Deposit	f	\N	\N	12	2025-03-29 00:00:00
41	1	33	\N	6	4711.96	deposit	2025-05-01 00:00:00	Cash Deposit at Branch	f	\N	\N	48	2025-05-01 00:00:00
42	1	19	\N	\N	863.34	expense	2025-03-05 00:00:00	Mobile Data Recharge	f	\N	\N	49	2025-03-05 00:00:00
43	1	39	\N	\N	969.38	fee	2025-02-05 00:00:00	Service Charge	f	\N	\N	32	2025-02-05 00:00:00
44	1	33	\N	2	2969.26	expense	2025-01-29 00:00:00	Utility Bill Payment	f	\N	\N	35	2025-01-29 00:00:00
45	1	\N	12	\N	4697.38	withdrawal	2025-05-31 00:00:00	Cash Removed from Account	f	\N	\N	28	2025-05-31 00:00:00
46	1	11	\N	3	1522.41	fee	2025-05-21 00:00:00	ATM Withdrawal Fee	f	\N	\N	15	2025-05-21 00:00:00
47	1	\N	10	\N	814.63	withdrawal	2025-05-23 00:00:00	Cash Removed from Account	f	\N	\N	49	2025-05-23 00:00:00
48	1	11	\N	8	3468.19	expense	2025-03-20 00:00:00	Clothing Store Purchase	f	\N	\N	29	2025-03-20 00:00:00
49	1	\N	10	\N	4574.42	income	2025-04-25 00:00:00	Bonus Received	f	\N	2	1	2025-04-25 00:00:00
50	1	45	\N	6	868.09	fee	2025-05-28 00:00:00	ATM Withdrawal Fee	f	\N	1	16	2025-05-28 00:00:00
51	1	22	\N	6	3322.95	income	2025-01-20 00:00:00	Salary Payment	f	22	\N	49	2025-01-20 00:00:00
52	1	47	\N	9	1788.65	transfer	2025-02-05 00:00:00	Transfer from Checking	f	\N	\N	3	2025-02-05 00:00:00
53	1	33	\N	5	4700.03	income	2025-03-13 00:00:00	Freelance Project Payment	f	\N	\N	26	2025-03-13 00:00:00
54	1	\N	11	\N	3116.74	expense	2025-01-13 00:00:00	Fuel Station	f	23	\N	13	2025-01-13 00:00:00
55	1	1	\N	4	2658.77	transfer	2025-06-07 00:00:00	Bank Internal Transfer	f	23	\N	14	2025-06-07 00:00:00
56	1	41	\N	\N	2491.13	income	2025-01-31 00:00:00	Bonus Received	f	\N	\N	29	2025-01-31 00:00:00
57	1	\N	2	8	1805.36	expense	2025-04-26 00:00:00	Streaming Subscription	f	\N	\N	10	2025-04-26 00:00:00
58	1	\N	1	4	56.02	deposit	2025-05-10 00:00:00	Cash Deposit at Branch	f	7	\N	24	2025-05-10 00:00:00
59	1	\N	11	8	2825.30	deposit	2025-03-26 00:00:00	Cheque Deposit	f	\N	5	25	2025-03-26 00:00:00
60	1	47	\N	\N	1649.17	transfer	2025-04-10 00:00:00	Transfer to Savings	f	\N	\N	33	2025-04-10 00:00:00
61	1	45	\N	\N	2873.97	transfer	2025-05-03 00:00:00	Transfer from Checking	f	16	\N	9	2025-05-03 00:00:00
62	1	\N	12	\N	1261.70	deposit	2025-01-15 00:00:00	Online Deposit	f	\N	\N	12	2025-01-15 00:00:00
63	1	\N	9	\N	3405.88	deposit	2025-05-17 00:00:00	Cash Deposit at Branch	f	\N	\N	34	2025-05-17 00:00:00
64	1	27	\N	9	1622.13	withdrawal	2025-05-02 00:00:00	ATM Cash Withdrawal	f	\N	\N	26	2025-05-02 00:00:00
65	1	24	\N	\N	1012.10	income	2025-06-30 00:00:00	Salary Payment	f	\N	\N	12	2025-06-30 00:00:00
66	1	\N	2	6	1658.38	expense	2025-02-23 00:00:00	Restaurant Dinner	f	\N	\N	37	2025-02-23 00:00:00
67	1	6	\N	\N	3654.11	deposit	2025-04-23 00:00:00	Online Deposit	f	17	2	35	2025-04-23 00:00:00
68	2	1	\N	\N	4873.43	fee	2025-04-19 00:00:00	Monthly Account Fee	f	\N	1	17	2025-04-19 00:00:00
69	2	41	\N	\N	834.25	withdrawal	2025-05-10 00:00:00	Cash Removed from Account	f	\N	\N	41	2025-05-10 00:00:00
70	2	31	\N	\N	1754.43	transfer	2025-05-04 00:00:00	Transfer to Savings	f	\N	\N	40	2025-05-04 00:00:00
71	2	37	\N	6	3564.65	income	2025-05-24 00:00:00	Freelance Project Payment	f	\N	2	0	2025-05-24 00:00:00
72	2	32	\N	\N	3319.49	withdrawal	2025-02-18 00:00:00	ATM Cash Withdrawal	f	4	\N	20	2025-02-18 00:00:00
73	2	5	\N	\N	2938.44	expense	2025-01-15 00:00:00	Grocery Store Purchase	f	22	\N	20	2025-01-15 00:00:00
74	2	\N	12	2	1520.67	income	2025-06-18 00:00:00	Refund Processed	f	3	\N	24	2025-06-18 00:00:00
75	2	\N	2	4	3034.28	transfer	2025-03-07 00:00:00	Transfer to Savings	f	\N	\N	12	2025-03-07 00:00:00
76	2	22	\N	3	3360.71	fee	2025-05-10 00:00:00	ATM Withdrawal Fee	f	\N	\N	9	2025-05-10 00:00:00
77	2	48	\N	\N	823.20	transfer	2025-02-21 00:00:00	Transfer to Savings	t	12	\N	14	2025-02-21 00:00:00
78	2	24	\N	7	2210.88	transfer	2025-05-27 00:00:00	Transfer to Savings	f	12	\N	14	2025-05-27 00:00:00
79	2	\N	6	7	4383.99	withdrawal	2025-04-13 00:00:00	ATM Cash Withdrawal	f	6	\N	35	2025-04-13 00:00:00
80	2	\N	1	\N	1461.63	income	2025-05-22 00:00:00	Dividend Payment	f	\N	2	7	2025-05-22 00:00:00
81	2	\N	2	4	3453.80	withdrawal	2025-04-17 00:00:00	Cash Removed from Account	t	21	\N	38	2025-04-17 00:00:00
82	2	48	\N	\N	4301.30	transfer	2025-06-08 00:00:00	Bank Internal Transfer	f	\N	\N	37	2025-06-08 00:00:00
83	2	9	\N	\N	648.51	withdrawal	2025-03-25 00:00:00	Cash Removed from Account	f	\N	\N	44	2025-03-25 00:00:00
84	2	2	\N	\N	2626.00	deposit	2025-06-30 00:00:00	Cheque Deposit	f	\N	3	15	2025-06-30 00:00:00
85	2	34	\N	\N	3208.38	expense	2025-04-26 00:00:00	Grocery Store Purchase	f	\N	\N	34	2025-04-26 00:00:00
86	2	26	\N	9	4520.95	expense	2025-05-18 00:00:00	Restaurant Dinner	f	\N	\N	5	2025-05-18 00:00:00
87	2	48	\N	\N	1613.05	fee	2025-02-11 00:00:00	Monthly Account Fee	f	16	4	29	2025-02-11 00:00:00
88	2	23	\N	\N	3182.86	transfer	2025-02-27 00:00:00	Transfer to Savings	f	23	\N	24	2025-02-27 00:00:00
89	2	\N	4	\N	2175.04	income	2025-03-04 00:00:00	Freelance Project Payment	f	\N	\N	29	2025-03-04 00:00:00
90	2	\N	9	\N	4789.97	expense	2025-01-20 00:00:00	Monthly Rent Payment	f	\N	\N	8	2025-01-20 00:00:00
91	2	43	\N	\N	159.55	deposit	2025-06-19 00:00:00	Cheque Deposit	f	\N	\N	47	2025-06-19 00:00:00
92	2	40	\N	3	2454.25	fee	2025-06-12 00:00:00	ATM Withdrawal Fee	f	5	\N	37	2025-06-12 00:00:00
93	2	\N	2	5	1619.47	deposit	2025-03-23 00:00:00	Cheque Deposit	f	\N	\N	23	2025-03-23 00:00:00
94	2	27	\N	\N	2658.09	deposit	2025-06-16 00:00:00	Online Deposit	f	\N	\N	39	2025-06-16 00:00:00
95	2	\N	8	\N	165.47	expense	2025-03-15 00:00:00	Grocery Store Purchase	f	\N	2	15	2025-03-15 00:00:00
96	2	\N	3	2	3870.75	income	2025-02-22 00:00:00	Refund Processed	f	\N	\N	27	2025-02-22 00:00:00
97	2	47	\N	\N	1900.92	transfer	2025-01-07 00:00:00	Transfer from Checking	f	\N	\N	29	2025-01-07 00:00:00
98	2	\N	10	5	1617.46	transfer	2025-06-26 00:00:00	Transfer to Savings	f	\N	\N	25	2025-06-26 00:00:00
99	2	40	\N	4	3601.48	deposit	2025-01-31 00:00:00	Online Deposit	f	19	3	13	2025-01-31 00:00:00
100	2	\N	2	4	2243.25	expense	2025-05-28 00:00:00	Coffee Shop	f	22	\N	23	2025-05-28 00:00:00
101	2	\N	13	\N	1278.78	expense	2025-06-01 00:00:00	Monthly Rent Payment	f	\N	4	10	2025-06-01 00:00:00
102	2	49	\N	\N	115.03	expense	2025-05-08 00:00:00	Restaurant Dinner	f	20	\N	26	2025-05-08 00:00:00
103	2	38	\N	\N	4364.28	expense	2025-06-12 00:00:00	Mobile Data Recharge	f	19	1	4	2025-06-12 00:00:00
104	2	10	\N	7	1540.41	transfer	2025-03-08 00:00:00	Bank Internal Transfer	f	10	\N	30	2025-03-08 00:00:00
105	2	\N	5	7	4387.44	income	2025-02-27 00:00:00	Salary Payment	f	\N	\N	19	2025-02-27 00:00:00
106	2	30	\N	4	3176.52	income	2025-01-19 00:00:00	Dividend Payment	f	1	\N	48	2025-01-19 00:00:00
107	2	\N	3	9	3745.38	withdrawal	2025-03-02 00:00:00	Cash Removed from Account	f	\N	3	44	2025-03-02 00:00:00
108	3	\N	1	1	2783.42	deposit	2025-06-18 00:00:00	Cash Deposit at Branch	f	9	\N	5	2025-06-18 00:00:00
109	3	34	\N	\N	4992.67	withdrawal	2025-06-01 00:00:00	Cash Removed from Account	f	\N	\N	44	2025-06-01 00:00:00
110	3	\N	7	\N	4011.99	income	2025-04-18 00:00:00	Salary Payment	t	\N	\N	49	2025-04-18 00:00:00
111	3	44	\N	\N	2915.01	expense	2025-06-01 00:00:00	Monthly Rent Payment	f	\N	\N	38	2025-06-01 00:00:00
112	3	7	\N	2	1770.46	income	2025-03-17 00:00:00	Bonus Received	f	\N	5	37	2025-03-17 00:00:00
113	3	\N	3	\N	3605.29	transfer	2025-05-01 00:00:00	Bank Internal Transfer	f	\N	\N	11	2025-05-01 00:00:00
114	3	9	\N	\N	4559.68	transfer	2025-03-13 00:00:00	Transfer to Savings	f	\N	\N	45	2025-03-13 00:00:00
115	3	38	\N	\N	4250.05	transfer	2025-04-11 00:00:00	Transfer to Savings	f	\N	\N	29	2025-04-11 00:00:00
116	3	\N	12	\N	969.54	transfer	2025-05-14 00:00:00	Transfer to Savings	f	\N	\N	16	2025-05-14 00:00:00
117	3	35	\N	\N	2947.12	expense	2025-06-08 00:00:00	Utility Bill Payment	f	\N	\N	28	2025-06-08 00:00:00
118	3	51	\N	\N	2810.26	income	2025-03-22 00:00:00	Refund Processed	f	\N	\N	30	2025-03-22 00:00:00
119	3	\N	8	\N	1269.76	withdrawal	2025-02-01 00:00:00	Cash Removed from Account	f	\N	3	29	2025-02-01 00:00:00
120	3	\N	6	9	389.80	fee	2025-01-18 00:00:00	Monthly Account Fee	f	\N	\N	12	2025-01-18 00:00:00
121	3	41	\N	\N	4607.91	fee	2025-05-20 00:00:00	Monthly Account Fee	f	\N	\N	1	2025-05-20 00:00:00
122	3	21	\N	\N	2921.51	expense	2025-03-05 00:00:00	Restaurant Dinner	t	\N	\N	50	2025-03-05 00:00:00
123	3	40	\N	8	1287.03	withdrawal	2025-04-24 00:00:00	ATM Cash Withdrawal	f	\N	2	43	2025-04-24 00:00:00
124	3	19	\N	\N	3761.45	deposit	2025-03-21 00:00:00	Cheque Deposit	f	12	4	4	2025-03-21 00:00:00
125	3	48	\N	7	1501.59	withdrawal	2025-04-05 00:00:00	Cash Removed from Account	f	\N	\N	45	2025-04-05 00:00:00
126	3	\N	3	\N	4104.57	transfer	2025-03-05 00:00:00	Bank Internal Transfer	f	23	\N	19	2025-03-05 00:00:00
127	3	\N	12	1	3543.46	fee	2025-04-15 00:00:00	ATM Withdrawal Fee	f	\N	\N	31	2025-04-15 00:00:00
128	3	24	\N	1	1336.88	transfer	2025-05-21 00:00:00	Bank Internal Transfer	f	\N	5	14	2025-05-21 00:00:00
129	3	\N	2	\N	3524.22	fee	2025-04-23 00:00:00	Service Charge	f	\N	\N	28	2025-04-23 00:00:00
130	3	24	\N	8	4270.43	fee	2025-03-22 00:00:00	Monthly Account Fee	f	\N	\N	12	2025-03-22 00:00:00
131	3	\N	8	5	43.03	withdrawal	2025-04-30 00:00:00	Cash Removed from Account	f	\N	\N	14	2025-04-30 00:00:00
132	3	\N	5	\N	3200.87	deposit	2025-04-14 00:00:00	Cash Deposit at Branch	f	\N	\N	46	2025-04-14 00:00:00
133	3	\N	7	8	3425.03	deposit	2025-02-03 00:00:00	Online Deposit	f	2	\N	9	2025-02-03 00:00:00
134	3	\N	4	\N	4856.97	withdrawal	2025-01-14 00:00:00	Cash Removed from Account	f	\N	\N	1	2025-01-14 00:00:00
135	3	47	\N	\N	165.71	withdrawal	2025-01-26 00:00:00	Cash Removed from Account	f	14	\N	1	2025-01-26 00:00:00
136	3	45	\N	\N	3405.61	deposit	2025-04-23 00:00:00	Online Deposit	f	\N	3	26	2025-04-23 00:00:00
137	3	19	\N	3	2909.87	income	2025-03-22 00:00:00	Freelance Project Payment	f	16	\N	39	2025-03-22 00:00:00
138	3	\N	3	\N	3323.22	transfer	2025-02-14 00:00:00	Bank Internal Transfer	f	\N	\N	36	2025-02-14 00:00:00
139	3	46	\N	\N	4880.56	income	2025-03-22 00:00:00	Refund Processed	f	\N	5	6	2025-03-22 00:00:00
140	3	10	\N	\N	2240.61	fee	2025-01-23 00:00:00	Monthly Account Fee	f	\N	\N	20	2025-01-23 00:00:00
141	3	38	\N	7	4234.30	income	2025-03-26 00:00:00	Interest Income	f	11	\N	36	2025-03-26 00:00:00
712	13	\N	1	\N	29.47	fee	2025-05-03 00:00:00	Service Charge	f	\N	\N	2	2025-05-03 00:00:00
142	3	\N	6	1	374.16	transfer	2025-05-07 00:00:00	Transfer from Checking	t	\N	\N	0	2025-05-07 00:00:00
143	3	\N	10	\N	703.91	income	2025-02-09 00:00:00	Salary Payment	f	18	2	29	2025-02-09 00:00:00
144	3	\N	13	\N	167.82	deposit	2025-04-18 00:00:00	Online Deposit	f	5	5	5	2025-04-18 00:00:00
145	3	32	\N	3	922.72	withdrawal	2025-05-03 00:00:00	ATM Cash Withdrawal	f	12	\N	21	2025-05-03 00:00:00
146	3	22	\N	7	3624.52	fee	2025-01-11 00:00:00	ATM Withdrawal Fee	f	\N	\N	18	2025-01-11 00:00:00
147	3	4	\N	9	1486.36	withdrawal	2025-01-23 00:00:00	Cash Removed from Account	f	\N	\N	49	2025-01-23 00:00:00
148	3	36	\N	\N	2245.90	deposit	2025-05-10 00:00:00	Cash Deposit at Branch	f	19	5	27	2025-05-10 00:00:00
149	3	36	\N	9	727.60	fee	2025-02-01 00:00:00	ATM Withdrawal Fee	t	\N	\N	31	2025-02-01 00:00:00
150	3	39	\N	9	2384.38	deposit	2025-01-02 00:00:00	Cheque Deposit	f	\N	\N	12	2025-01-02 00:00:00
151	3	42	\N	\N	1908.27	expense	2025-04-29 00:00:00	Mobile Data Recharge	f	5	\N	32	2025-04-29 00:00:00
152	3	42	\N	6	3381.70	fee	2025-04-13 00:00:00	ATM Withdrawal Fee	f	\N	1	7	2025-04-13 00:00:00
153	3	31	\N	6	4220.83	income	2025-05-13 00:00:00	Refund Processed	f	22	\N	33	2025-05-13 00:00:00
154	3	16	\N	\N	4228.99	deposit	2025-02-20 00:00:00	Cheque Deposit	t	\N	\N	11	2025-02-20 00:00:00
155	3	\N	7	1	709.63	income	2025-01-06 00:00:00	Freelance Project Payment	f	\N	\N	2	2025-01-06 00:00:00
156	3	\N	2	8	2194.74	income	2025-02-23 00:00:00	Freelance Project Payment	f	14	\N	7	2025-02-23 00:00:00
157	3	31	\N	\N	4610.54	deposit	2025-05-20 00:00:00	Cash Deposit at Branch	f	\N	\N	42	2025-05-20 00:00:00
158	3	5	\N	\N	2328.36	transfer	2025-06-29 00:00:00	Bank Internal Transfer	f	23	\N	0	2025-06-29 00:00:00
159	3	17	\N	5	1962.64	income	2025-04-06 00:00:00	Freelance Project Payment	f	\N	\N	7	2025-04-06 00:00:00
160	3	30	\N	2	1504.46	income	2025-01-05 00:00:00	Refund Processed	f	18	\N	44	2025-01-05 00:00:00
161	3	11	\N	1	3868.12	income	2025-04-01 00:00:00	Refund Processed	f	\N	\N	3	2025-04-01 00:00:00
162	3	40	\N	\N	4397.85	transfer	2025-01-04 00:00:00	Bank Internal Transfer	f	\N	\N	46	2025-01-04 00:00:00
163	3	32	\N	6	1871.60	deposit	2025-04-19 00:00:00	Cheque Deposit	f	1	\N	33	2025-04-19 00:00:00
164	3	9	\N	7	3385.40	fee	2025-02-21 00:00:00	Service Charge	f	\N	\N	3	2025-02-21 00:00:00
165	3	33	\N	3	4951.81	fee	2025-05-12 00:00:00	ATM Withdrawal Fee	f	6	\N	48	2025-05-12 00:00:00
166	3	21	\N	6	2142.81	withdrawal	2025-02-14 00:00:00	ATM Cash Withdrawal	f	7	\N	22	2025-02-14 00:00:00
167	3	\N	6	8	1421.51	fee	2025-03-23 00:00:00	Monthly Account Fee	f	9	\N	3	2025-03-23 00:00:00
168	3	37	\N	\N	3715.17	withdrawal	2025-04-01 00:00:00	Cash Removed from Account	f	\N	\N	13	2025-04-01 00:00:00
169	3	\N	5	1	4246.37	withdrawal	2025-03-26 00:00:00	Cash Removed from Account	f	\N	\N	3	2025-03-26 00:00:00
170	3	43	\N	3	3468.86	deposit	2025-01-18 00:00:00	Cheque Deposit	f	2	\N	40	2025-01-18 00:00:00
171	3	\N	7	9	2624.62	income	2025-06-16 00:00:00	Salary Payment	f	\N	\N	33	2025-06-16 00:00:00
172	3	\N	12	3	2254.01	expense	2025-06-01 00:00:00	Mobile Data Recharge	f	9	\N	8	2025-06-01 00:00:00
173	3	5	\N	\N	1320.66	fee	2025-06-19 00:00:00	ATM Withdrawal Fee	f	\N	\N	23	2025-06-19 00:00:00
174	3	\N	12	5	4086.15	income	2025-02-14 00:00:00	Freelance Project Payment	f	\N	\N	46	2025-02-14 00:00:00
175	4	\N	11	\N	3893.61	transfer	2025-03-21 00:00:00	Transfer from Checking	f	4	\N	48	2025-03-21 00:00:00
177	4	22	\N	4	300.66	fee	2025-01-11 00:00:00	ATM Withdrawal Fee	f	\N	\N	23	2025-01-11 00:00:00
178	4	17	\N	7	3606.82	transfer	2025-01-07 00:00:00	Bank Internal Transfer	f	12	\N	31	2025-01-07 00:00:00
179	4	24	\N	1	2968.08	expense	2025-03-13 00:00:00	Clothing Store Purchase	f	15	\N	31	2025-03-13 00:00:00
180	4	2	\N	\N	3858.49	fee	2025-02-12 00:00:00	Monthly Account Fee	f	\N	\N	36	2025-02-12 00:00:00
181	4	\N	6	\N	3035.81	income	2025-05-02 00:00:00	Bonus Received	f	\N	\N	48	2025-05-02 00:00:00
183	4	\N	3	6	38.00	transfer	2025-03-31 00:00:00	Transfer from Checking	f	21	\N	5	2025-03-31 00:00:00
184	4	28	\N	5	4225.69	expense	2025-04-22 00:00:00	Mobile Data Recharge	t	\N	\N	31	2025-04-22 00:00:00
185	4	\N	1	\N	2594.93	withdrawal	2025-03-01 00:00:00	ATM Cash Withdrawal	f	7	\N	33	2025-03-01 00:00:00
186	4	\N	13	\N	3898.15	expense	2025-06-12 00:00:00	Coffee Shop	f	\N	\N	37	2025-06-12 00:00:00
187	4	\N	12	\N	192.08	deposit	2025-06-20 00:00:00	Cheque Deposit	f	5	\N	50	2025-06-20 00:00:00
188	4	40	\N	\N	997.90	income	2025-04-26 00:00:00	Interest Income	f	\N	\N	39	2025-04-26 00:00:00
189	4	43	\N	\N	1370.26	expense	2025-02-22 00:00:00	Streaming Subscription	f	\N	\N	2	2025-02-22 00:00:00
190	4	30	\N	\N	2167.30	transfer	2025-04-14 00:00:00	Bank Internal Transfer	f	\N	\N	4	2025-04-14 00:00:00
191	4	42	\N	2	2256.58	income	2025-01-05 00:00:00	Salary Payment	f	\N	\N	25	2025-01-05 00:00:00
192	4	34	\N	5	1816.02	expense	2025-06-09 00:00:00	Grocery Store Purchase	f	\N	\N	42	2025-06-09 00:00:00
193	4	\N	4	9	1974.48	income	2025-03-14 00:00:00	Bonus Received	f	19	\N	27	2025-03-14 00:00:00
194	4	\N	7	\N	1591.15	withdrawal	2025-03-15 00:00:00	ATM Cash Withdrawal	t	9	\N	2	2025-03-15 00:00:00
195	4	28	\N	\N	2053.20	transfer	2025-04-03 00:00:00	Bank Internal Transfer	f	\N	\N	45	2025-04-03 00:00:00
196	4	8	\N	\N	3947.42	transfer	2025-05-14 00:00:00	Transfer from Checking	f	\N	\N	17	2025-05-14 00:00:00
197	4	47	\N	\N	3834.22	deposit	2025-03-31 00:00:00	Online Deposit	f	22	\N	50	2025-03-31 00:00:00
198	4	2	\N	\N	2725.75	deposit	2025-03-22 00:00:00	Cheque Deposit	f	12	3	28	2025-03-22 00:00:00
199	4	\N	1	6	684.94	income	2025-05-31 00:00:00	Salary Payment	f	\N	\N	46	2025-05-31 00:00:00
200	4	8	\N	4	2754.44	income	2025-03-24 00:00:00	Freelance Project Payment	f	\N	3	5	2025-03-24 00:00:00
201	4	50	\N	\N	2346.27	fee	2025-02-11 00:00:00	ATM Withdrawal Fee	f	9	\N	15	2025-02-11 00:00:00
202	4	3	\N	\N	3219.53	deposit	2025-03-24 00:00:00	Cash Deposit at Branch	f	6	\N	2	2025-03-24 00:00:00
203	4	30	\N	\N	209.91	income	2025-06-04 00:00:00	Freelance Project Payment	f	\N	\N	25	2025-06-04 00:00:00
204	4	36	\N	\N	4985.55	transfer	2025-05-21 00:00:00	Transfer from Checking	f	\N	\N	36	2025-05-21 00:00:00
205	4	\N	1	\N	4387.53	expense	2025-05-13 00:00:00	Restaurant Dinner	f	\N	\N	5	2025-05-13 00:00:00
206	4	19	\N	2	2027.55	deposit	2025-02-08 00:00:00	Cash Deposit at Branch	f	\N	\N	10	2025-02-08 00:00:00
207	4	44	\N	5	112.85	transfer	2025-06-10 00:00:00	Transfer from Checking	f	\N	\N	23	2025-06-10 00:00:00
208	4	47	\N	1	1722.14	deposit	2025-05-14 00:00:00	Cash Deposit at Branch	f	\N	\N	28	2025-05-14 00:00:00
209	4	18	\N	6	3348.47	income	2025-02-26 00:00:00	Freelance Project Payment	f	\N	\N	31	2025-02-26 00:00:00
211	4	\N	10	6	2992.41	transfer	2025-02-14 00:00:00	Transfer to Savings	t	21	1	35	2025-02-14 00:00:00
212	4	\N	8	9	1134.21	withdrawal	2025-06-17 00:00:00	Cash Removed from Account	f	\N	\N	21	2025-06-17 00:00:00
213	4	\N	9	\N	3066.38	withdrawal	2025-06-21 00:00:00	ATM Cash Withdrawal	f	\N	\N	22	2025-06-21 00:00:00
214	4	34	\N	1	718.75	transfer	2025-06-05 00:00:00	Bank Internal Transfer	t	\N	\N	22	2025-06-05 00:00:00
217	4	\N	8	\N	396.43	fee	2025-02-24 00:00:00	Service Charge	t	7	\N	3	2025-02-24 00:00:00
218	4	\N	10	6	2322.46	expense	2025-06-13 00:00:00	Restaurant Dinner	f	\N	\N	30	2025-06-13 00:00:00
219	4	21	\N	\N	421.13	expense	2025-03-18 00:00:00	Public Transport Fare	f	\N	\N	15	2025-03-18 00:00:00
220	4	50	\N	1	1726.54	expense	2025-02-05 00:00:00	Coffee Shop	f	\N	\N	8	2025-02-05 00:00:00
221	4	\N	12	4	1767.64	deposit	2025-03-01 00:00:00	Cheque Deposit	t	\N	\N	8	2025-03-01 00:00:00
222	4	4	\N	2	2505.02	transfer	2025-02-01 00:00:00	Transfer from Checking	f	5	\N	47	2025-02-01 00:00:00
223	4	\N	10	\N	4647.96	transfer	2025-06-18 00:00:00	Transfer to Savings	f	\N	\N	25	2025-06-18 00:00:00
224	4	\N	8	5	466.27	income	2025-02-09 00:00:00	Freelance Project Payment	f	\N	\N	46	2025-02-09 00:00:00
225	4	49	\N	\N	1616.17	income	2025-02-23 00:00:00	Freelance Project Payment	f	\N	\N	12	2025-02-23 00:00:00
226	4	22	\N	\N	1358.50	income	2025-06-16 00:00:00	Interest Income	f	21	\N	46	2025-06-16 00:00:00
227	4	\N	5	2	1054.92	deposit	2025-05-27 00:00:00	Cash Deposit at Branch	f	\N	4	14	2025-05-27 00:00:00
228	4	45	\N	\N	627.19	deposit	2025-03-02 00:00:00	Online Deposit	f	\N	2	43	2025-03-02 00:00:00
229	4	3	\N	9	3235.47	expense	2025-06-17 00:00:00	Public Transport Fare	f	\N	\N	26	2025-06-17 00:00:00
230	4	16	\N	\N	795.59	income	2025-06-01 00:00:00	Refund Processed	f	\N	\N	12	2025-06-01 00:00:00
231	4	43	\N	7	2186.95	transfer	2025-02-17 00:00:00	Transfer to Savings	f	13	\N	7	2025-02-17 00:00:00
232	4	45	\N	\N	2808.25	expense	2025-06-20 00:00:00	Streaming Subscription	f	\N	\N	20	2025-06-20 00:00:00
233	4	\N	7	\N	940.28	transfer	2025-01-18 00:00:00	Transfer from Checking	f	\N	\N	48	2025-01-18 00:00:00
234	4	18	\N	\N	4043.05	deposit	2025-04-14 00:00:00	Cheque Deposit	t	\N	\N	20	2025-04-14 00:00:00
235	4	\N	1	\N	3843.79	fee	2025-04-19 00:00:00	ATM Withdrawal Fee	f	\N	\N	1	2025-04-19 00:00:00
236	4	\N	8	\N	1762.92	expense	2025-04-21 00:00:00	Fuel Station	t	\N	\N	50	2025-04-21 00:00:00
272	6	\N	10	\N	96.55	income	2025-02-11 00:00:00	Dividend Payment	f	\N	1	5	2025-02-11 00:00:00
273	6	\N	4	7	3151.30	withdrawal	2025-02-07 00:00:00	Cash Removed from Account	f	\N	3	21	2025-02-07 00:00:00
274	6	\N	10	8	4824.69	withdrawal	2025-01-02 00:00:00	ATM Cash Withdrawal	t	\N	\N	8	2025-01-02 00:00:00
275	6	\N	10	2	2484.98	income	2025-01-17 00:00:00	Dividend Payment	t	15	1	23	2025-01-17 00:00:00
276	6	41	\N	7	2140.61	withdrawal	2025-05-02 00:00:00	ATM Cash Withdrawal	f	\N	3	49	2025-05-02 00:00:00
277	6	27	\N	\N	4028.67	expense	2025-02-10 00:00:00	Utility Bill Payment	f	\N	\N	6	2025-02-10 00:00:00
278	6	\N	8	\N	2132.72	deposit	2025-04-05 00:00:00	Cheque Deposit	t	14	\N	46	2025-04-05 00:00:00
279	6	35	\N	\N	2600.83	deposit	2025-03-02 00:00:00	Online Deposit	f	\N	5	0	2025-03-02 00:00:00
280	6	35	\N	1	1253.70	transfer	2025-03-04 00:00:00	Transfer to Savings	f	\N	\N	6	2025-03-04 00:00:00
281	6	29	\N	\N	3520.49	expense	2025-03-10 00:00:00	Grocery Store Purchase	f	9	\N	35	2025-03-10 00:00:00
282	6	24	\N	\N	3310.53	expense	2025-01-19 00:00:00	Streaming Subscription	f	\N	1	31	2025-01-19 00:00:00
283	6	15	\N	7	714.77	transfer	2025-05-20 00:00:00	Transfer from Checking	f	\N	\N	26	2025-05-20 00:00:00
215	4	\N	2	2	661.06	income	2025-06-22 00:00:00	Salary 	f	\N	\N	15	2025-06-22 00:00:00
284	6	15	\N	3	4242.66	transfer	2025-04-04 00:00:00	Bank Internal Transfer	f	14	\N	18	2025-04-04 00:00:00
285	6	16	\N	\N	1754.22	deposit	2025-03-14 00:00:00	Cheque Deposit	f	19	\N	27	2025-03-14 00:00:00
286	6	\N	2	7	4205.97	expense	2025-03-27 00:00:00	Grocery Store Purchase	t	11	\N	45	2025-03-27 00:00:00
287	6	12	\N	9	4185.05	fee	2025-04-28 00:00:00	Service Charge	f	\N	\N	26	2025-04-28 00:00:00
288	6	\N	8	\N	1485.68	income	2025-05-01 00:00:00	Salary Payment	f	7	\N	25	2025-05-01 00:00:00
289	6	16	\N	5	3305.43	fee	2025-05-26 00:00:00	Monthly Account Fee	t	\N	5	27	2025-05-26 00:00:00
290	6	\N	3	\N	87.56	expense	2025-01-09 00:00:00	Fuel Station	f	\N	\N	20	2025-01-09 00:00:00
291	6	\N	2	\N	3569.34	income	2025-01-17 00:00:00	Freelance Project Payment	t	\N	\N	47	2025-01-17 00:00:00
292	6	\N	2	\N	3125.59	fee	2025-02-12 00:00:00	Monthly Account Fee	f	\N	\N	43	2025-02-12 00:00:00
293	6	\N	9	\N	2391.88	deposit	2025-05-20 00:00:00	Cheque Deposit	f	\N	\N	15	2025-05-20 00:00:00
294	6	26	\N	\N	3003.38	deposit	2025-04-13 00:00:00	Cheque Deposit	f	\N	\N	33	2025-04-13 00:00:00
295	6	51	\N	5	277.85	transfer	2025-02-15 00:00:00	Bank Internal Transfer	f	\N	\N	18	2025-02-15 00:00:00
296	6	21	\N	\N	2387.60	expense	2025-04-05 00:00:00	Clothing Store Purchase	f	\N	\N	5	2025-04-05 00:00:00
297	6	44	\N	2	4119.14	income	2025-02-15 00:00:00	Salary Payment	f	\N	\N	3	2025-02-15 00:00:00
298	6	9	\N	\N	4349.59	withdrawal	2025-02-07 00:00:00	Cash Removed from Account	f	\N	\N	28	2025-02-07 00:00:00
299	6	\N	5	\N	3210.72	transfer	2025-06-25 00:00:00	Transfer to Savings	f	\N	\N	4	2025-06-25 00:00:00
300	6	11	\N	\N	1650.01	withdrawal	2025-01-29 00:00:00	Cash Removed from Account	f	\N	\N	44	2025-01-29 00:00:00
301	6	\N	8	7	1971.71	fee	2025-04-10 00:00:00	Monthly Account Fee	f	23	\N	26	2025-04-10 00:00:00
302	6	26	\N	3	3796.71	expense	2025-06-28 00:00:00	Mobile Data Recharge	f	23	\N	3	2025-06-28 00:00:00
303	6	25	\N	\N	2387.65	fee	2025-05-26 00:00:00	ATM Withdrawal Fee	f	\N	\N	47	2025-05-26 00:00:00
304	6	\N	10	\N	2898.02	expense	2025-02-15 00:00:00	Coffee Shop	f	7	\N	25	2025-02-15 00:00:00
305	6	15	\N	1	2409.14	deposit	2025-06-05 00:00:00	Online Deposit	f	\N	\N	11	2025-06-05 00:00:00
306	6	6	\N	\N	2132.16	deposit	2025-06-30 00:00:00	Cheque Deposit	f	\N	\N	30	2025-06-30 00:00:00
307	6	48	\N	3	4594.22	fee	2025-03-10 00:00:00	ATM Withdrawal Fee	f	\N	\N	33	2025-03-10 00:00:00
308	6	23	\N	2	467.80	income	2025-06-01 00:00:00	Freelance Project Payment	t	\N	\N	41	2025-06-01 00:00:00
309	6	12	\N	\N	4501.53	fee	2025-01-02 00:00:00	ATM Withdrawal Fee	f	17	4	4	2025-01-02 00:00:00
310	6	44	\N	2	102.28	fee	2025-02-21 00:00:00	Monthly Account Fee	f	14	\N	34	2025-02-21 00:00:00
311	6	\N	11	5	3833.84	fee	2025-01-26 00:00:00	ATM Withdrawal Fee	f	\N	\N	30	2025-01-26 00:00:00
312	6	42	\N	\N	2762.27	income	2025-03-19 00:00:00	Freelance Project Payment	f	\N	\N	6	2025-03-19 00:00:00
313	6	26	\N	9	4990.07	deposit	2025-04-04 00:00:00	Cheque Deposit	f	\N	\N	29	2025-04-04 00:00:00
314	6	\N	7	\N	1432.00	fee	2025-05-17 00:00:00	Service Charge	f	11	\N	37	2025-05-17 00:00:00
315	6	12	\N	\N	278.46	expense	2025-06-10 00:00:00	Fuel Station	f	\N	\N	18	2025-06-10 00:00:00
316	6	30	\N	\N	4689.86	income	2025-06-16 00:00:00	Salary Payment	f	\N	\N	44	2025-06-16 00:00:00
317	6	8	\N	1	4066.77	expense	2025-06-14 00:00:00	Monthly Rent Payment	f	5	\N	16	2025-06-14 00:00:00
318	6	\N	5	\N	1234.49	transfer	2025-04-01 00:00:00	Bank Internal Transfer	f	\N	\N	25	2025-04-01 00:00:00
319	6	25	\N	4	4351.80	fee	2025-03-24 00:00:00	ATM Withdrawal Fee	f	13	\N	35	2025-03-24 00:00:00
320	6	1	\N	\N	2099.96	expense	2025-06-27 00:00:00	Monthly Rent Payment	f	18	\N	47	2025-06-27 00:00:00
321	6	47	\N	4	4709.02	withdrawal	2025-05-22 00:00:00	Cash Removed from Account	f	\N	\N	1	2025-05-22 00:00:00
322	6	34	\N	5	319.23	deposit	2025-04-04 00:00:00	Online Deposit	f	\N	5	31	2025-04-04 00:00:00
323	6	27	\N	7	4511.93	transfer	2025-06-21 00:00:00	Transfer from Checking	f	23	\N	30	2025-06-21 00:00:00
324	6	45	\N	\N	73.87	withdrawal	2025-06-13 00:00:00	ATM Cash Withdrawal	f	7	2	46	2025-06-13 00:00:00
325	6	9	\N	\N	4702.35	transfer	2025-04-23 00:00:00	Transfer from Checking	f	\N	\N	33	2025-04-23 00:00:00
326	6	6	\N	4	3006.26	income	2025-05-25 00:00:00	Interest Income	t	\N	\N	6	2025-05-25 00:00:00
327	6	38	\N	6	2763.12	fee	2025-01-05 00:00:00	ATM Withdrawal Fee	f	\N	\N	17	2025-01-05 00:00:00
328	6	\N	6	9	4740.11	withdrawal	2025-02-09 00:00:00	Cash Removed from Account	f	\N	\N	16	2025-02-09 00:00:00
329	6	\N	5	5	1669.37	transfer	2025-04-16 00:00:00	Transfer from Checking	f	18	4	4	2025-04-16 00:00:00
330	6	\N	8	\N	4233.26	expense	2025-04-08 00:00:00	Restaurant Dinner	f	23	\N	22	2025-04-08 00:00:00
331	6	\N	4	\N	1575.40	income	2025-05-24 00:00:00	Interest Income	f	\N	\N	47	2025-05-24 00:00:00
332	6	48	\N	\N	1559.35	income	2025-05-28 00:00:00	Dividend Payment	f	\N	4	37	2025-05-28 00:00:00
333	6	20	\N	6	2220.38	income	2025-02-10 00:00:00	Dividend Payment	f	\N	2	23	2025-02-10 00:00:00
334	6	4	\N	\N	4790.67	transfer	2025-04-20 00:00:00	Bank Internal Transfer	t	\N	\N	17	2025-04-20 00:00:00
335	6	34	\N	\N	2654.99	income	2025-06-02 00:00:00	Freelance Project Payment	f	\N	\N	42	2025-06-02 00:00:00
336	6	\N	6	\N	3653.87	transfer	2025-05-15 00:00:00	Transfer to Savings	f	\N	\N	28	2025-05-15 00:00:00
337	6	12	\N	\N	4269.44	expense	2025-05-09 00:00:00	Fuel Station	f	\N	\N	12	2025-05-09 00:00:00
338	6	\N	4	1	4858.57	expense	2025-01-08 00:00:00	Mobile Data Recharge	f	16	\N	30	2025-01-08 00:00:00
339	6	2	\N	\N	2630.76	transfer	2025-03-12 00:00:00	Bank Internal Transfer	f	16	\N	12	2025-03-12 00:00:00
340	6	6	\N	4	2347.74	transfer	2025-01-24 00:00:00	Transfer from Checking	t	\N	1	18	2025-01-24 00:00:00
341	6	8	\N	8	4433.03	income	2025-06-20 00:00:00	Refund Processed	f	9	3	32	2025-06-20 00:00:00
342	7	13	\N	3	2506.11	transfer	2025-04-03 00:00:00	Bank Internal Transfer	f	17	\N	12	2025-04-03 00:00:00
343	7	1	\N	7	732.56	income	2025-05-22 00:00:00	Refund Processed	f	\N	\N	7	2025-05-22 00:00:00
344	7	30	\N	9	1823.02	deposit	2025-05-24 00:00:00	Cheque Deposit	f	\N	4	22	2025-05-24 00:00:00
345	7	\N	7	1	4789.37	fee	2025-01-24 00:00:00	ATM Withdrawal Fee	t	23	\N	33	2025-01-24 00:00:00
346	7	6	\N	6	2941.79	expense	2025-02-14 00:00:00	Restaurant Dinner	f	\N	\N	43	2025-02-14 00:00:00
347	7	35	\N	\N	3419.74	expense	2025-01-21 00:00:00	Grocery Store Purchase	f	\N	1	41	2025-01-21 00:00:00
348	7	40	\N	\N	3936.66	transfer	2025-04-30 00:00:00	Transfer from Checking	f	3	\N	24	2025-04-30 00:00:00
349	7	\N	10	1	3061.25	deposit	2025-05-21 00:00:00	Cheque Deposit	f	8	\N	45	2025-05-21 00:00:00
350	7	\N	9	9	4317.60	deposit	2025-03-23 00:00:00	Cheque Deposit	f	12	\N	2	2025-03-23 00:00:00
351	7	4	\N	\N	264.91	withdrawal	2025-02-15 00:00:00	ATM Cash Withdrawal	f	\N	\N	18	2025-02-15 00:00:00
352	7	\N	2	\N	4827.53	transfer	2025-06-06 00:00:00	Bank Internal Transfer	f	3	\N	15	2025-06-06 00:00:00
353	7	41	\N	9	1818.00	withdrawal	2025-02-09 00:00:00	Cash Removed from Account	f	\N	4	39	2025-02-09 00:00:00
354	7	16	\N	\N	407.17	withdrawal	2025-04-18 00:00:00	ATM Cash Withdrawal	t	\N	\N	26	2025-04-18 00:00:00
355	7	48	\N	5	2697.06	transfer	2025-06-25 00:00:00	Transfer to Savings	f	1	\N	18	2025-06-25 00:00:00
356	7	41	\N	\N	3816.79	withdrawal	2025-01-07 00:00:00	Cash Removed from Account	f	\N	\N	39	2025-01-07 00:00:00
357	7	36	\N	\N	4628.55	deposit	2025-04-16 00:00:00	Cash Deposit at Branch	f	\N	\N	28	2025-04-16 00:00:00
358	7	10	\N	\N	4271.26	expense	2025-02-21 00:00:00	Utility Bill Payment	t	\N	\N	27	2025-02-21 00:00:00
359	7	28	\N	\N	3158.44	transfer	2025-05-18 00:00:00	Transfer to Savings	f	\N	\N	8	2025-05-18 00:00:00
360	7	11	\N	\N	2604.09	transfer	2025-04-02 00:00:00	Bank Internal Transfer	f	21	\N	6	2025-04-02 00:00:00
361	7	10	\N	1	1480.66	income	2025-01-02 00:00:00	Dividend Payment	f	11	1	3	2025-01-02 00:00:00
362	7	\N	6	5	1433.39	fee	2025-01-24 00:00:00	Monthly Account Fee	f	\N	\N	41	2025-01-24 00:00:00
363	7	\N	2	3	2333.86	fee	2025-06-02 00:00:00	Monthly Account Fee	f	10	\N	49	2025-06-02 00:00:00
364	7	18	\N	5	2739.24	fee	2025-01-12 00:00:00	Monthly Account Fee	f	14	\N	23	2025-01-12 00:00:00
365	7	23	\N	4	4830.93	expense	2025-03-13 00:00:00	Streaming Subscription	f	5	3	5	2025-03-13 00:00:00
366	7	\N	3	\N	2982.51	expense	2025-02-02 00:00:00	Grocery Store Purchase	f	19	\N	15	2025-02-02 00:00:00
367	7	\N	13	\N	3473.95	deposit	2025-01-21 00:00:00	Cash Deposit at Branch	f	\N	\N	13	2025-01-21 00:00:00
368	7	5	\N	3	3251.77	withdrawal	2025-02-27 00:00:00	Cash Removed from Account	f	\N	\N	12	2025-02-27 00:00:00
369	7	\N	10	1	3766.16	transfer	2025-03-15 00:00:00	Transfer to Savings	f	\N	\N	43	2025-03-15 00:00:00
370	7	51	\N	\N	4210.84	fee	2025-02-14 00:00:00	Monthly Account Fee	f	\N	3	44	2025-02-14 00:00:00
371	7	27	\N	9	2314.08	deposit	2025-01-21 00:00:00	Cheque Deposit	f	\N	\N	43	2025-01-21 00:00:00
372	7	5	\N	5	3387.28	withdrawal	2025-02-05 00:00:00	Cash Removed from Account	f	\N	\N	48	2025-02-05 00:00:00
373	7	16	\N	7	4959.61	deposit	2025-06-25 00:00:00	Cheque Deposit	f	\N	\N	36	2025-06-25 00:00:00
374	7	23	\N	2	1225.41	expense	2025-02-13 00:00:00	Fuel Station	f	\N	\N	17	2025-02-13 00:00:00
375	7	24	\N	\N	2509.34	transfer	2025-06-24 00:00:00	Transfer from Checking	f	10	\N	1	2025-06-24 00:00:00
376	7	\N	11	3	3667.73	withdrawal	2025-02-28 00:00:00	ATM Cash Withdrawal	f	10	\N	41	2025-02-28 00:00:00
377	7	10	\N	\N	1362.00	withdrawal	2025-05-25 00:00:00	Cash Removed from Account	f	\N	\N	43	2025-05-25 00:00:00
378	7	\N	2	\N	2859.23	deposit	2025-04-07 00:00:00	Cheque Deposit	f	\N	\N	42	2025-04-07 00:00:00
379	7	24	\N	\N	1326.35	transfer	2025-06-20 00:00:00	Bank Internal Transfer	f	\N	\N	48	2025-06-20 00:00:00
380	7	\N	5	1	549.24	fee	2025-06-07 00:00:00	ATM Withdrawal Fee	f	\N	5	35	2025-06-07 00:00:00
381	7	1	\N	\N	1346.90	fee	2025-05-11 00:00:00	Monthly Account Fee	t	\N	\N	45	2025-05-11 00:00:00
382	7	\N	8	\N	72.33	withdrawal	2025-02-13 00:00:00	ATM Cash Withdrawal	f	13	5	1	2025-02-13 00:00:00
383	7	15	\N	8	449.06	deposit	2025-03-26 00:00:00	Cash Deposit at Branch	f	\N	\N	3	2025-03-26 00:00:00
384	7	36	\N	6	1016.59	transfer	2025-06-09 00:00:00	Transfer from Checking	f	14	\N	39	2025-06-09 00:00:00
385	7	29	\N	4	4328.86	withdrawal	2025-05-24 00:00:00	ATM Cash Withdrawal	t	\N	\N	21	2025-05-24 00:00:00
386	7	23	\N	2	3663.92	expense	2025-03-20 00:00:00	Utility Bill Payment	f	\N	\N	1	2025-03-20 00:00:00
387	7	21	\N	\N	3065.78	deposit	2025-05-23 00:00:00	Cheque Deposit	f	\N	1	12	2025-05-23 00:00:00
388	7	\N	2	3	636.66	income	2025-06-22 00:00:00	Freelance Project Payment	f	\N	\N	16	2025-06-22 00:00:00
389	7	12	\N	6	1909.29	deposit	2025-04-20 00:00:00	Cheque Deposit	f	\N	4	19	2025-04-20 00:00:00
390	7	20	\N	\N	1998.17	withdrawal	2025-01-24 00:00:00	ATM Cash Withdrawal	f	\N	\N	28	2025-01-24 00:00:00
391	7	46	\N	\N	3695.34	expense	2025-03-02 00:00:00	Fuel Station	f	\N	3	40	2025-03-02 00:00:00
392	7	47	\N	\N	916.34	withdrawal	2025-02-14 00:00:00	ATM Cash Withdrawal	f	\N	\N	15	2025-02-14 00:00:00
393	7	14	\N	\N	1592.51	withdrawal	2025-01-28 00:00:00	Cash Removed from Account	f	\N	\N	18	2025-01-28 00:00:00
394	7	\N	12	\N	3344.61	transfer	2025-01-11 00:00:00	Transfer from Checking	f	20	2	16	2025-01-11 00:00:00
395	7	18	\N	1	3307.84	transfer	2025-06-14 00:00:00	Transfer from Checking	f	\N	\N	50	2025-06-14 00:00:00
396	7	\N	10	\N	4114.18	deposit	2025-06-03 00:00:00	Cash Deposit at Branch	f	\N	3	1	2025-06-03 00:00:00
397	7	\N	6	1	1659.49	expense	2025-03-12 00:00:00	Streaming Subscription	f	\N	2	50	2025-03-12 00:00:00
398	7	9	\N	\N	4587.89	transfer	2025-04-02 00:00:00	Transfer from Checking	f	3	\N	12	2025-04-02 00:00:00
399	7	10	\N	8	873.35	income	2025-06-17 00:00:00	Refund Processed	f	\N	\N	38	2025-06-17 00:00:00
400	7	\N	6	\N	3416.35	withdrawal	2025-03-06 00:00:00	ATM Cash Withdrawal	f	\N	\N	25	2025-03-06 00:00:00
401	7	26	\N	\N	1936.41	deposit	2025-01-12 00:00:00	Online Deposit	f	9	\N	29	2025-01-12 00:00:00
402	7	19	\N	\N	302.48	deposit	2025-05-20 00:00:00	Cheque Deposit	f	\N	\N	28	2025-05-20 00:00:00
403	7	22	\N	4	667.01	income	2025-05-30 00:00:00	Interest Income	f	\N	1	5	2025-05-30 00:00:00
404	7	23	\N	\N	1737.51	expense	2025-05-19 00:00:00	Fuel Station	f	10	\N	36	2025-05-19 00:00:00
405	7	13	\N	8	3384.95	withdrawal	2025-05-02 00:00:00	ATM Cash Withdrawal	f	\N	\N	50	2025-05-02 00:00:00
406	7	38	\N	\N	2834.39	deposit	2025-01-01 00:00:00	Cash Deposit at Branch	f	11	\N	16	2025-01-01 00:00:00
407	7	\N	11	7	3445.01	fee	2025-02-19 00:00:00	Service Charge	f	\N	\N	32	2025-02-19 00:00:00
408	7	42	\N	\N	3172.19	transfer	2025-01-16 00:00:00	Bank Internal Transfer	f	\N	\N	10	2025-01-16 00:00:00
409	7	50	\N	\N	1169.61	expense	2025-01-02 00:00:00	Clothing Store Purchase	f	\N	\N	38	2025-01-02 00:00:00
410	7	\N	11	7	4744.24	transfer	2025-05-02 00:00:00	Transfer to Savings	t	\N	\N	45	2025-05-02 00:00:00
411	7	37	\N	\N	4220.98	deposit	2025-03-28 00:00:00	Online Deposit	t	15	2	21	2025-03-28 00:00:00
412	8	46	\N	\N	4688.21	income	2025-01-22 00:00:00	Freelance Project Payment	f	5	\N	12	2025-01-22 00:00:00
413	8	\N	3	\N	4848.58	fee	2025-06-02 00:00:00	Monthly Account Fee	t	\N	1	16	2025-06-02 00:00:00
414	8	32	\N	\N	4706.15	expense	2025-05-21 00:00:00	Mobile Data Recharge	f	\N	\N	29	2025-05-21 00:00:00
415	8	\N	10	\N	1033.48	fee	2025-03-04 00:00:00	ATM Withdrawal Fee	f	\N	\N	38	2025-03-04 00:00:00
416	8	40	\N	2	915.99	expense	2025-05-27 00:00:00	Mobile Data Recharge	t	21	\N	45	2025-05-27 00:00:00
417	8	\N	5	5	4769.03	withdrawal	2025-02-16 00:00:00	ATM Cash Withdrawal	f	\N	3	39	2025-02-16 00:00:00
418	8	34	\N	\N	3546.94	fee	2025-05-15 00:00:00	Monthly Account Fee	f	\N	5	50	2025-05-15 00:00:00
419	8	12	\N	\N	2007.89	withdrawal	2025-04-17 00:00:00	Cash Removed from Account	f	\N	\N	22	2025-04-17 00:00:00
420	8	23	\N	\N	3653.24	income	2025-01-24 00:00:00	Dividend Payment	f	\N	\N	42	2025-01-24 00:00:00
421	8	\N	8	\N	1927.59	withdrawal	2025-06-16 00:00:00	Cash Removed from Account	f	7	\N	40	2025-06-16 00:00:00
422	8	3	\N	\N	2670.02	deposit	2025-01-25 00:00:00	Cheque Deposit	f	1	3	16	2025-01-25 00:00:00
423	8	28	\N	5	3338.96	fee	2025-01-29 00:00:00	ATM Withdrawal Fee	f	\N	\N	21	2025-01-29 00:00:00
424	8	27	\N	\N	636.49	withdrawal	2025-02-24 00:00:00	ATM Cash Withdrawal	f	\N	\N	37	2025-02-24 00:00:00
425	8	45	\N	1	3397.84	withdrawal	2025-03-18 00:00:00	ATM Cash Withdrawal	f	\N	\N	5	2025-03-18 00:00:00
1866	18	27	\N	\N	1000.00	income	2025-08-19 22:00:00	qwerty	f	\N	\N	0	2025-08-19 22:21:38.185813
426	8	\N	6	\N	3850.59	transfer	2025-05-19 00:00:00	Bank Internal Transfer	f	11	\N	48	2025-05-19 00:00:00
427	8	15	\N	\N	2913.54	withdrawal	2025-04-04 00:00:00	Cash Removed from Account	f	3	\N	15	2025-04-04 00:00:00
428	8	44	\N	6	4720.63	expense	2025-05-11 00:00:00	Grocery Store Purchase	f	12	5	13	2025-05-11 00:00:00
429	8	49	\N	\N	934.38	deposit	2025-06-23 00:00:00	Cheque Deposit	f	1	\N	11	2025-06-23 00:00:00
430	8	29	\N	\N	4070.37	expense	2025-03-21 00:00:00	Utility Bill Payment	f	\N	4	17	2025-03-21 00:00:00
431	8	19	\N	\N	3254.44	fee	2025-03-30 00:00:00	Monthly Account Fee	f	\N	\N	12	2025-03-30 00:00:00
432	8	47	\N	7	3589.57	fee	2025-03-15 00:00:00	ATM Withdrawal Fee	f	\N	\N	0	2025-03-15 00:00:00
433	8	28	\N	1	4059.22	withdrawal	2025-01-26 00:00:00	ATM Cash Withdrawal	f	\N	\N	50	2025-01-26 00:00:00
434	8	22	\N	4	4230.27	withdrawal	2025-06-25 00:00:00	ATM Cash Withdrawal	f	16	\N	41	2025-06-25 00:00:00
435	8	7	\N	\N	3550.17	expense	2025-06-01 00:00:00	Clothing Store Purchase	f	\N	\N	26	2025-06-01 00:00:00
436	8	\N	12	\N	3669.80	deposit	2025-05-17 00:00:00	Cheque Deposit	f	\N	\N	27	2025-05-17 00:00:00
437	8	21	\N	6	3152.88	withdrawal	2025-06-17 00:00:00	Cash Removed from Account	f	15	2	27	2025-06-17 00:00:00
438	8	\N	4	\N	3770.43	fee	2025-05-10 00:00:00	ATM Withdrawal Fee	f	\N	4	11	2025-05-10 00:00:00
439	8	16	\N	\N	2637.87	expense	2025-02-07 00:00:00	Clothing Store Purchase	f	\N	4	9	2025-02-07 00:00:00
440	8	\N	1	\N	3541.24	fee	2025-06-25 00:00:00	Service Charge	f	\N	\N	26	2025-06-25 00:00:00
441	8	46	\N	8	2893.06	fee	2025-03-18 00:00:00	Service Charge	f	\N	5	30	2025-03-18 00:00:00
442	8	\N	3	\N	4392.77	withdrawal	2025-02-11 00:00:00	ATM Cash Withdrawal	f	23	\N	26	2025-02-11 00:00:00
443	8	\N	3	\N	1491.36	income	2025-06-13 00:00:00	Interest Income	t	\N	\N	49	2025-06-13 00:00:00
444	8	25	\N	\N	2225.92	expense	2025-05-09 00:00:00	Mobile Data Recharge	f	\N	\N	18	2025-05-09 00:00:00
445	8	47	\N	\N	2802.62	expense	2025-03-15 00:00:00	Monthly Rent Payment	f	\N	1	37	2025-03-15 00:00:00
446	8	29	\N	\N	876.81	fee	2025-02-03 00:00:00	Service Charge	f	\N	\N	8	2025-02-03 00:00:00
447	8	16	\N	\N	2349.28	withdrawal	2025-06-13 00:00:00	Cash Removed from Account	f	\N	\N	17	2025-06-13 00:00:00
448	8	25	\N	8	1632.45	deposit	2025-01-23 00:00:00	Cheque Deposit	f	\N	\N	6	2025-01-23 00:00:00
449	8	27	\N	\N	1714.33	withdrawal	2025-03-06 00:00:00	ATM Cash Withdrawal	f	\N	4	37	2025-03-06 00:00:00
450	8	37	\N	2	271.93	income	2025-03-22 00:00:00	Freelance Project Payment	f	\N	4	32	2025-03-22 00:00:00
451	8	6	\N	3	3354.98	expense	2025-03-15 00:00:00	Streaming Subscription	f	20	3	9	2025-03-15 00:00:00
452	8	20	\N	8	1828.45	transfer	2025-05-17 00:00:00	Bank Internal Transfer	f	\N	\N	9	2025-05-17 00:00:00
453	8	6	\N	\N	1309.88	withdrawal	2025-06-13 00:00:00	ATM Cash Withdrawal	f	\N	\N	49	2025-06-13 00:00:00
454	8	\N	8	\N	4835.21	income	2025-05-21 00:00:00	Dividend Payment	f	13	\N	46	2025-05-21 00:00:00
455	8	48	\N	2	4327.96	expense	2025-04-26 00:00:00	Clothing Store Purchase	f	\N	\N	50	2025-04-26 00:00:00
456	8	12	\N	\N	2141.00	fee	2025-05-07 00:00:00	ATM Withdrawal Fee	f	7	2	35	2025-05-07 00:00:00
457	8	24	\N	4	3347.05	fee	2025-03-04 00:00:00	ATM Withdrawal Fee	t	\N	\N	25	2025-03-04 00:00:00
458	8	20	\N	\N	2777.62	fee	2025-01-29 00:00:00	Service Charge	f	\N	2	14	2025-01-29 00:00:00
459	8	34	\N	2	810.24	withdrawal	2025-03-30 00:00:00	Cash Removed from Account	f	\N	3	36	2025-03-30 00:00:00
460	8	17	\N	\N	3264.13	fee	2025-01-13 00:00:00	ATM Withdrawal Fee	f	14	\N	3	2025-01-13 00:00:00
461	8	\N	3	6	639.20	withdrawal	2025-03-28 00:00:00	ATM Cash Withdrawal	f	5	\N	31	2025-03-28 00:00:00
462	8	10	\N	\N	3868.49	expense	2025-05-31 00:00:00	Streaming Subscription	f	2	4	15	2025-05-31 00:00:00
463	8	13	\N	1	959.99	withdrawal	2025-05-30 00:00:00	Cash Removed from Account	f	\N	\N	4	2025-05-30 00:00:00
464	8	11	\N	7	2659.45	transfer	2025-04-10 00:00:00	Transfer to Savings	f	\N	\N	0	2025-04-10 00:00:00
465	8	\N	2	\N	1630.28	withdrawal	2025-06-18 00:00:00	Cash Removed from Account	f	7	3	36	2025-06-18 00:00:00
466	8	17	\N	\N	3817.20	deposit	2025-02-21 00:00:00	Online Deposit	f	\N	1	1	2025-02-21 00:00:00
467	8	\N	9	\N	938.94	expense	2025-01-17 00:00:00	Clothing Store Purchase	f	\N	\N	14	2025-01-17 00:00:00
468	8	\N	3	\N	4001.89	transfer	2025-06-18 00:00:00	Transfer from Checking	f	\N	\N	12	2025-06-18 00:00:00
469	8	16	\N	\N	2192.69	withdrawal	2025-01-16 00:00:00	Cash Removed from Account	f	\N	\N	17	2025-01-16 00:00:00
470	8	51	\N	\N	3816.93	fee	2025-01-17 00:00:00	Monthly Account Fee	f	\N	4	16	2025-01-17 00:00:00
471	8	30	\N	\N	3853.98	transfer	2025-05-25 00:00:00	Transfer from Checking	f	6	\N	20	2025-05-25 00:00:00
472	8	\N	11	\N	4216.29	income	2025-03-10 00:00:00	Salary Payment	t	\N	\N	23	2025-03-10 00:00:00
473	8	20	\N	\N	3525.77	transfer	2025-01-12 00:00:00	Bank Internal Transfer	t	\N	\N	17	2025-01-12 00:00:00
474	8	49	\N	6	2905.88	expense	2025-04-24 00:00:00	Monthly Rent Payment	t	\N	\N	44	2025-04-24 00:00:00
475	8	1	\N	\N	3170.28	deposit	2025-04-29 00:00:00	Cheque Deposit	f	\N	\N	30	2025-04-29 00:00:00
476	8	49	\N	\N	984.93	transfer	2025-06-20 00:00:00	Transfer from Checking	f	\N	\N	7	2025-06-20 00:00:00
477	8	\N	8	\N	1409.98	income	2025-02-22 00:00:00	Dividend Payment	f	\N	\N	36	2025-02-22 00:00:00
478	8	26	\N	9	4644.59	transfer	2025-04-06 00:00:00	Transfer to Savings	f	18	\N	48	2025-04-06 00:00:00
479	8	17	\N	\N	4967.54	expense	2025-05-24 00:00:00	Fuel Station	t	\N	\N	12	2025-05-24 00:00:00
480	8	\N	1	\N	266.02	withdrawal	2025-03-21 00:00:00	ATM Cash Withdrawal	t	21	\N	15	2025-03-21 00:00:00
481	9	13	\N	\N	3358.76	withdrawal	2025-03-20 00:00:00	Cash Removed from Account	f	20	\N	3	2025-03-20 00:00:00
482	9	\N	6	\N	3371.98	fee	2025-05-20 00:00:00	Service Charge	t	\N	\N	44	2025-05-20 00:00:00
483	9	\N	9	\N	474.46	withdrawal	2025-02-28 00:00:00	Cash Removed from Account	f	\N	\N	16	2025-02-28 00:00:00
484	9	29	\N	1	2658.61	deposit	2025-06-07 00:00:00	Cheque Deposit	f	\N	1	18	2025-06-07 00:00:00
485	9	\N	1	\N	1499.41	withdrawal	2025-04-15 00:00:00	ATM Cash Withdrawal	f	2	\N	0	2025-04-15 00:00:00
486	9	36	\N	8	571.45	transfer	2025-05-31 00:00:00	Bank Internal Transfer	f	\N	\N	42	2025-05-31 00:00:00
487	9	35	\N	\N	3400.98	fee	2025-01-17 00:00:00	Monthly Account Fee	f	\N	\N	26	2025-01-17 00:00:00
488	9	33	\N	\N	4979.80	income	2025-01-31 00:00:00	Dividend Payment	f	\N	\N	33	2025-01-31 00:00:00
489	9	43	\N	\N	126.46	transfer	2025-01-16 00:00:00	Bank Internal Transfer	f	\N	\N	50	2025-01-16 00:00:00
490	9	\N	5	\N	4126.37	transfer	2025-03-15 00:00:00	Transfer from Checking	f	\N	\N	44	2025-03-15 00:00:00
491	9	31	\N	1	3302.72	expense	2025-01-09 00:00:00	Coffee Shop	f	\N	\N	48	2025-01-09 00:00:00
492	9	14	\N	9	1784.26	expense	2025-03-30 00:00:00	Coffee Shop	f	\N	\N	7	2025-03-30 00:00:00
493	9	\N	5	5	3155.77	income	2025-06-07 00:00:00	Salary Payment	f	\N	\N	45	2025-06-07 00:00:00
494	9	18	\N	\N	297.11	expense	2025-02-16 00:00:00	Grocery Store Purchase	f	\N	\N	5	2025-02-16 00:00:00
495	9	\N	9	9	4350.21	withdrawal	2025-06-25 00:00:00	ATM Cash Withdrawal	f	\N	\N	14	2025-06-25 00:00:00
496	9	49	\N	\N	4080.44	transfer	2025-06-28 00:00:00	Transfer to Savings	f	\N	2	25	2025-06-28 00:00:00
497	9	\N	4	\N	2069.22	expense	2025-03-27 00:00:00	Public Transport Fare	f	\N	\N	30	2025-03-27 00:00:00
498	9	14	\N	6	3309.96	fee	2025-04-13 00:00:00	Monthly Account Fee	f	8	\N	38	2025-04-13 00:00:00
499	9	4	\N	9	1466.91	expense	2025-01-22 00:00:00	Monthly Rent Payment	f	23	\N	14	2025-01-22 00:00:00
500	9	44	\N	4	2421.24	expense	2025-05-04 00:00:00	Coffee Shop	f	\N	\N	37	2025-05-04 00:00:00
501	9	17	\N	\N	2871.39	fee	2025-06-10 00:00:00	ATM Withdrawal Fee	f	9	\N	42	2025-06-10 00:00:00
502	9	\N	12	\N	1168.87	fee	2025-03-17 00:00:00	Service Charge	f	\N	\N	43	2025-03-17 00:00:00
503	9	30	\N	8	3140.38	transfer	2025-03-09 00:00:00	Transfer to Savings	f	\N	\N	28	2025-03-09 00:00:00
504	9	29	\N	\N	3997.52	withdrawal	2025-05-01 00:00:00	Cash Removed from Account	f	\N	3	11	2025-05-01 00:00:00
505	9	23	\N	\N	2725.50	transfer	2025-03-30 00:00:00	Bank Internal Transfer	f	\N	\N	6	2025-03-30 00:00:00
506	9	31	\N	7	4479.93	withdrawal	2025-05-21 00:00:00	ATM Cash Withdrawal	f	11	\N	31	2025-05-21 00:00:00
507	9	2	\N	1	1930.33	transfer	2025-04-06 00:00:00	Transfer to Savings	f	\N	\N	27	2025-04-06 00:00:00
508	9	50	\N	9	3906.61	fee	2025-05-03 00:00:00	Monthly Account Fee	f	\N	\N	39	2025-05-03 00:00:00
509	9	\N	12	\N	1298.85	fee	2025-03-09 00:00:00	Service Charge	f	17	\N	19	2025-03-09 00:00:00
510	9	21	\N	\N	83.82	fee	2025-02-05 00:00:00	ATM Withdrawal Fee	f	16	\N	2	2025-02-05 00:00:00
511	9	2	\N	8	3357.39	income	2025-04-29 00:00:00	Freelance Project Payment	f	\N	1	41	2025-04-29 00:00:00
512	9	8	\N	\N	1558.78	withdrawal	2025-05-11 00:00:00	ATM Cash Withdrawal	f	\N	\N	29	2025-05-11 00:00:00
513	9	\N	7	\N	359.68	income	2025-03-27 00:00:00	Refund Processed	f	17	\N	10	2025-03-27 00:00:00
514	9	22	\N	4	2617.00	transfer	2025-06-03 00:00:00	Transfer to Savings	f	4	\N	50	2025-06-03 00:00:00
515	9	\N	3	\N	2515.32	income	2025-04-01 00:00:00	Freelance Project Payment	f	\N	\N	35	2025-04-01 00:00:00
516	9	\N	1	\N	3624.40	income	2025-05-04 00:00:00	Refund Processed	t	\N	5	50	2025-05-04 00:00:00
517	9	\N	10	6	4354.52	expense	2025-05-24 00:00:00	Mobile Data Recharge	f	20	\N	45	2025-05-24 00:00:00
518	9	26	\N	\N	4554.96	fee	2025-02-10 00:00:00	ATM Withdrawal Fee	f	\N	\N	4	2025-02-10 00:00:00
519	9	41	\N	\N	128.41	fee	2025-04-24 00:00:00	Service Charge	f	\N	\N	45	2025-04-24 00:00:00
520	9	\N	1	8	4227.17	income	2025-06-05 00:00:00	Interest Income	f	\N	2	49	2025-06-05 00:00:00
521	9	24	\N	\N	2387.32	expense	2025-02-15 00:00:00	Streaming Subscription	f	\N	\N	14	2025-02-15 00:00:00
522	9	35	\N	\N	3634.32	transfer	2025-03-08 00:00:00	Transfer from Checking	f	\N	\N	29	2025-03-08 00:00:00
523	9	27	\N	\N	3743.74	income	2025-06-12 00:00:00	Bonus Received	f	\N	1	35	2025-06-12 00:00:00
524	9	\N	8	2	1144.73	deposit	2025-04-16 00:00:00	Cheque Deposit	t	\N	\N	25	2025-04-16 00:00:00
525	9	16	\N	9	2109.35	transfer	2025-05-24 00:00:00	Transfer to Savings	f	\N	\N	30	2025-05-24 00:00:00
526	10	39	\N	\N	4663.39	expense	2025-05-02 00:00:00	Streaming Subscription	f	\N	\N	19	2025-05-02 00:00:00
527	10	21	\N	9	749.02	fee	2025-03-23 00:00:00	Service Charge	f	\N	\N	3	2025-03-23 00:00:00
528	10	43	\N	\N	3371.48	transfer	2025-04-13 00:00:00	Transfer from Checking	f	\N	\N	45	2025-04-13 00:00:00
529	10	\N	13	\N	235.62	transfer	2025-02-07 00:00:00	Transfer to Savings	f	\N	\N	46	2025-02-07 00:00:00
530	10	47	\N	3	4071.20	fee	2025-01-25 00:00:00	Service Charge	f	\N	\N	14	2025-01-25 00:00:00
531	10	8	\N	5	3946.12	deposit	2025-01-18 00:00:00	Online Deposit	f	\N	\N	41	2025-01-18 00:00:00
532	10	\N	6	\N	4102.76	expense	2025-04-20 00:00:00	Fuel Station	f	\N	\N	6	2025-04-20 00:00:00
533	10	7	\N	6	4027.25	fee	2025-03-16 00:00:00	Monthly Account Fee	f	21	\N	47	2025-03-16 00:00:00
534	10	30	\N	1	4743.22	transfer	2025-01-21 00:00:00	Bank Internal Transfer	f	\N	\N	25	2025-01-21 00:00:00
535	10	\N	11	\N	3091.55	fee	2025-06-12 00:00:00	Monthly Account Fee	f	\N	\N	7	2025-06-12 00:00:00
536	10	49	\N	\N	3814.57	fee	2025-01-17 00:00:00	ATM Withdrawal Fee	f	13	\N	23	2025-01-17 00:00:00
537	10	\N	12	1	3104.55	transfer	2025-04-11 00:00:00	Transfer from Checking	f	\N	\N	1	2025-04-11 00:00:00
538	10	14	\N	\N	2372.15	fee	2025-06-02 00:00:00	ATM Withdrawal Fee	f	\N	\N	0	2025-06-02 00:00:00
539	10	\N	3	2	3243.57	expense	2025-04-22 00:00:00	Streaming Subscription	f	\N	\N	5	2025-04-22 00:00:00
540	10	38	\N	\N	4829.55	fee	2025-03-07 00:00:00	Monthly Account Fee	f	\N	\N	24	2025-03-07 00:00:00
541	10	26	\N	\N	3606.99	fee	2025-01-14 00:00:00	Monthly Account Fee	f	1	\N	35	2025-01-14 00:00:00
542	10	10	\N	\N	1290.07	expense	2025-04-11 00:00:00	Streaming Subscription	f	\N	\N	8	2025-04-11 00:00:00
543	10	2	\N	\N	3801.45	transfer	2025-04-27 00:00:00	Transfer to Savings	f	6	\N	8	2025-04-27 00:00:00
544	10	\N	9	6	3597.04	withdrawal	2025-04-24 00:00:00	ATM Cash Withdrawal	f	15	\N	50	2025-04-24 00:00:00
545	10	28	\N	\N	2950.60	expense	2025-06-12 00:00:00	Fuel Station	t	\N	\N	21	2025-06-12 00:00:00
546	10	23	\N	\N	1368.71	withdrawal	2025-02-27 00:00:00	Cash Removed from Account	f	1	\N	21	2025-02-27 00:00:00
547	10	47	\N	\N	3168.77	deposit	2025-04-11 00:00:00	Cheque Deposit	f	2	\N	42	2025-04-11 00:00:00
548	10	\N	11	7	1450.34	withdrawal	2025-02-17 00:00:00	Cash Removed from Account	t	7	\N	33	2025-02-17 00:00:00
549	10	42	\N	\N	2175.04	deposit	2025-04-05 00:00:00	Cheque Deposit	f	\N	\N	26	2025-04-05 00:00:00
550	10	31	\N	\N	2560.56	income	2025-03-24 00:00:00	Salary Payment	f	\N	\N	23	2025-03-24 00:00:00
551	10	1	\N	\N	1871.74	transfer	2025-03-20 00:00:00	Transfer to Savings	f	\N	\N	15	2025-03-20 00:00:00
552	10	1	\N	\N	3419.68	transfer	2025-06-20 00:00:00	Bank Internal Transfer	f	\N	5	0	2025-06-20 00:00:00
553	10	7	\N	\N	982.82	fee	2025-03-08 00:00:00	ATM Withdrawal Fee	f	21	4	10	2025-03-08 00:00:00
554	10	30	\N	8	4023.59	income	2025-06-22 00:00:00	Dividend Payment	f	\N	3	49	2025-06-22 00:00:00
555	10	37	\N	\N	3635.63	fee	2025-02-18 00:00:00	Monthly Account Fee	f	\N	4	31	2025-02-18 00:00:00
556	10	\N	1	1	4614.29	transfer	2025-03-22 00:00:00	Bank Internal Transfer	f	\N	\N	20	2025-03-22 00:00:00
557	10	23	\N	1	1115.46	fee	2025-03-04 00:00:00	Monthly Account Fee	f	15	\N	42	2025-03-04 00:00:00
558	10	1	\N	7	2849.44	transfer	2025-01-09 00:00:00	Transfer from Checking	f	\N	\N	13	2025-01-09 00:00:00
559	10	30	\N	\N	4404.13	transfer	2025-03-05 00:00:00	Transfer to Savings	f	\N	\N	28	2025-03-05 00:00:00
560	10	22	\N	\N	3845.52	withdrawal	2025-04-18 00:00:00	ATM Cash Withdrawal	f	\N	4	22	2025-04-18 00:00:00
561	10	\N	7	\N	1976.37	deposit	2025-06-21 00:00:00	Cash Deposit at Branch	f	\N	2	20	2025-06-21 00:00:00
562	10	3	\N	8	1858.92	transfer	2025-06-21 00:00:00	Transfer from Checking	f	\N	\N	9	2025-06-21 00:00:00
563	10	40	\N	4	2371.10	deposit	2025-05-09 00:00:00	Online Deposit	f	\N	4	3	2025-05-09 00:00:00
564	10	5	\N	\N	1164.33	expense	2025-05-22 00:00:00	Streaming Subscription	f	\N	\N	24	2025-05-22 00:00:00
565	10	5	\N	\N	4022.70	fee	2025-04-02 00:00:00	Service Charge	f	\N	\N	24	2025-04-02 00:00:00
566	10	45	\N	\N	1474.32	fee	2025-05-30 00:00:00	Monthly Account Fee	f	\N	2	17	2025-05-30 00:00:00
567	10	29	\N	4	636.17	deposit	2025-01-31 00:00:00	Cash Deposit at Branch	f	8	\N	31	2025-01-31 00:00:00
568	10	10	\N	4	205.02	expense	2025-03-27 00:00:00	Coffee Shop	f	\N	4	47	2025-03-27 00:00:00
569	10	36	\N	\N	55.06	deposit	2025-01-17 00:00:00	Cash Deposit at Branch	f	6	\N	39	2025-01-17 00:00:00
570	10	\N	13	\N	2293.21	transfer	2025-04-18 00:00:00	Transfer to Savings	f	\N	\N	41	2025-04-18 00:00:00
571	10	10	\N	5	3196.91	deposit	2025-01-16 00:00:00	Online Deposit	f	\N	\N	30	2025-01-16 00:00:00
572	10	35	\N	\N	1665.39	income	2025-03-31 00:00:00	Salary Payment	t	\N	\N	8	2025-03-31 00:00:00
573	10	\N	9	6	4461.47	fee	2025-04-20 00:00:00	ATM Withdrawal Fee	f	7	\N	8	2025-04-20 00:00:00
574	10	30	\N	7	3895.34	transfer	2025-04-20 00:00:00	Transfer to Savings	f	\N	\N	10	2025-04-20 00:00:00
575	10	7	\N	\N	195.42	fee	2025-01-12 00:00:00	Monthly Account Fee	f	\N	2	17	2025-01-12 00:00:00
576	10	36	\N	2	3881.06	deposit	2025-06-14 00:00:00	Online Deposit	f	\N	\N	3	2025-06-14 00:00:00
577	10	48	\N	\N	982.92	deposit	2025-01-02 00:00:00	Cash Deposit at Branch	f	\N	\N	32	2025-01-02 00:00:00
578	10	24	\N	7	4483.08	withdrawal	2025-05-17 00:00:00	ATM Cash Withdrawal	f	\N	\N	8	2025-05-17 00:00:00
579	10	9	\N	3	4590.42	transfer	2025-02-10 00:00:00	Bank Internal Transfer	f	\N	\N	11	2025-02-10 00:00:00
580	10	22	\N	9	1366.90	fee	2025-05-13 00:00:00	Monthly Account Fee	f	\N	\N	1	2025-05-13 00:00:00
581	10	\N	9	\N	157.40	deposit	2025-05-23 00:00:00	Online Deposit	f	\N	1	40	2025-05-23 00:00:00
582	10	33	\N	6	3721.30	deposit	2025-04-21 00:00:00	Cash Deposit at Branch	t	\N	\N	3	2025-04-21 00:00:00
583	10	\N	4	3	4163.95	fee	2025-01-24 00:00:00	Service Charge	f	11	4	9	2025-01-24 00:00:00
584	10	26	\N	4	2230.85	income	2025-04-01 00:00:00	Freelance Project Payment	f	\N	\N	35	2025-04-01 00:00:00
585	10	\N	8	6	4370.71	income	2025-02-14 00:00:00	Dividend Payment	f	\N	\N	14	2025-02-14 00:00:00
586	10	46	\N	3	216.09	deposit	2025-01-25 00:00:00	Cash Deposit at Branch	f	\N	\N	9	2025-01-25 00:00:00
587	10	50	\N	\N	1402.15	fee	2025-02-10 00:00:00	Service Charge	f	15	\N	19	2025-02-10 00:00:00
588	10	\N	12	\N	2728.95	expense	2025-03-24 00:00:00	Grocery Store Purchase	f	5	\N	38	2025-03-24 00:00:00
589	10	\N	1	4	4642.52	income	2025-02-26 00:00:00	Freelance Project Payment	f	\N	\N	40	2025-02-26 00:00:00
590	10	32	\N	2	1352.89	withdrawal	2025-05-17 00:00:00	Cash Removed from Account	t	\N	\N	50	2025-05-17 00:00:00
591	10	\N	13	\N	4562.26	income	2025-04-07 00:00:00	Dividend Payment	f	7	\N	43	2025-04-07 00:00:00
592	11	33	\N	4	1142.76	deposit	2025-05-21 00:00:00	Cheque Deposit	f	\N	\N	23	2025-05-21 00:00:00
593	11	46	\N	\N	1679.18	fee	2025-01-09 00:00:00	ATM Withdrawal Fee	f	\N	\N	44	2025-01-09 00:00:00
594	11	13	\N	8	3255.99	transfer	2025-02-10 00:00:00	Transfer to Savings	f	12	\N	26	2025-02-10 00:00:00
595	11	32	\N	\N	664.25	fee	2025-01-27 00:00:00	ATM Withdrawal Fee	f	16	\N	41	2025-01-27 00:00:00
596	11	\N	3	\N	113.80	income	2025-02-18 00:00:00	Dividend Payment	f	4	\N	35	2025-02-18 00:00:00
597	11	49	\N	7	121.56	transfer	2025-02-05 00:00:00	Bank Internal Transfer	f	\N	5	49	2025-02-05 00:00:00
598	11	9	\N	2	1852.30	withdrawal	2025-05-27 00:00:00	ATM Cash Withdrawal	f	\N	5	30	2025-05-27 00:00:00
599	11	47	\N	4	1471.83	transfer	2025-02-22 00:00:00	Transfer to Savings	f	14	\N	7	2025-02-22 00:00:00
600	11	42	\N	\N	4053.39	income	2025-04-05 00:00:00	Bonus Received	f	\N	\N	7	2025-04-05 00:00:00
601	11	46	\N	\N	1806.39	withdrawal	2025-02-10 00:00:00	ATM Cash Withdrawal	t	5	\N	11	2025-02-10 00:00:00
602	11	28	\N	\N	4606.46	fee	2025-03-20 00:00:00	Monthly Account Fee	f	7	\N	22	2025-03-20 00:00:00
603	11	\N	11	2	4124.59	income	2025-03-19 00:00:00	Freelance Project Payment	f	13	\N	33	2025-03-19 00:00:00
604	11	27	\N	\N	3606.21	deposit	2025-03-18 00:00:00	Cheque Deposit	f	\N	\N	3	2025-03-18 00:00:00
605	11	\N	13	6	1566.21	fee	2025-04-04 00:00:00	Monthly Account Fee	f	21	\N	5	2025-04-04 00:00:00
606	11	\N	1	7	4797.71	fee	2025-04-11 00:00:00	Monthly Account Fee	f	\N	\N	17	2025-04-11 00:00:00
607	11	46	\N	5	1102.60	withdrawal	2025-04-17 00:00:00	Cash Removed from Account	f	\N	\N	34	2025-04-17 00:00:00
608	11	\N	4	\N	118.94	expense	2025-01-16 00:00:00	Utility Bill Payment	t	\N	\N	40	2025-01-16 00:00:00
609	11	28	\N	7	4973.57	income	2025-03-24 00:00:00	Refund Processed	f	\N	\N	11	2025-03-24 00:00:00
610	11	\N	11	9	1984.33	income	2025-06-22 00:00:00	Interest Income	f	7	\N	31	2025-06-22 00:00:00
611	11	22	\N	\N	2193.73	fee	2025-01-08 00:00:00	Service Charge	f	\N	\N	6	2025-01-08 00:00:00
612	11	\N	9	6	1024.39	deposit	2025-05-08 00:00:00	Cash Deposit at Branch	f	\N	\N	44	2025-05-08 00:00:00
613	11	\N	13	\N	4219.96	income	2025-05-19 00:00:00	Bonus Received	f	\N	3	8	2025-05-19 00:00:00
614	11	37	\N	\N	4207.34	fee	2025-03-13 00:00:00	ATM Withdrawal Fee	f	\N	\N	29	2025-03-13 00:00:00
615	11	24	\N	\N	4489.35	withdrawal	2025-03-25 00:00:00	Cash Removed from Account	f	\N	\N	48	2025-03-25 00:00:00
616	11	38	\N	\N	4585.34	transfer	2025-04-05 00:00:00	Transfer from Checking	f	\N	\N	40	2025-04-05 00:00:00
617	11	41	\N	\N	4106.33	transfer	2025-04-10 00:00:00	Bank Internal Transfer	f	\N	\N	41	2025-04-10 00:00:00
618	11	49	\N	3	4845.37	expense	2025-03-09 00:00:00	Fuel Station	f	20	\N	37	2025-03-09 00:00:00
619	11	16	\N	4	2135.87	withdrawal	2025-01-14 00:00:00	Cash Removed from Account	f	\N	\N	41	2025-01-14 00:00:00
620	11	21	\N	3	4583.62	fee	2025-04-29 00:00:00	ATM Withdrawal Fee	f	\N	\N	33	2025-04-29 00:00:00
621	11	20	\N	\N	1676.91	transfer	2025-06-24 00:00:00	Bank Internal Transfer	f	\N	\N	49	2025-06-24 00:00:00
622	11	14	\N	\N	1427.51	expense	2025-04-16 00:00:00	Utility Bill Payment	f	\N	\N	20	2025-04-16 00:00:00
623	11	\N	13	7	3610.97	withdrawal	2025-06-08 00:00:00	Cash Removed from Account	f	\N	\N	29	2025-06-08 00:00:00
624	11	42	\N	3	1078.66	expense	2025-04-26 00:00:00	Coffee Shop	f	\N	4	45	2025-04-26 00:00:00
625	11	1	\N	\N	443.81	fee	2025-01-30 00:00:00	Monthly Account Fee	f	\N	\N	13	2025-01-30 00:00:00
626	11	11	\N	\N	1262.94	transfer	2025-05-09 00:00:00	Bank Internal Transfer	f	8	\N	6	2025-05-09 00:00:00
627	11	47	\N	3	4881.29	deposit	2025-04-06 00:00:00	Cash Deposit at Branch	t	5	\N	36	2025-04-06 00:00:00
628	11	26	\N	1	3207.60	expense	2025-01-12 00:00:00	Utility Bill Payment	f	\N	\N	11	2025-01-12 00:00:00
629	11	5	\N	1	3215.90	deposit	2025-01-23 00:00:00	Online Deposit	f	\N	\N	41	2025-01-23 00:00:00
630	11	18	\N	8	4795.94	deposit	2025-02-17 00:00:00	Cheque Deposit	t	\N	\N	15	2025-02-17 00:00:00
631	11	9	\N	9	2697.44	expense	2025-01-22 00:00:00	Streaming Subscription	f	\N	\N	2	2025-01-22 00:00:00
632	11	\N	4	\N	1668.99	deposit	2025-05-04 00:00:00	Cheque Deposit	f	\N	\N	19	2025-05-04 00:00:00
633	11	48	\N	\N	668.97	fee	2025-04-10 00:00:00	Monthly Account Fee	f	\N	\N	34	2025-04-10 00:00:00
634	11	9	\N	2	224.10	deposit	2025-05-29 00:00:00	Cheque Deposit	f	\N	5	46	2025-05-29 00:00:00
635	12	18	\N	\N	3636.21	withdrawal	2025-04-29 00:00:00	Cash Removed from Account	f	\N	\N	24	2025-04-29 00:00:00
636	12	20	\N	4	2118.59	transfer	2025-01-17 00:00:00	Transfer from Checking	f	\N	1	16	2025-01-17 00:00:00
637	12	51	\N	7	1399.44	fee	2025-04-02 00:00:00	Monthly Account Fee	f	\N	\N	10	2025-04-02 00:00:00
638	12	\N	6	6	3263.41	expense	2025-05-18 00:00:00	Utility Bill Payment	f	\N	1	15	2025-05-18 00:00:00
639	12	39	\N	5	4099.22	fee	2025-01-24 00:00:00	Service Charge	f	\N	\N	46	2025-01-24 00:00:00
640	12	1	\N	6	535.88	transfer	2025-05-10 00:00:00	Transfer from Checking	f	\N	\N	7	2025-05-10 00:00:00
641	12	46	\N	5	4780.72	deposit	2025-01-26 00:00:00	Cheque Deposit	f	\N	\N	2	2025-01-26 00:00:00
642	12	11	\N	\N	2523.27	fee	2025-05-17 00:00:00	Monthly Account Fee	f	\N	\N	12	2025-05-17 00:00:00
643	12	35	\N	7	2623.40	withdrawal	2025-05-15 00:00:00	Cash Removed from Account	f	\N	\N	4	2025-05-15 00:00:00
644	12	35	\N	\N	4880.22	expense	2025-06-25 00:00:00	Grocery Store Purchase	f	\N	\N	45	2025-06-25 00:00:00
645	12	11	\N	\N	1433.61	withdrawal	2025-04-04 00:00:00	ATM Cash Withdrawal	f	\N	\N	23	2025-04-04 00:00:00
646	12	46	\N	6	2663.04	expense	2025-04-08 00:00:00	Public Transport Fare	f	\N	3	39	2025-04-08 00:00:00
647	12	36	\N	5	1775.66	income	2025-02-16 00:00:00	Dividend Payment	f	20	\N	4	2025-02-16 00:00:00
648	12	\N	1	\N	4434.94	withdrawal	2025-05-12 00:00:00	ATM Cash Withdrawal	f	\N	\N	10	2025-05-12 00:00:00
649	12	\N	9	\N	1695.43	fee	2025-06-22 00:00:00	Monthly Account Fee	f	\N	\N	17	2025-06-22 00:00:00
650	12	10	\N	8	1542.07	expense	2025-03-01 00:00:00	Streaming Subscription	f	\N	\N	43	2025-03-01 00:00:00
651	12	\N	7	4	1358.83	income	2025-05-01 00:00:00	Interest Income	f	13	\N	4	2025-05-01 00:00:00
652	12	\N	3	\N	3559.68	deposit	2025-03-22 00:00:00	Online Deposit	f	2	2	17	2025-03-22 00:00:00
653	12	5	\N	2	1072.55	fee	2025-05-08 00:00:00	ATM Withdrawal Fee	f	\N	\N	44	2025-05-08 00:00:00
654	12	31	\N	4	3503.32	withdrawal	2025-02-10 00:00:00	Cash Removed from Account	f	\N	\N	8	2025-02-10 00:00:00
655	12	\N	6	\N	4057.62	expense	2025-02-13 00:00:00	Clothing Store Purchase	f	10	1	0	2025-02-13 00:00:00
656	12	23	\N	\N	3526.63	income	2025-04-09 00:00:00	Interest Income	f	23	\N	14	2025-04-09 00:00:00
657	12	25	\N	4	888.64	withdrawal	2025-03-22 00:00:00	Cash Removed from Account	f	\N	\N	50	2025-03-22 00:00:00
658	12	34	\N	\N	3773.17	expense	2025-04-07 00:00:00	Public Transport Fare	f	20	1	27	2025-04-07 00:00:00
659	12	\N	7	4	1374.90	transfer	2025-03-30 00:00:00	Bank Internal Transfer	f	\N	1	9	2025-03-30 00:00:00
660	12	\N	3	7	1829.33	withdrawal	2025-02-24 00:00:00	Cash Removed from Account	f	13	\N	7	2025-02-24 00:00:00
661	12	22	\N	\N	1259.60	fee	2025-01-09 00:00:00	ATM Withdrawal Fee	f	3	\N	22	2025-01-09 00:00:00
662	12	12	\N	\N	92.12	deposit	2025-03-09 00:00:00	Cheque Deposit	f	\N	\N	34	2025-03-09 00:00:00
663	12	47	\N	4	1701.13	deposit	2025-05-31 00:00:00	Online Deposit	f	\N	\N	4	2025-05-31 00:00:00
664	12	\N	4	\N	3340.87	income	2025-06-29 00:00:00	Interest Income	f	15	\N	34	2025-06-29 00:00:00
665	12	35	\N	6	2418.53	expense	2025-02-06 00:00:00	Public Transport Fare	f	19	\N	6	2025-02-06 00:00:00
666	12	15	\N	\N	2657.73	deposit	2025-04-23 00:00:00	Online Deposit	f	\N	\N	18	2025-04-23 00:00:00
667	12	8	\N	\N	3106.53	transfer	2025-01-09 00:00:00	Transfer from Checking	f	\N	\N	20	2025-01-09 00:00:00
668	12	1	\N	5	3987.78	deposit	2025-04-03 00:00:00	Cheque Deposit	t	\N	\N	43	2025-04-03 00:00:00
669	12	40	\N	\N	4898.15	withdrawal	2025-05-29 00:00:00	ATM Cash Withdrawal	f	\N	5	22	2025-05-29 00:00:00
670	12	\N	4	4	4162.44	transfer	2025-04-05 00:00:00	Bank Internal Transfer	f	11	\N	10	2025-04-05 00:00:00
671	12	\N	8	2	1503.16	fee	2025-03-24 00:00:00	Service Charge	f	\N	\N	7	2025-03-24 00:00:00
672	12	38	\N	9	3308.66	fee	2025-06-26 00:00:00	Monthly Account Fee	f	\N	\N	37	2025-06-26 00:00:00
673	12	44	\N	\N	4277.94	transfer	2025-06-06 00:00:00	Transfer to Savings	f	\N	\N	41	2025-06-06 00:00:00
674	13	\N	5	\N	4417.61	expense	2025-03-18 00:00:00	Fuel Station	f	\N	4	25	2025-03-18 00:00:00
675	13	\N	7	\N	1484.24	expense	2025-02-24 00:00:00	Fuel Station	f	17	\N	35	2025-02-24 00:00:00
676	13	20	\N	3	2404.63	deposit	2025-04-14 00:00:00	Online Deposit	f	\N	\N	40	2025-04-14 00:00:00
677	13	14	\N	\N	2636.46	expense	2025-01-23 00:00:00	Coffee Shop	f	\N	2	42	2025-01-23 00:00:00
678	13	\N	1	\N	1367.28	deposit	2025-04-05 00:00:00	Cash Deposit at Branch	f	\N	\N	9	2025-04-05 00:00:00
679	13	37	\N	5	3545.35	fee	2025-03-07 00:00:00	ATM Withdrawal Fee	f	\N	\N	36	2025-03-07 00:00:00
680	13	46	\N	\N	4099.28	deposit	2025-03-15 00:00:00	Cheque Deposit	f	\N	\N	25	2025-03-15 00:00:00
681	13	25	\N	\N	2303.06	expense	2025-03-09 00:00:00	Public Transport Fare	f	\N	\N	39	2025-03-09 00:00:00
682	13	20	\N	\N	813.33	expense	2025-06-03 00:00:00	Monthly Rent Payment	f	\N	3	45	2025-06-03 00:00:00
683	13	7	\N	1	3665.17	deposit	2025-04-06 00:00:00	Cheque Deposit	f	12	\N	16	2025-04-06 00:00:00
684	13	10	\N	5	2857.27	withdrawal	2025-06-08 00:00:00	Cash Removed from Account	f	\N	\N	47	2025-06-08 00:00:00
685	13	15	\N	1	1165.19	expense	2025-03-12 00:00:00	Grocery Store Purchase	f	\N	2	27	2025-03-12 00:00:00
686	13	\N	2	\N	1541.61	withdrawal	2025-04-24 00:00:00	Cash Removed from Account	f	\N	\N	11	2025-04-24 00:00:00
687	13	\N	6	\N	4836.25	deposit	2025-03-02 00:00:00	Online Deposit	f	\N	\N	17	2025-03-02 00:00:00
688	13	43	\N	9	1306.79	expense	2025-05-11 00:00:00	Public Transport Fare	f	\N	\N	20	2025-05-11 00:00:00
689	13	1	\N	5	2454.09	expense	2025-05-21 00:00:00	Streaming Subscription	f	\N	\N	26	2025-05-21 00:00:00
690	13	30	\N	\N	131.54	fee	2025-03-11 00:00:00	Service Charge	f	\N	4	23	2025-03-11 00:00:00
691	13	50	\N	5	1702.17	fee	2025-04-20 00:00:00	Service Charge	f	3	3	11	2025-04-20 00:00:00
692	13	49	\N	\N	1476.03	expense	2025-02-19 00:00:00	Utility Bill Payment	f	\N	\N	46	2025-02-19 00:00:00
693	13	16	\N	9	1967.42	fee	2025-03-13 00:00:00	Monthly Account Fee	f	\N	\N	27	2025-03-13 00:00:00
694	13	38	\N	\N	1901.34	transfer	2025-03-18 00:00:00	Transfer from Checking	f	9	\N	19	2025-03-18 00:00:00
695	13	31	\N	\N	389.74	income	2025-05-02 00:00:00	Refund Processed	f	\N	\N	42	2025-05-02 00:00:00
696	13	11	\N	9	2578.12	fee	2025-01-12 00:00:00	ATM Withdrawal Fee	f	22	\N	23	2025-01-12 00:00:00
697	13	32	\N	\N	4185.49	fee	2025-06-13 00:00:00	Monthly Account Fee	f	\N	\N	3	2025-06-13 00:00:00
698	13	\N	9	9	455.50	transfer	2025-01-22 00:00:00	Transfer from Checking	f	1	\N	35	2025-01-22 00:00:00
699	13	\N	9	6	356.06	fee	2025-01-07 00:00:00	Monthly Account Fee	f	\N	\N	39	2025-01-07 00:00:00
700	13	19	\N	\N	3994.13	deposit	2025-03-20 00:00:00	Cash Deposit at Branch	f	\N	\N	29	2025-03-20 00:00:00
701	13	26	\N	\N	3626.68	withdrawal	2025-02-18 00:00:00	ATM Cash Withdrawal	f	22	\N	12	2025-02-18 00:00:00
702	13	\N	8	1	2092.05	expense	2025-03-20 00:00:00	Mobile Data Recharge	f	18	\N	37	2025-03-20 00:00:00
703	13	6	\N	\N	3834.14	transfer	2025-02-20 00:00:00	Bank Internal Transfer	f	\N	\N	1	2025-02-20 00:00:00
704	13	43	\N	8	3857.84	transfer	2025-02-23 00:00:00	Transfer to Savings	f	\N	5	29	2025-02-23 00:00:00
705	13	3	\N	\N	1205.31	expense	2025-05-02 00:00:00	Fuel Station	f	10	\N	47	2025-05-02 00:00:00
706	13	12	\N	\N	1976.74	income	2025-04-17 00:00:00	Freelance Project Payment	f	\N	4	39	2025-04-17 00:00:00
707	13	\N	11	\N	1415.74	transfer	2025-06-18 00:00:00	Transfer from Checking	t	\N	\N	45	2025-06-18 00:00:00
708	13	\N	11	\N	3146.47	transfer	2025-06-04 00:00:00	Bank Internal Transfer	f	8	\N	44	2025-06-04 00:00:00
709	13	8	\N	3	1433.56	deposit	2025-03-27 00:00:00	Cash Deposit at Branch	f	\N	\N	50	2025-03-27 00:00:00
710	13	35	\N	2	3222.30	expense	2025-06-30 00:00:00	Utility Bill Payment	f	23	\N	37	2025-06-30 00:00:00
711	13	\N	8	\N	3399.98	fee	2025-06-15 00:00:00	Service Charge	t	17	\N	36	2025-06-15 00:00:00
713	13	\N	12	9	3833.49	withdrawal	2025-02-27 00:00:00	ATM Cash Withdrawal	f	\N	\N	16	2025-02-27 00:00:00
714	13	\N	3	3	659.55	transfer	2025-03-03 00:00:00	Transfer from Checking	f	\N	3	0	2025-03-03 00:00:00
715	13	11	\N	2	4638.29	transfer	2025-01-17 00:00:00	Transfer to Savings	t	\N	\N	5	2025-01-17 00:00:00
716	13	7	\N	7	4754.83	transfer	2025-05-10 00:00:00	Bank Internal Transfer	f	\N	\N	31	2025-05-10 00:00:00
717	13	26	\N	2	2484.92	deposit	2025-03-08 00:00:00	Cheque Deposit	f	\N	\N	9	2025-03-08 00:00:00
718	13	29	\N	4	1072.30	withdrawal	2025-02-19 00:00:00	Cash Removed from Account	f	15	4	9	2025-02-19 00:00:00
719	13	17	\N	\N	1702.77	expense	2025-04-26 00:00:00	Mobile Data Recharge	f	\N	1	21	2025-04-26 00:00:00
720	13	26	\N	4	614.68	expense	2025-04-06 00:00:00	Restaurant Dinner	f	\N	\N	2	2025-04-06 00:00:00
721	13	15	\N	\N	126.37	fee	2025-03-22 00:00:00	Service Charge	f	9	\N	16	2025-03-22 00:00:00
722	13	43	\N	\N	2212.71	income	2025-06-19 00:00:00	Freelance Project Payment	f	11	\N	49	2025-06-19 00:00:00
723	13	20	\N	4	4481.27	deposit	2025-06-01 00:00:00	Cash Deposit at Branch	f	\N	\N	6	2025-06-01 00:00:00
724	13	27	\N	6	4549.13	income	2025-05-17 00:00:00	Dividend Payment	t	\N	\N	1	2025-05-17 00:00:00
725	13	\N	10	\N	823.19	income	2025-01-17 00:00:00	Salary Payment	t	\N	5	32	2025-01-17 00:00:00
726	13	48	\N	\N	2237.42	expense	2025-06-27 00:00:00	Grocery Store Purchase	f	17	\N	39	2025-06-27 00:00:00
727	13	40	\N	4	2460.65	withdrawal	2025-04-01 00:00:00	ATM Cash Withdrawal	f	\N	\N	16	2025-04-01 00:00:00
728	13	2	\N	3	653.96	fee	2025-03-25 00:00:00	Monthly Account Fee	t	10	\N	23	2025-03-25 00:00:00
729	13	10	\N	\N	4857.22	income	2025-05-05 00:00:00	Freelance Project Payment	f	\N	\N	9	2025-05-05 00:00:00
730	13	\N	5	\N	460.11	deposit	2025-04-05 00:00:00	Cash Deposit at Branch	f	4	\N	47	2025-04-05 00:00:00
731	13	\N	7	\N	2150.09	income	2025-05-20 00:00:00	Refund Processed	f	\N	5	49	2025-05-20 00:00:00
732	13	44	\N	\N	873.16	transfer	2025-06-02 00:00:00	Transfer from Checking	f	4	\N	44	2025-06-02 00:00:00
733	13	25	\N	2	2600.65	withdrawal	2025-04-12 00:00:00	ATM Cash Withdrawal	f	12	\N	12	2025-04-12 00:00:00
734	13	23	\N	\N	2101.32	deposit	2025-05-24 00:00:00	Online Deposit	f	22	\N	6	2025-05-24 00:00:00
735	14	35	\N	6	2609.59	fee	2025-02-13 00:00:00	ATM Withdrawal Fee	f	\N	\N	32	2025-02-13 00:00:00
736	14	22	\N	8	3806.24	deposit	2025-02-22 00:00:00	Online Deposit	f	\N	\N	13	2025-02-22 00:00:00
737	14	49	\N	4	1533.28	withdrawal	2025-04-29 00:00:00	ATM Cash Withdrawal	f	5	\N	44	2025-04-29 00:00:00
738	14	\N	2	\N	2680.82	transfer	2025-03-09 00:00:00	Transfer from Checking	f	\N	\N	40	2025-03-09 00:00:00
739	14	27	\N	9	3005.14	expense	2025-05-24 00:00:00	Restaurant Dinner	f	\N	\N	30	2025-05-24 00:00:00
740	14	35	\N	\N	3863.40	withdrawal	2025-02-26 00:00:00	ATM Cash Withdrawal	f	\N	\N	5	2025-02-26 00:00:00
741	14	\N	7	6	4311.21	income	2025-02-27 00:00:00	Salary Payment	f	21	\N	42	2025-02-27 00:00:00
742	14	42	\N	1	1188.71	expense	2025-06-27 00:00:00	Restaurant Dinner	f	\N	\N	8	2025-06-27 00:00:00
743	14	\N	8	4	198.82	transfer	2025-03-26 00:00:00	Transfer to Savings	f	\N	5	29	2025-03-26 00:00:00
744	14	51	\N	\N	2107.82	deposit	2025-05-23 00:00:00	Cash Deposit at Branch	f	\N	\N	0	2025-05-23 00:00:00
745	14	20	\N	7	2611.04	expense	2025-05-27 00:00:00	Streaming Subscription	f	23	\N	7	2025-05-27 00:00:00
746	14	21	\N	\N	842.11	withdrawal	2025-06-24 00:00:00	ATM Cash Withdrawal	f	\N	1	6	2025-06-24 00:00:00
747	14	43	\N	\N	4589.02	withdrawal	2025-03-26 00:00:00	ATM Cash Withdrawal	t	\N	\N	47	2025-03-26 00:00:00
748	14	\N	1	\N	2725.41	expense	2025-04-28 00:00:00	Grocery Store Purchase	f	\N	\N	22	2025-04-28 00:00:00
749	14	\N	11	1	2695.90	fee	2025-05-29 00:00:00	ATM Withdrawal Fee	f	\N	\N	44	2025-05-29 00:00:00
750	14	12	\N	5	4168.53	transfer	2025-05-06 00:00:00	Bank Internal Transfer	t	\N	\N	37	2025-05-06 00:00:00
751	14	10	\N	\N	4361.85	withdrawal	2025-06-08 00:00:00	Cash Removed from Account	f	11	1	30	2025-06-08 00:00:00
752	14	22	\N	\N	114.51	fee	2025-06-03 00:00:00	ATM Withdrawal Fee	f	\N	\N	15	2025-06-03 00:00:00
753	14	\N	13	\N	262.32	deposit	2025-01-06 00:00:00	Cheque Deposit	f	\N	\N	18	2025-01-06 00:00:00
754	14	37	\N	\N	4704.56	transfer	2025-05-25 00:00:00	Transfer from Checking	f	\N	\N	48	2025-05-25 00:00:00
755	14	\N	11	9	4211.10	withdrawal	2025-05-05 00:00:00	ATM Cash Withdrawal	t	13	\N	43	2025-05-05 00:00:00
756	14	23	\N	\N	2389.16	deposit	2025-01-13 00:00:00	Online Deposit	f	\N	\N	14	2025-01-13 00:00:00
757	14	20	\N	5	889.20	transfer	2025-03-29 00:00:00	Transfer from Checking	f	\N	\N	5	2025-03-29 00:00:00
758	14	45	\N	5	4182.24	income	2025-01-27 00:00:00	Dividend Payment	f	\N	\N	43	2025-01-27 00:00:00
759	14	\N	11	6	2501.12	fee	2025-01-14 00:00:00	Service Charge	f	\N	3	33	2025-01-14 00:00:00
760	14	35	\N	7	1240.26	withdrawal	2025-04-17 00:00:00	Cash Removed from Account	f	\N	\N	25	2025-04-17 00:00:00
761	14	48	\N	7	2735.36	expense	2025-06-20 00:00:00	Monthly Rent Payment	f	\N	\N	34	2025-06-20 00:00:00
762	14	\N	11	9	2341.33	withdrawal	2025-03-11 00:00:00	Cash Removed from Account	f	\N	\N	46	2025-03-11 00:00:00
763	14	12	\N	2	1710.05	expense	2025-01-08 00:00:00	Restaurant Dinner	f	\N	\N	12	2025-01-08 00:00:00
764	14	\N	13	1	1776.51	transfer	2025-03-08 00:00:00	Bank Internal Transfer	f	\N	1	18	2025-03-08 00:00:00
765	14	45	\N	3	138.63	deposit	2025-05-05 00:00:00	Online Deposit	f	\N	\N	33	2025-05-05 00:00:00
766	14	\N	3	\N	3028.69	income	2025-03-15 00:00:00	Refund Processed	f	\N	\N	21	2025-03-15 00:00:00
767	14	32	\N	9	2242.56	transfer	2025-01-28 00:00:00	Bank Internal Transfer	f	\N	\N	0	2025-01-28 00:00:00
768	14	10	\N	6	1788.84	income	2025-01-08 00:00:00	Interest Income	t	\N	\N	12	2025-01-08 00:00:00
769	14	\N	10	\N	1507.20	deposit	2025-06-08 00:00:00	Cash Deposit at Branch	f	\N	\N	13	2025-06-08 00:00:00
770	14	\N	13	7	1460.38	income	2025-05-03 00:00:00	Freelance Project Payment	f	\N	\N	43	2025-05-03 00:00:00
771	14	39	\N	\N	59.37	fee	2025-06-29 00:00:00	Monthly Account Fee	f	\N	\N	27	2025-06-29 00:00:00
772	14	48	\N	\N	3013.71	fee	2025-02-03 00:00:00	Service Charge	f	\N	\N	17	2025-02-03 00:00:00
773	14	31	\N	3	4948.18	income	2025-04-22 00:00:00	Interest Income	f	\N	5	31	2025-04-22 00:00:00
774	14	38	\N	5	2498.11	withdrawal	2025-04-14 00:00:00	Cash Removed from Account	f	\N	\N	34	2025-04-14 00:00:00
775	14	9	\N	9	1119.70	fee	2025-03-03 00:00:00	Monthly Account Fee	t	10	\N	47	2025-03-03 00:00:00
776	14	16	\N	4	2575.56	expense	2025-02-06 00:00:00	Monthly Rent Payment	f	\N	\N	14	2025-02-06 00:00:00
777	14	41	\N	9	1407.25	fee	2025-01-14 00:00:00	Service Charge	f	\N	2	40	2025-01-14 00:00:00
778	14	23	\N	6	782.74	transfer	2025-01-17 00:00:00	Transfer from Checking	f	7	\N	17	2025-01-17 00:00:00
779	14	18	\N	2	1836.00	fee	2025-03-17 00:00:00	ATM Withdrawal Fee	f	3	3	1	2025-03-17 00:00:00
780	14	47	\N	5	2243.41	deposit	2025-04-27 00:00:00	Cash Deposit at Branch	f	20	\N	36	2025-04-27 00:00:00
781	14	\N	13	\N	4078.27	transfer	2025-04-26 00:00:00	Transfer from Checking	f	5	4	9	2025-04-26 00:00:00
782	14	19	\N	\N	1421.52	expense	2025-03-20 00:00:00	Streaming Subscription	t	\N	\N	10	2025-03-20 00:00:00
783	14	\N	3	\N	1813.92	withdrawal	2025-04-16 00:00:00	ATM Cash Withdrawal	f	\N	\N	35	2025-04-16 00:00:00
784	14	23	\N	\N	4113.03	transfer	2025-01-24 00:00:00	Bank Internal Transfer	f	\N	\N	41	2025-01-24 00:00:00
785	14	\N	3	\N	3269.90	fee	2025-02-05 00:00:00	Monthly Account Fee	f	\N	\N	45	2025-02-05 00:00:00
786	14	42	\N	9	2805.20	income	2025-01-23 00:00:00	Freelance Project Payment	f	\N	\N	5	2025-01-23 00:00:00
787	14	\N	1	6	3500.52	income	2025-05-22 00:00:00	Freelance Project Payment	f	\N	\N	21	2025-05-22 00:00:00
788	14	10	\N	\N	1291.98	transfer	2025-06-01 00:00:00	Transfer to Savings	f	11	\N	31	2025-06-01 00:00:00
789	14	50	\N	5	1670.22	transfer	2025-03-17 00:00:00	Bank Internal Transfer	f	\N	\N	15	2025-03-17 00:00:00
790	14	25	\N	\N	2333.39	withdrawal	2025-06-16 00:00:00	Cash Removed from Account	f	\N	\N	34	2025-06-16 00:00:00
791	14	49	\N	\N	390.80	expense	2025-03-29 00:00:00	Streaming Subscription	f	\N	\N	1	2025-03-29 00:00:00
792	14	\N	13	9	3958.98	transfer	2025-03-19 00:00:00	Transfer from Checking	f	5	\N	31	2025-03-19 00:00:00
793	14	3	\N	5	2545.29	fee	2025-03-02 00:00:00	Service Charge	f	\N	2	50	2025-03-02 00:00:00
794	14	51	\N	5	3206.36	withdrawal	2025-01-11 00:00:00	Cash Removed from Account	f	\N	\N	33	2025-01-11 00:00:00
795	15	46	\N	6	1450.23	transfer	2025-04-04 00:00:00	Transfer from Checking	f	\N	\N	16	2025-04-04 00:00:00
796	15	37	\N	4	4238.07	withdrawal	2025-05-20 00:00:00	ATM Cash Withdrawal	f	\N	\N	12	2025-05-20 00:00:00
797	15	19	\N	3	3444.65	expense	2025-03-06 00:00:00	Grocery Store Purchase	f	12	\N	26	2025-03-06 00:00:00
798	15	7	\N	\N	1756.98	deposit	2025-02-19 00:00:00	Cheque Deposit	f	\N	5	38	2025-02-19 00:00:00
799	15	\N	13	\N	2411.40	withdrawal	2025-04-15 00:00:00	Cash Removed from Account	f	\N	\N	25	2025-04-15 00:00:00
800	15	43	\N	\N	3084.74	expense	2025-05-28 00:00:00	Grocery Store Purchase	f	18	\N	22	2025-05-28 00:00:00
801	15	\N	9	\N	3073.31	deposit	2025-01-26 00:00:00	Cash Deposit at Branch	f	20	\N	32	2025-01-26 00:00:00
802	15	37	\N	7	1135.30	fee	2025-03-05 00:00:00	Monthly Account Fee	f	8	\N	30	2025-03-05 00:00:00
803	15	45	\N	\N	3730.94	transfer	2025-05-03 00:00:00	Transfer to Savings	f	4	\N	23	2025-05-03 00:00:00
804	15	36	\N	4	416.90	fee	2025-01-23 00:00:00	ATM Withdrawal Fee	f	\N	1	18	2025-01-23 00:00:00
805	15	21	\N	\N	4374.00	withdrawal	2025-02-14 00:00:00	ATM Cash Withdrawal	f	\N	\N	45	2025-02-14 00:00:00
806	15	\N	5	7	4634.79	deposit	2025-05-24 00:00:00	Online Deposit	f	\N	\N	15	2025-05-24 00:00:00
807	15	11	\N	3	2151.67	expense	2025-02-13 00:00:00	Utility Bill Payment	f	\N	\N	8	2025-02-13 00:00:00
808	15	51	\N	\N	469.49	transfer	2025-03-31 00:00:00	Transfer to Savings	f	18	\N	11	2025-03-31 00:00:00
809	15	33	\N	3	3586.18	withdrawal	2025-04-29 00:00:00	ATM Cash Withdrawal	f	9	\N	49	2025-04-29 00:00:00
810	15	38	\N	\N	646.34	fee	2025-04-15 00:00:00	Service Charge	f	\N	\N	47	2025-04-15 00:00:00
811	15	12	\N	2	4162.40	transfer	2025-04-29 00:00:00	Transfer from Checking	f	17	2	26	2025-04-29 00:00:00
812	15	1	\N	\N	229.71	income	2025-06-21 00:00:00	Salary Payment	f	5	\N	4	2025-06-21 00:00:00
813	15	26	\N	\N	1565.10	expense	2025-02-22 00:00:00	Mobile Data Recharge	f	\N	2	5	2025-02-22 00:00:00
814	15	20	\N	2	4760.17	fee	2025-06-03 00:00:00	Monthly Account Fee	t	\N	1	8	2025-06-03 00:00:00
815	15	47	\N	\N	1075.34	transfer	2025-04-27 00:00:00	Transfer to Savings	f	12	\N	19	2025-04-27 00:00:00
816	15	19	\N	4	4183.19	expense	2025-04-05 00:00:00	Public Transport Fare	f	\N	4	5	2025-04-05 00:00:00
817	15	5	\N	6	1678.81	expense	2025-01-23 00:00:00	Coffee Shop	f	\N	\N	9	2025-01-23 00:00:00
818	15	\N	2	3	3754.82	income	2025-03-11 00:00:00	Dividend Payment	f	\N	5	27	2025-03-11 00:00:00
819	15	15	\N	6	3220.40	deposit	2025-03-20 00:00:00	Cash Deposit at Branch	f	\N	\N	30	2025-03-20 00:00:00
820	15	7	\N	\N	2312.60	transfer	2025-05-04 00:00:00	Transfer to Savings	f	17	\N	44	2025-05-04 00:00:00
821	15	\N	12	8	384.61	income	2025-06-11 00:00:00	Freelance Project Payment	f	\N	\N	31	2025-06-11 00:00:00
822	15	\N	9	\N	3528.66	withdrawal	2025-04-16 00:00:00	ATM Cash Withdrawal	f	\N	3	24	2025-04-16 00:00:00
823	15	\N	3	6	100.10	income	2025-06-08 00:00:00	Freelance Project Payment	f	\N	\N	19	2025-06-08 00:00:00
824	15	\N	1	\N	3169.56	transfer	2025-04-11 00:00:00	Bank Internal Transfer	f	\N	1	20	2025-04-11 00:00:00
825	15	\N	1	\N	1655.22	income	2025-02-10 00:00:00	Bonus Received	f	\N	\N	29	2025-02-10 00:00:00
826	16	40	\N	\N	3822.93	withdrawal	2025-05-18 00:00:00	ATM Cash Withdrawal	f	\N	\N	3	2025-05-18 00:00:00
827	16	\N	3	2	1992.57	deposit	2025-04-29 00:00:00	Cash Deposit at Branch	f	3	4	49	2025-04-29 00:00:00
828	16	7	\N	6	2651.16	expense	2025-02-23 00:00:00	Mobile Data Recharge	f	\N	\N	50	2025-02-23 00:00:00
829	16	22	\N	\N	2391.71	income	2025-02-01 00:00:00	Refund Processed	t	\N	\N	39	2025-02-01 00:00:00
830	16	34	\N	\N	1244.81	income	2025-01-11 00:00:00	Bonus Received	f	8	3	33	2025-01-11 00:00:00
831	16	34	\N	\N	4564.72	fee	2025-01-24 00:00:00	Monthly Account Fee	f	15	5	40	2025-01-24 00:00:00
832	16	29	\N	8	2094.35	fee	2025-05-05 00:00:00	ATM Withdrawal Fee	t	\N	\N	36	2025-05-05 00:00:00
833	16	2	\N	8	825.57	income	2025-05-07 00:00:00	Salary Payment	f	\N	\N	27	2025-05-07 00:00:00
834	16	10	\N	\N	633.33	withdrawal	2025-03-29 00:00:00	Cash Removed from Account	f	\N	\N	14	2025-03-29 00:00:00
835	16	\N	4	\N	601.18	expense	2025-01-20 00:00:00	Mobile Data Recharge	f	20	\N	35	2025-01-20 00:00:00
836	16	\N	6	\N	2263.58	expense	2025-06-07 00:00:00	Fuel Station	f	16	\N	49	2025-06-07 00:00:00
837	16	15	\N	\N	4610.36	fee	2025-02-28 00:00:00	ATM Withdrawal Fee	f	\N	\N	26	2025-02-28 00:00:00
838	16	\N	11	4	3062.06	expense	2025-03-28 00:00:00	Utility Bill Payment	f	\N	\N	25	2025-03-28 00:00:00
839	16	12	\N	1	2804.46	fee	2025-06-30 00:00:00	Monthly Account Fee	f	\N	5	33	2025-06-30 00:00:00
840	16	\N	2	\N	4866.63	fee	2025-06-04 00:00:00	Monthly Account Fee	f	17	\N	7	2025-06-04 00:00:00
841	16	27	\N	\N	1652.83	deposit	2025-05-27 00:00:00	Online Deposit	f	4	3	47	2025-05-27 00:00:00
842	16	42	\N	3	1801.24	expense	2025-01-02 00:00:00	Fuel Station	f	\N	4	20	2025-01-02 00:00:00
843	16	\N	7	\N	3882.97	fee	2025-03-11 00:00:00	Service Charge	f	15	\N	47	2025-03-11 00:00:00
844	16	19	\N	6	2933.61	income	2025-06-08 00:00:00	Interest Income	f	1	\N	49	2025-06-08 00:00:00
845	16	20	\N	8	4923.24	withdrawal	2025-06-17 00:00:00	Cash Removed from Account	f	17	3	30	2025-06-17 00:00:00
846	16	\N	8	\N	3313.42	expense	2025-02-03 00:00:00	Mobile Data Recharge	f	\N	2	38	2025-02-03 00:00:00
847	16	\N	3	\N	3552.25	withdrawal	2025-01-10 00:00:00	ATM Cash Withdrawal	f	18	\N	1	2025-01-10 00:00:00
848	16	6	\N	9	450.02	fee	2025-05-21 00:00:00	Monthly Account Fee	f	\N	\N	23	2025-05-21 00:00:00
849	16	31	\N	7	2981.53	fee	2025-04-27 00:00:00	Monthly Account Fee	t	\N	\N	39	2025-04-27 00:00:00
850	16	15	\N	9	3382.18	expense	2025-05-21 00:00:00	Restaurant Dinner	f	22	\N	24	2025-05-21 00:00:00
851	16	42	\N	2	2000.22	withdrawal	2025-03-13 00:00:00	ATM Cash Withdrawal	f	5	\N	22	2025-03-13 00:00:00
852	16	25	\N	5	3627.19	transfer	2025-02-05 00:00:00	Transfer to Savings	t	19	\N	9	2025-02-05 00:00:00
853	16	21	\N	4	2586.90	withdrawal	2025-05-14 00:00:00	ATM Cash Withdrawal	f	\N	\N	24	2025-05-14 00:00:00
854	16	\N	6	6	4986.36	withdrawal	2025-04-24 00:00:00	Cash Removed from Account	f	\N	\N	17	2025-04-24 00:00:00
855	16	20	\N	\N	2421.47	transfer	2025-05-27 00:00:00	Transfer to Savings	f	\N	\N	17	2025-05-27 00:00:00
856	16	11	\N	5	1459.72	fee	2025-01-30 00:00:00	ATM Withdrawal Fee	f	16	1	21	2025-01-30 00:00:00
857	16	\N	12	\N	1572.85	expense	2025-06-21 00:00:00	Coffee Shop	f	\N	5	22	2025-06-21 00:00:00
858	16	\N	6	9	3194.14	transfer	2025-03-30 00:00:00	Transfer from Checking	f	\N	\N	34	2025-03-30 00:00:00
859	16	\N	9	7	2331.01	fee	2025-02-17 00:00:00	ATM Withdrawal Fee	f	20	\N	48	2025-02-17 00:00:00
860	16	50	\N	\N	1524.93	transfer	2025-03-26 00:00:00	Bank Internal Transfer	f	\N	\N	38	2025-03-26 00:00:00
861	16	14	\N	\N	1818.52	withdrawal	2025-02-18 00:00:00	ATM Cash Withdrawal	t	3	\N	43	2025-02-18 00:00:00
862	16	38	\N	3	1996.68	deposit	2025-05-01 00:00:00	Cash Deposit at Branch	f	\N	\N	46	2025-05-01 00:00:00
863	16	18	\N	8	2788.67	income	2025-01-02 00:00:00	Salary Payment	f	11	\N	7	2025-01-02 00:00:00
864	16	\N	6	6	4036.28	fee	2025-04-16 00:00:00	Monthly Account Fee	f	\N	\N	5	2025-04-16 00:00:00
865	16	49	\N	6	1567.96	fee	2025-02-23 00:00:00	Monthly Account Fee	f	\N	\N	31	2025-02-23 00:00:00
866	16	5	\N	4	3624.19	income	2025-04-16 00:00:00	Freelance Project Payment	t	\N	\N	22	2025-04-16 00:00:00
867	16	13	\N	6	3801.58	income	2025-01-30 00:00:00	Refund Processed	f	\N	\N	11	2025-01-30 00:00:00
868	16	32	\N	\N	987.12	fee	2025-05-26 00:00:00	ATM Withdrawal Fee	f	\N	4	0	2025-05-26 00:00:00
869	16	25	\N	6	2330.83	deposit	2025-05-23 00:00:00	Online Deposit	f	9	\N	29	2025-05-23 00:00:00
870	16	29	\N	2	3286.27	withdrawal	2025-03-27 00:00:00	Cash Removed from Account	f	\N	\N	43	2025-03-27 00:00:00
871	16	21	\N	2	2970.90	transfer	2025-03-28 00:00:00	Transfer to Savings	f	\N	\N	35	2025-03-28 00:00:00
872	16	\N	6	\N	515.85	withdrawal	2025-06-18 00:00:00	Cash Removed from Account	f	\N	4	34	2025-06-18 00:00:00
873	16	19	\N	\N	2276.46	transfer	2025-06-09 00:00:00	Bank Internal Transfer	f	\N	\N	12	2025-06-09 00:00:00
874	16	31	\N	\N	1489.83	income	2025-03-19 00:00:00	Refund Processed	f	\N	\N	0	2025-03-19 00:00:00
875	16	12	\N	3	287.53	fee	2025-02-20 00:00:00	ATM Withdrawal Fee	f	3	4	47	2025-02-20 00:00:00
876	16	8	\N	2	1749.91	deposit	2025-06-21 00:00:00	Online Deposit	f	11	\N	22	2025-06-21 00:00:00
877	16	\N	11	\N	4762.38	transfer	2025-05-26 00:00:00	Transfer from Checking	f	\N	3	20	2025-05-26 00:00:00
878	16	\N	10	6	3094.26	expense	2025-05-11 00:00:00	Utility Bill Payment	t	11	\N	27	2025-05-11 00:00:00
879	16	20	\N	\N	1796.09	expense	2025-05-04 00:00:00	Mobile Data Recharge	f	\N	\N	22	2025-05-04 00:00:00
880	16	18	\N	6	4815.26	expense	2025-03-18 00:00:00	Monthly Rent Payment	f	19	\N	11	2025-03-18 00:00:00
881	16	29	\N	\N	1652.23	income	2025-03-06 00:00:00	Interest Income	f	\N	\N	18	2025-03-06 00:00:00
882	16	29	\N	\N	749.45	income	2025-02-18 00:00:00	Bonus Received	f	22	2	32	2025-02-18 00:00:00
883	16	34	\N	\N	682.84	transfer	2025-01-23 00:00:00	Transfer to Savings	t	17	\N	6	2025-01-23 00:00:00
884	17	7	\N	1	740.99	fee	2025-05-19 00:00:00	Service Charge	f	\N	\N	9	2025-05-19 00:00:00
885	17	2	\N	3	2024.54	income	2025-05-29 00:00:00	Dividend Payment	t	5	\N	29	2025-05-29 00:00:00
886	17	3	\N	\N	2362.93	deposit	2025-03-01 00:00:00	Cash Deposit at Branch	t	2	\N	25	2025-03-01 00:00:00
887	17	\N	7	3	822.74	withdrawal	2025-02-26 00:00:00	ATM Cash Withdrawal	f	21	\N	5	2025-02-26 00:00:00
888	17	15	\N	8	3299.44	expense	2025-05-06 00:00:00	Grocery Store Purchase	f	16	\N	9	2025-05-06 00:00:00
889	17	47	\N	8	2289.23	income	2025-06-20 00:00:00	Bonus Received	f	7	\N	27	2025-06-20 00:00:00
890	17	\N	3	1	2549.47	transfer	2025-04-15 00:00:00	Transfer to Savings	f	\N	\N	11	2025-04-15 00:00:00
891	17	48	\N	\N	4807.17	transfer	2025-06-06 00:00:00	Transfer from Checking	f	\N	\N	27	2025-06-06 00:00:00
892	17	\N	12	8	2972.88	fee	2025-01-26 00:00:00	Service Charge	f	\N	\N	25	2025-01-26 00:00:00
893	17	20	\N	\N	4163.69	expense	2025-06-27 00:00:00	Clothing Store Purchase	f	23	1	47	2025-06-27 00:00:00
894	17	51	\N	3	655.04	income	2025-04-08 00:00:00	Dividend Payment	t	\N	\N	43	2025-04-08 00:00:00
895	17	\N	13	\N	1710.43	deposit	2025-04-10 00:00:00	Online Deposit	f	8	\N	22	2025-04-10 00:00:00
896	17	13	\N	\N	3930.78	transfer	2025-05-14 00:00:00	Transfer from Checking	f	\N	\N	11	2025-05-14 00:00:00
897	17	13	\N	\N	4403.43	income	2025-04-14 00:00:00	Freelance Project Payment	f	\N	\N	27	2025-04-14 00:00:00
898	17	30	\N	\N	4506.46	withdrawal	2025-01-16 00:00:00	Cash Removed from Account	f	17	\N	23	2025-01-16 00:00:00
899	17	46	\N	4	4295.23	income	2025-04-11 00:00:00	Freelance Project Payment	t	4	\N	3	2025-04-11 00:00:00
900	17	49	\N	9	4996.75	income	2025-04-28 00:00:00	Dividend Payment	f	\N	\N	39	2025-04-28 00:00:00
901	17	\N	5	5	4310.11	fee	2025-06-03 00:00:00	Service Charge	f	\N	\N	18	2025-06-03 00:00:00
902	17	8	\N	\N	4833.32	transfer	2025-03-22 00:00:00	Transfer to Savings	f	15	\N	34	2025-03-22 00:00:00
903	17	19	\N	\N	1861.24	income	2025-03-10 00:00:00	Bonus Received	f	\N	\N	17	2025-03-10 00:00:00
904	17	27	\N	\N	2073.28	income	2025-04-06 00:00:00	Interest Income	f	4	\N	26	2025-04-06 00:00:00
905	17	\N	13	9	3442.69	deposit	2025-01-05 00:00:00	Cheque Deposit	f	\N	\N	41	2025-01-05 00:00:00
906	17	23	\N	6	1476.71	withdrawal	2025-02-11 00:00:00	Cash Removed from Account	f	\N	\N	14	2025-02-11 00:00:00
907	17	51	\N	\N	73.32	fee	2025-03-03 00:00:00	Service Charge	t	7	\N	27	2025-03-03 00:00:00
908	17	\N	2	\N	2873.76	deposit	2025-02-09 00:00:00	Online Deposit	f	\N	\N	46	2025-02-09 00:00:00
909	17	50	\N	1	324.20	deposit	2025-06-13 00:00:00	Online Deposit	f	13	\N	23	2025-06-13 00:00:00
910	17	33	\N	\N	4132.40	transfer	2025-05-22 00:00:00	Bank Internal Transfer	f	\N	\N	40	2025-05-22 00:00:00
911	17	49	\N	7	1631.09	expense	2025-05-17 00:00:00	Monthly Rent Payment	f	\N	\N	40	2025-05-17 00:00:00
912	17	\N	7	\N	1526.60	fee	2025-06-08 00:00:00	Service Charge	f	\N	\N	45	2025-06-08 00:00:00
913	17	6	\N	\N	1348.00	income	2025-06-28 00:00:00	Bonus Received	f	\N	\N	45	2025-06-28 00:00:00
914	17	3	\N	\N	1653.66	transfer	2025-05-19 00:00:00	Bank Internal Transfer	f	\N	\N	25	2025-05-19 00:00:00
915	17	1	\N	6	4999.80	withdrawal	2025-05-05 00:00:00	Cash Removed from Account	f	\N	5	27	2025-05-05 00:00:00
916	17	14	\N	\N	1731.62	deposit	2025-04-25 00:00:00	Online Deposit	t	\N	\N	45	2025-04-25 00:00:00
917	18	27	\N	5	4657.64	withdrawal	2025-01-03 00:00:00	Cash Removed from Account	f	\N	\N	4	2025-01-03 00:00:00
918	18	35	\N	6	2421.76	expense	2025-01-20 00:00:00	Streaming Subscription	f	\N	2	50	2025-01-20 00:00:00
919	18	47	\N	6	250.78	expense	2025-06-17 00:00:00	Utility Bill Payment	f	\N	\N	13	2025-06-17 00:00:00
920	18	17	\N	\N	3958.31	withdrawal	2025-04-27 00:00:00	ATM Cash Withdrawal	f	\N	\N	19	2025-04-27 00:00:00
921	18	28	\N	5	24.11	withdrawal	2025-06-26 00:00:00	ATM Cash Withdrawal	f	\N	\N	8	2025-06-26 00:00:00
922	18	\N	4	2	3142.84	income	2025-01-20 00:00:00	Salary Payment	f	\N	2	37	2025-01-20 00:00:00
923	18	\N	1	3	3485.89	fee	2025-02-13 00:00:00	ATM Withdrawal Fee	f	\N	\N	28	2025-02-13 00:00:00
924	18	20	\N	\N	2619.82	transfer	2025-02-11 00:00:00	Transfer to Savings	f	19	\N	19	2025-02-11 00:00:00
925	18	11	\N	\N	1071.70	withdrawal	2025-01-07 00:00:00	ATM Cash Withdrawal	f	\N	\N	36	2025-01-07 00:00:00
926	18	\N	8	\N	4795.20	withdrawal	2025-01-12 00:00:00	ATM Cash Withdrawal	f	\N	\N	28	2025-01-12 00:00:00
927	18	\N	1	3	3341.30	deposit	2025-05-14 00:00:00	Cheque Deposit	f	\N	\N	12	2025-05-14 00:00:00
928	18	14	\N	5	3692.14	transfer	2025-05-18 00:00:00	Bank Internal Transfer	f	14	\N	43	2025-05-18 00:00:00
929	18	22	\N	3	1934.37	deposit	2025-05-19 00:00:00	Cash Deposit at Branch	f	\N	\N	6	2025-05-19 00:00:00
930	18	46	\N	\N	3746.35	withdrawal	2025-02-16 00:00:00	ATM Cash Withdrawal	f	\N	\N	6	2025-02-16 00:00:00
931	18	\N	2	7	4445.30	expense	2025-02-28 00:00:00	Streaming Subscription	f	18	\N	16	2025-02-28 00:00:00
932	18	32	\N	8	843.99	withdrawal	2025-01-26 00:00:00	Cash Removed from Account	f	\N	\N	44	2025-01-26 00:00:00
933	18	22	\N	\N	4379.26	fee	2025-01-12 00:00:00	Monthly Account Fee	f	\N	\N	32	2025-01-12 00:00:00
934	18	42	\N	\N	132.74	expense	2025-03-27 00:00:00	Streaming Subscription	f	11	\N	48	2025-03-27 00:00:00
935	18	42	\N	5	3890.03	withdrawal	2025-03-29 00:00:00	ATM Cash Withdrawal	f	2	\N	39	2025-03-29 00:00:00
936	18	14	\N	\N	2488.89	fee	2025-03-30 00:00:00	ATM Withdrawal Fee	f	\N	4	49	2025-03-30 00:00:00
937	18	36	\N	\N	1349.19	expense	2025-01-30 00:00:00	Public Transport Fare	f	\N	\N	8	2025-01-30 00:00:00
938	18	39	\N	6	685.82	transfer	2025-01-10 00:00:00	Transfer from Checking	f	\N	1	23	2025-01-10 00:00:00
939	18	38	\N	3	1149.81	expense	2025-06-21 00:00:00	Fuel Station	f	12	\N	22	2025-06-21 00:00:00
940	18	3	\N	2	4237.35	fee	2025-01-11 00:00:00	ATM Withdrawal Fee	f	\N	\N	30	2025-01-11 00:00:00
941	18	39	\N	\N	2126.69	income	2025-03-17 00:00:00	Bonus Received	f	19	\N	30	2025-03-17 00:00:00
942	18	\N	8	7	1754.23	deposit	2025-06-27 00:00:00	Cash Deposit at Branch	t	\N	\N	41	2025-06-27 00:00:00
943	18	17	\N	\N	4074.92	transfer	2025-03-28 00:00:00	Transfer to Savings	f	\N	\N	2	2025-03-28 00:00:00
944	18	6	\N	\N	153.01	withdrawal	2025-04-07 00:00:00	Cash Removed from Account	f	10	\N	1	2025-04-07 00:00:00
945	18	21	\N	8	3321.13	transfer	2025-01-09 00:00:00	Transfer from Checking	f	\N	\N	17	2025-01-09 00:00:00
946	18	18	\N	2	216.32	deposit	2025-02-24 00:00:00	Online Deposit	f	\N	\N	0	2025-02-24 00:00:00
947	18	\N	11	\N	1604.38	deposit	2025-05-10 00:00:00	Cheque Deposit	f	\N	\N	42	2025-05-10 00:00:00
948	18	39	\N	2	22.97	expense	2025-06-26 00:00:00	Coffee Shop	f	\N	\N	39	2025-06-26 00:00:00
949	18	\N	12	4	1940.89	expense	2025-03-18 00:00:00	Grocery Store Purchase	f	\N	\N	9	2025-03-18 00:00:00
950	18	48	\N	4	4226.75	expense	2025-04-16 00:00:00	Public Transport Fare	f	19	\N	1	2025-04-16 00:00:00
951	18	49	\N	\N	1088.38	income	2025-02-14 00:00:00	Interest Income	f	\N	\N	44	2025-02-14 00:00:00
952	18	\N	13	3	3192.72	deposit	2025-06-06 00:00:00	Online Deposit	f	13	\N	9	2025-06-06 00:00:00
953	18	45	\N	\N	2923.39	transfer	2025-06-16 00:00:00	Transfer from Checking	f	\N	\N	37	2025-06-16 00:00:00
954	18	38	\N	\N	1533.50	deposit	2025-05-24 00:00:00	Cash Deposit at Branch	t	20	\N	25	2025-05-24 00:00:00
955	18	\N	3	5	4707.83	expense	2025-06-19 00:00:00	Utility Bill Payment	f	18	\N	19	2025-06-19 00:00:00
956	18	\N	4	\N	3639.09	fee	2025-05-08 00:00:00	ATM Withdrawal Fee	f	\N	\N	10	2025-05-08 00:00:00
957	18	\N	11	\N	2946.83	expense	2025-02-13 00:00:00	Monthly Rent Payment	f	2	\N	34	2025-02-13 00:00:00
958	18	39	\N	2	3598.25	fee	2025-01-04 00:00:00	Service Charge	t	\N	\N	18	2025-01-04 00:00:00
959	18	\N	7	\N	2079.09	income	2025-04-12 00:00:00	Interest Income	f	\N	\N	11	2025-04-12 00:00:00
960	18	\N	13	\N	694.46	income	2025-01-19 00:00:00	Interest Income	f	\N	4	4	2025-01-19 00:00:00
961	18	\N	2	9	2492.41	deposit	2025-01-03 00:00:00	Cash Deposit at Branch	f	\N	\N	49	2025-01-03 00:00:00
962	18	\N	1	\N	3762.51	expense	2025-03-11 00:00:00	Utility Bill Payment	f	\N	3	25	2025-03-11 00:00:00
963	18	41	\N	\N	447.38	income	2025-05-19 00:00:00	Interest Income	t	\N	\N	49	2025-05-19 00:00:00
964	18	50	\N	\N	2117.60	expense	2025-03-16 00:00:00	Clothing Store Purchase	t	\N	\N	17	2025-03-16 00:00:00
965	18	17	\N	2	1608.40	income	2025-01-20 00:00:00	Freelance Project Payment	f	\N	\N	49	2025-01-20 00:00:00
966	18	\N	12	\N	4173.49	withdrawal	2025-06-09 00:00:00	Cash Removed from Account	f	\N	\N	42	2025-06-09 00:00:00
967	18	27	\N	5	1461.19	transfer	2025-03-23 00:00:00	Transfer to Savings	f	\N	\N	5	2025-03-23 00:00:00
968	18	\N	7	1	1959.68	withdrawal	2025-06-19 00:00:00	ATM Cash Withdrawal	t	14	\N	12	2025-06-19 00:00:00
969	18	36	\N	1	4793.15	income	2025-03-09 00:00:00	Dividend Payment	f	5	\N	17	2025-03-09 00:00:00
970	18	44	\N	\N	4542.65	withdrawal	2025-03-11 00:00:00	Cash Removed from Account	f	\N	2	45	2025-03-11 00:00:00
971	18	9	\N	\N	4329.42	transfer	2025-04-20 00:00:00	Bank Internal Transfer	f	\N	\N	18	2025-04-20 00:00:00
972	18	\N	5	4	2273.64	fee	2025-02-14 00:00:00	Service Charge	f	\N	\N	17	2025-02-14 00:00:00
973	18	47	\N	\N	4704.79	income	2025-04-17 00:00:00	Dividend Payment	f	\N	\N	46	2025-04-17 00:00:00
974	18	\N	12	\N	1010.24	withdrawal	2025-05-29 00:00:00	ATM Cash Withdrawal	t	\N	2	9	2025-05-29 00:00:00
975	18	39	\N	\N	1848.53	deposit	2025-01-09 00:00:00	Cash Deposit at Branch	f	\N	3	19	2025-01-09 00:00:00
976	18	34	\N	\N	4901.83	fee	2025-06-07 00:00:00	Monthly Account Fee	t	\N	\N	5	2025-06-07 00:00:00
977	18	25	\N	\N	1656.57	expense	2025-03-21 00:00:00	Clothing Store Purchase	f	\N	5	37	2025-03-21 00:00:00
978	18	38	\N	2	1106.85	expense	2025-01-16 00:00:00	Coffee Shop	f	13	\N	17	2025-01-16 00:00:00
979	18	20	\N	\N	2090.52	expense	2025-02-25 00:00:00	Coffee Shop	f	\N	3	8	2025-02-25 00:00:00
980	18	27	\N	8	1654.50	expense	2025-01-31 00:00:00	Streaming Subscription	f	\N	\N	46	2025-01-31 00:00:00
981	19	\N	2	\N	2858.45	income	2025-06-08 00:00:00	Interest Income	f	\N	\N	43	2025-06-08 00:00:00
982	19	38	\N	\N	4846.09	withdrawal	2025-02-17 00:00:00	Cash Removed from Account	f	\N	\N	32	2025-02-17 00:00:00
983	19	42	\N	\N	837.42	withdrawal	2025-02-21 00:00:00	Cash Removed from Account	f	\N	\N	27	2025-02-21 00:00:00
984	19	\N	11	8	4935.12	transfer	2025-04-26 00:00:00	Bank Internal Transfer	f	16	\N	39	2025-04-26 00:00:00
985	19	50	\N	1	2810.41	income	2025-03-10 00:00:00	Refund Processed	f	\N	\N	33	2025-03-10 00:00:00
986	19	25	\N	6	3805.29	withdrawal	2025-05-08 00:00:00	Cash Removed from Account	f	10	\N	12	2025-05-08 00:00:00
987	19	4	\N	\N	187.41	withdrawal	2025-03-30 00:00:00	Cash Removed from Account	f	\N	\N	17	2025-03-30 00:00:00
988	19	\N	11	7	879.03	expense	2025-05-30 00:00:00	Grocery Store Purchase	f	\N	\N	21	2025-05-30 00:00:00
989	19	16	\N	8	2966.54	deposit	2025-06-28 00:00:00	Cheque Deposit	f	\N	\N	48	2025-06-28 00:00:00
990	19	16	\N	\N	176.13	deposit	2025-06-16 00:00:00	Online Deposit	f	\N	\N	46	2025-06-16 00:00:00
991	19	33	\N	\N	1229.44	fee	2025-05-11 00:00:00	Service Charge	f	1	\N	13	2025-05-11 00:00:00
992	19	36	\N	5	4343.47	fee	2025-04-11 00:00:00	Monthly Account Fee	f	\N	\N	18	2025-04-11 00:00:00
993	19	4	\N	\N	1711.73	income	2025-01-17 00:00:00	Refund Processed	f	3	\N	49	2025-01-17 00:00:00
994	19	18	\N	\N	3538.94	transfer	2025-06-08 00:00:00	Transfer to Savings	t	\N	\N	24	2025-06-08 00:00:00
995	19	\N	1	1	2676.48	withdrawal	2025-05-06 00:00:00	Cash Removed from Account	f	5	4	41	2025-05-06 00:00:00
996	19	1	\N	3	116.24	income	2025-03-27 00:00:00	Bonus Received	f	\N	\N	47	2025-03-27 00:00:00
997	19	32	\N	1	202.59	deposit	2025-06-29 00:00:00	Cash Deposit at Branch	f	\N	\N	35	2025-06-29 00:00:00
998	19	\N	2	\N	3368.31	withdrawal	2025-06-23 00:00:00	ATM Cash Withdrawal	f	\N	\N	42	2025-06-23 00:00:00
999	19	27	\N	\N	2558.68	withdrawal	2025-03-08 00:00:00	ATM Cash Withdrawal	t	\N	\N	50	2025-03-08 00:00:00
1000	19	45	\N	\N	3974.68	transfer	2025-03-22 00:00:00	Transfer from Checking	f	\N	\N	4	2025-03-22 00:00:00
1001	19	19	\N	\N	988.68	expense	2025-01-05 00:00:00	Public Transport Fare	f	\N	\N	6	2025-01-05 00:00:00
1002	19	25	\N	\N	1656.52	deposit	2025-05-24 00:00:00	Cash Deposit at Branch	f	\N	\N	32	2025-05-24 00:00:00
1003	19	28	\N	\N	1732.71	fee	2025-05-14 00:00:00	ATM Withdrawal Fee	f	\N	\N	1	2025-05-14 00:00:00
1004	19	\N	12	\N	3148.10	expense	2025-05-26 00:00:00	Coffee Shop	f	\N	\N	25	2025-05-26 00:00:00
1005	19	43	\N	6	1887.28	expense	2025-03-31 00:00:00	Streaming Subscription	f	4	\N	31	2025-03-31 00:00:00
1006	19	39	\N	2	1938.06	fee	2025-02-25 00:00:00	ATM Withdrawal Fee	t	10	\N	50	2025-02-25 00:00:00
1007	19	45	\N	3	3004.60	expense	2025-05-11 00:00:00	Coffee Shop	f	\N	\N	48	2025-05-11 00:00:00
1008	19	20	\N	4	1526.45	transfer	2025-05-10 00:00:00	Transfer from Checking	f	22	\N	31	2025-05-10 00:00:00
1009	19	24	\N	\N	2797.69	withdrawal	2025-01-19 00:00:00	Cash Removed from Account	t	\N	2	12	2025-01-19 00:00:00
1010	19	46	\N	\N	1309.82	deposit	2025-02-20 00:00:00	Cash Deposit at Branch	t	\N	\N	3	2025-02-20 00:00:00
1011	19	\N	3	8	3301.77	withdrawal	2025-06-08 00:00:00	Cash Removed from Account	f	\N	2	23	2025-06-08 00:00:00
1012	19	13	\N	\N	948.01	transfer	2025-02-05 00:00:00	Transfer to Savings	f	\N	\N	26	2025-02-05 00:00:00
1013	19	37	\N	\N	898.71	income	2025-06-24 00:00:00	Interest Income	f	\N	\N	6	2025-06-24 00:00:00
1014	19	15	\N	1	4897.26	deposit	2025-06-16 00:00:00	Cheque Deposit	f	\N	\N	27	2025-06-16 00:00:00
1015	19	\N	7	5	3784.24	withdrawal	2025-04-12 00:00:00	Cash Removed from Account	f	\N	\N	1	2025-04-12 00:00:00
1016	19	5	\N	5	4608.19	expense	2025-01-30 00:00:00	Coffee Shop	f	13	\N	49	2025-01-30 00:00:00
1017	19	38	\N	2	2100.09	deposit	2025-05-01 00:00:00	Cash Deposit at Branch	f	\N	3	23	2025-05-01 00:00:00
1018	19	15	\N	7	3590.63	transfer	2025-01-27 00:00:00	Bank Internal Transfer	f	\N	\N	47	2025-01-27 00:00:00
1019	19	2	\N	\N	2550.68	expense	2025-06-07 00:00:00	Mobile Data Recharge	f	\N	\N	1	2025-06-07 00:00:00
1020	19	31	\N	2	3766.65	withdrawal	2025-01-22 00:00:00	Cash Removed from Account	f	\N	\N	0	2025-01-22 00:00:00
1021	19	43	\N	\N	4227.67	deposit	2025-06-08 00:00:00	Cheque Deposit	f	\N	\N	18	2025-06-08 00:00:00
1022	19	\N	9	5	1072.19	expense	2025-01-20 00:00:00	Clothing Store Purchase	f	\N	\N	34	2025-01-20 00:00:00
1023	19	22	\N	5	4413.19	transfer	2025-02-17 00:00:00	Transfer to Savings	f	\N	\N	7	2025-02-17 00:00:00
1024	19	28	\N	4	4244.60	income	2025-02-23 00:00:00	Interest Income	f	\N	\N	17	2025-02-23 00:00:00
1025	19	\N	12	\N	2992.42	fee	2025-03-26 00:00:00	Monthly Account Fee	f	\N	\N	50	2025-03-26 00:00:00
1026	19	10	\N	\N	2295.84	deposit	2025-06-25 00:00:00	Online Deposit	f	2	\N	50	2025-06-25 00:00:00
1027	19	10	\N	2	4445.88	deposit	2025-02-13 00:00:00	Cheque Deposit	f	11	\N	43	2025-02-13 00:00:00
1028	19	20	\N	\N	798.06	deposit	2025-05-10 00:00:00	Online Deposit	f	\N	\N	6	2025-05-10 00:00:00
1029	19	\N	11	\N	3188.85	income	2025-05-07 00:00:00	Interest Income	f	\N	\N	26	2025-05-07 00:00:00
1030	19	19	\N	\N	260.34	income	2025-06-22 00:00:00	Dividend Payment	f	\N	\N	46	2025-06-22 00:00:00
1031	19	\N	9	\N	2911.85	deposit	2025-06-27 00:00:00	Cash Deposit at Branch	f	12	5	39	2025-06-27 00:00:00
1032	19	16	\N	\N	879.74	transfer	2025-02-25 00:00:00	Transfer from Checking	t	\N	\N	35	2025-02-25 00:00:00
1033	19	37	\N	\N	3531.55	deposit	2025-06-14 00:00:00	Online Deposit	f	21	\N	15	2025-06-14 00:00:00
1034	19	\N	10	\N	73.28	withdrawal	2025-02-01 00:00:00	ATM Cash Withdrawal	t	10	\N	50	2025-02-01 00:00:00
1035	19	14	\N	7	2029.65	income	2025-02-20 00:00:00	Interest Income	f	\N	\N	31	2025-02-20 00:00:00
1036	19	17	\N	2	1000.46	expense	2025-05-02 00:00:00	Mobile Data Recharge	f	7	\N	39	2025-05-02 00:00:00
1037	19	\N	9	\N	1892.29	expense	2025-04-09 00:00:00	Public Transport Fare	f	\N	\N	17	2025-04-09 00:00:00
1038	19	41	\N	\N	2989.90	income	2025-02-02 00:00:00	Salary Payment	f	\N	\N	50	2025-02-02 00:00:00
1039	19	\N	1	\N	2601.84	income	2025-01-12 00:00:00	Bonus Received	f	\N	1	28	2025-01-12 00:00:00
1040	19	\N	6	\N	1496.29	transfer	2025-02-19 00:00:00	Bank Internal Transfer	t	\N	\N	34	2025-02-19 00:00:00
1041	19	\N	8	\N	1359.78	deposit	2025-06-20 00:00:00	Online Deposit	f	\N	\N	37	2025-06-20 00:00:00
1042	19	34	\N	1	3810.70	fee	2025-02-16 00:00:00	Monthly Account Fee	f	\N	\N	34	2025-02-16 00:00:00
1043	19	44	\N	\N	690.37	income	2025-06-09 00:00:00	Dividend Payment	f	2	1	31	2025-06-09 00:00:00
1044	19	\N	3	\N	3591.29	expense	2025-01-14 00:00:00	Clothing Store Purchase	f	\N	\N	32	2025-01-14 00:00:00
1045	19	\N	10	\N	2677.64	income	2025-05-31 00:00:00	Salary Payment	t	12	\N	48	2025-05-31 00:00:00
1046	19	46	\N	9	1663.45	expense	2025-01-02 00:00:00	Public Transport Fare	f	\N	\N	12	2025-01-02 00:00:00
1047	19	46	\N	\N	3834.90	transfer	2025-03-09 00:00:00	Transfer to Savings	f	\N	\N	47	2025-03-09 00:00:00
1048	19	9	\N	7	3282.82	expense	2025-05-26 00:00:00	Fuel Station	f	\N	3	39	2025-05-26 00:00:00
1049	19	28	\N	4	155.59	fee	2025-03-18 00:00:00	Monthly Account Fee	f	\N	\N	6	2025-03-18 00:00:00
1050	19	12	\N	5	4457.57	deposit	2025-01-12 00:00:00	Online Deposit	f	\N	\N	31	2025-01-12 00:00:00
1051	20	18	\N	1	3450.58	deposit	2025-05-02 00:00:00	Online Deposit	f	\N	1	7	2025-05-02 00:00:00
1052	20	\N	13	5	200.39	fee	2025-06-12 00:00:00	ATM Withdrawal Fee	f	\N	\N	30	2025-06-12 00:00:00
1053	20	31	\N	\N	2297.35	deposit	2025-01-10 00:00:00	Cheque Deposit	f	\N	\N	42	2025-01-10 00:00:00
1054	20	35	\N	6	1315.82	expense	2025-05-31 00:00:00	Streaming Subscription	t	\N	\N	41	2025-05-31 00:00:00
1055	20	19	\N	1	3358.01	income	2025-04-28 00:00:00	Salary Payment	f	\N	3	27	2025-04-28 00:00:00
1056	20	\N	6	\N	1773.25	transfer	2025-01-05 00:00:00	Transfer to Savings	f	\N	\N	45	2025-01-05 00:00:00
1057	20	18	\N	\N	4830.93	transfer	2025-03-20 00:00:00	Bank Internal Transfer	f	\N	\N	23	2025-03-20 00:00:00
1058	20	25	\N	\N	1274.81	expense	2025-06-23 00:00:00	Mobile Data Recharge	f	\N	\N	33	2025-06-23 00:00:00
1059	20	51	\N	8	3704.41	deposit	2025-02-06 00:00:00	Cash Deposit at Branch	f	14	\N	23	2025-02-06 00:00:00
1060	20	\N	10	2	2421.44	fee	2025-05-28 00:00:00	Monthly Account Fee	f	14	\N	11	2025-05-28 00:00:00
1061	20	\N	9	4	3156.07	deposit	2025-05-07 00:00:00	Cash Deposit at Branch	t	\N	3	22	2025-05-07 00:00:00
1062	20	34	\N	1	3388.35	transfer	2025-01-01 00:00:00	Transfer from Checking	f	\N	\N	39	2025-01-01 00:00:00
1063	20	4	\N	\N	1103.74	deposit	2025-02-06 00:00:00	Cash Deposit at Branch	f	\N	2	41	2025-02-06 00:00:00
1064	20	30	\N	\N	2159.95	withdrawal	2025-03-09 00:00:00	ATM Cash Withdrawal	t	\N	1	46	2025-03-09 00:00:00
1065	20	8	\N	\N	4478.57	withdrawal	2025-05-17 00:00:00	ATM Cash Withdrawal	f	10	\N	14	2025-05-17 00:00:00
1066	20	21	\N	3	2122.17	deposit	2025-03-09 00:00:00	Cheque Deposit	f	\N	\N	10	2025-03-09 00:00:00
1067	20	\N	7	8	4534.57	fee	2025-06-30 00:00:00	Service Charge	f	10	\N	46	2025-06-30 00:00:00
1068	20	31	\N	\N	3396.86	expense	2025-04-03 00:00:00	Coffee Shop	f	\N	\N	26	2025-04-03 00:00:00
1069	20	26	\N	5	2383.89	expense	2025-05-21 00:00:00	Monthly Rent Payment	f	\N	\N	39	2025-05-21 00:00:00
1070	20	\N	11	7	4029.68	transfer	2025-06-24 00:00:00	Transfer from Checking	f	\N	1	45	2025-06-24 00:00:00
1071	20	13	\N	8	2070.21	transfer	2025-03-16 00:00:00	Transfer from Checking	f	2	\N	24	2025-03-16 00:00:00
1072	20	\N	2	2	3430.97	fee	2025-01-22 00:00:00	ATM Withdrawal Fee	f	\N	2	17	2025-01-22 00:00:00
1073	20	\N	12	\N	1548.57	deposit	2025-06-13 00:00:00	Online Deposit	f	\N	\N	6	2025-06-13 00:00:00
1074	20	7	\N	6	3817.44	expense	2025-06-19 00:00:00	Fuel Station	f	\N	\N	32	2025-06-19 00:00:00
1075	20	36	\N	2	2417.70	expense	2025-03-18 00:00:00	Public Transport Fare	f	\N	1	34	2025-03-18 00:00:00
1076	20	43	\N	\N	3933.67	transfer	2025-01-07 00:00:00	Bank Internal Transfer	f	11	\N	40	2025-01-07 00:00:00
1077	20	\N	13	3	4681.22	deposit	2025-01-19 00:00:00	Cheque Deposit	t	\N	\N	3	2025-01-19 00:00:00
1078	20	36	\N	3	4907.69	deposit	2025-04-16 00:00:00	Cheque Deposit	f	\N	3	29	2025-04-16 00:00:00
1079	20	23	\N	\N	3931.83	deposit	2025-03-07 00:00:00	Cheque Deposit	f	\N	\N	8	2025-03-07 00:00:00
1080	20	\N	8	9	261.31	fee	2025-06-16 00:00:00	Monthly Account Fee	f	\N	\N	42	2025-06-16 00:00:00
1081	20	41	\N	8	1875.29	withdrawal	2025-01-17 00:00:00	Cash Removed from Account	f	\N	\N	20	2025-01-17 00:00:00
1082	20	\N	12	\N	1348.54	expense	2025-04-29 00:00:00	Mobile Data Recharge	f	\N	\N	22	2025-04-29 00:00:00
1083	20	25	\N	4	4263.69	expense	2025-01-06 00:00:00	Monthly Rent Payment	f	\N	\N	10	2025-01-06 00:00:00
1084	20	37	\N	\N	3446.66	deposit	2025-05-02 00:00:00	Online Deposit	f	\N	\N	35	2025-05-02 00:00:00
1085	20	\N	4	4	3783.43	withdrawal	2025-03-08 00:00:00	ATM Cash Withdrawal	f	\N	3	5	2025-03-08 00:00:00
1086	20	\N	9	\N	2213.35	fee	2025-02-19 00:00:00	Service Charge	f	\N	\N	16	2025-02-19 00:00:00
1087	20	15	\N	9	459.83	income	2025-05-07 00:00:00	Dividend Payment	f	7	\N	11	2025-05-07 00:00:00
1088	20	41	\N	4	1491.41	deposit	2025-02-08 00:00:00	Cheque Deposit	f	\N	\N	15	2025-02-08 00:00:00
1089	20	47	\N	\N	2283.03	deposit	2025-04-12 00:00:00	Online Deposit	f	\N	\N	36	2025-04-12 00:00:00
1090	20	\N	13	3	4194.42	expense	2025-03-02 00:00:00	Clothing Store Purchase	f	\N	\N	42	2025-03-02 00:00:00
1091	20	1	\N	3	2052.42	income	2025-01-10 00:00:00	Bonus Received	t	6	\N	43	2025-01-10 00:00:00
1092	20	\N	4	\N	2004.47	withdrawal	2025-04-15 00:00:00	ATM Cash Withdrawal	f	\N	\N	5	2025-04-15 00:00:00
1093	20	44	\N	\N	1364.01	income	2025-03-02 00:00:00	Dividend Payment	f	18	\N	32	2025-03-02 00:00:00
1094	20	\N	8	\N	382.38	transfer	2025-02-17 00:00:00	Transfer from Checking	f	\N	\N	44	2025-02-17 00:00:00
1095	20	\N	10	\N	4324.53	income	2025-06-27 00:00:00	Refund Processed	f	6	1	41	2025-06-27 00:00:00
1096	20	35	\N	9	1551.00	transfer	2025-02-16 00:00:00	Transfer to Savings	f	\N	4	9	2025-02-16 00:00:00
1097	20	20	\N	6	1920.68	transfer	2025-02-12 00:00:00	Transfer from Checking	f	\N	\N	45	2025-02-12 00:00:00
1098	21	\N	6	\N	2876.01	expense	2025-02-15 00:00:00	Coffee Shop	f	\N	3	7	2025-02-15 00:00:00
1099	21	\N	11	9	4085.50	expense	2025-04-14 00:00:00	Utility Bill Payment	f	\N	5	23	2025-04-14 00:00:00
1100	21	8	\N	7	843.66	deposit	2025-01-04 00:00:00	Online Deposit	f	\N	\N	25	2025-01-04 00:00:00
1101	21	\N	1	\N	455.48	transfer	2025-04-21 00:00:00	Transfer to Savings	f	\N	2	5	2025-04-21 00:00:00
1102	21	51	\N	\N	1464.53	deposit	2025-01-08 00:00:00	Online Deposit	f	15	2	20	2025-01-08 00:00:00
1103	21	11	\N	5	1531.11	withdrawal	2025-04-29 00:00:00	Cash Removed from Account	f	\N	4	46	2025-04-29 00:00:00
1104	21	37	\N	1	4610.65	fee	2025-02-03 00:00:00	ATM Withdrawal Fee	t	2	2	49	2025-02-03 00:00:00
1105	21	30	\N	5	4259.02	transfer	2025-06-06 00:00:00	Bank Internal Transfer	f	\N	5	50	2025-06-06 00:00:00
1106	21	\N	12	\N	393.45	income	2025-04-05 00:00:00	Bonus Received	f	\N	\N	8	2025-04-05 00:00:00
1107	21	24	\N	\N	2107.03	withdrawal	2025-01-30 00:00:00	Cash Removed from Account	f	\N	\N	45	2025-01-30 00:00:00
1108	21	43	\N	\N	4450.66	withdrawal	2025-03-07 00:00:00	Cash Removed from Account	f	10	\N	41	2025-03-07 00:00:00
1109	21	\N	2	3	641.76	income	2025-06-25 00:00:00	Bonus Received	f	\N	\N	4	2025-06-25 00:00:00
1110	21	33	\N	4	1826.92	fee	2025-05-21 00:00:00	Monthly Account Fee	f	15	\N	20	2025-05-21 00:00:00
1111	21	23	\N	\N	2186.56	income	2025-01-22 00:00:00	Refund Processed	f	\N	\N	45	2025-01-22 00:00:00
1112	21	\N	3	1	4290.47	expense	2025-01-25 00:00:00	Restaurant Dinner	f	\N	4	25	2025-01-25 00:00:00
1113	21	\N	8	2	2033.55	income	2025-06-29 00:00:00	Freelance Project Payment	f	22	\N	20	2025-06-29 00:00:00
1114	21	45	\N	\N	4923.47	income	2025-01-26 00:00:00	Bonus Received	f	\N	\N	7	2025-01-26 00:00:00
1115	21	25	\N	\N	3224.31	deposit	2025-04-30 00:00:00	Cheque Deposit	f	\N	\N	42	2025-04-30 00:00:00
1116	21	49	\N	\N	3155.19	expense	2025-04-30 00:00:00	Monthly Rent Payment	f	12	\N	2	2025-04-30 00:00:00
1117	21	\N	7	9	1122.89	deposit	2025-03-17 00:00:00	Cheque Deposit	f	8	\N	34	2025-03-17 00:00:00
1118	21	43	\N	\N	2984.90	withdrawal	2025-01-07 00:00:00	Cash Removed from Account	f	\N	2	7	2025-01-07 00:00:00
1119	21	9	\N	3	4227.22	income	2025-06-28 00:00:00	Refund Processed	f	\N	\N	10	2025-06-28 00:00:00
1120	21	24	\N	\N	4037.83	expense	2025-01-06 00:00:00	Coffee Shop	f	\N	\N	43	2025-01-06 00:00:00
1121	21	\N	9	\N	2340.83	deposit	2025-03-04 00:00:00	Online Deposit	f	5	\N	28	2025-03-04 00:00:00
1122	21	29	\N	1	2010.70	transfer	2025-03-14 00:00:00	Bank Internal Transfer	f	\N	\N	49	2025-03-14 00:00:00
1123	21	26	\N	\N	3321.36	withdrawal	2025-05-22 00:00:00	ATM Cash Withdrawal	f	17	\N	5	2025-05-22 00:00:00
1124	21	14	\N	\N	3688.99	transfer	2025-06-30 00:00:00	Transfer to Savings	f	\N	3	25	2025-06-30 00:00:00
1125	21	46	\N	5	3015.12	transfer	2025-02-23 00:00:00	Transfer to Savings	f	\N	\N	50	2025-02-23 00:00:00
1126	21	30	\N	3	4569.01	income	2025-03-15 00:00:00	Salary Payment	f	12	\N	26	2025-03-15 00:00:00
1127	21	\N	1	\N	1851.38	transfer	2025-03-21 00:00:00	Bank Internal Transfer	f	\N	\N	19	2025-03-21 00:00:00
1128	22	\N	11	4	4587.20	expense	2025-06-29 00:00:00	Clothing Store Purchase	f	23	\N	2	2025-06-29 00:00:00
1129	22	39	\N	8	1411.66	deposit	2025-05-02 00:00:00	Cash Deposit at Branch	f	\N	\N	4	2025-05-02 00:00:00
1130	22	43	\N	\N	3068.94	expense	2025-06-03 00:00:00	Restaurant Dinner	t	3	\N	12	2025-06-03 00:00:00
1131	22	2	\N	\N	4735.64	income	2025-03-17 00:00:00	Dividend Payment	f	\N	\N	23	2025-03-17 00:00:00
1132	22	\N	7	\N	471.86	income	2025-05-16 00:00:00	Salary Payment	f	\N	\N	47	2025-05-16 00:00:00
1133	22	10	\N	1	2052.97	withdrawal	2025-02-28 00:00:00	Cash Removed from Account	f	1	5	30	2025-02-28 00:00:00
1134	22	13	\N	8	3041.94	expense	2025-01-13 00:00:00	Streaming Subscription	f	\N	2	22	2025-01-13 00:00:00
1135	22	21	\N	\N	4372.56	expense	2025-05-30 00:00:00	Restaurant Dinner	f	\N	\N	14	2025-05-30 00:00:00
1136	22	18	\N	\N	3453.61	deposit	2025-02-07 00:00:00	Online Deposit	f	\N	\N	1	2025-02-07 00:00:00
1137	22	\N	11	2	4776.55	deposit	2025-03-26 00:00:00	Cheque Deposit	f	21	1	48	2025-03-26 00:00:00
1138	22	16	\N	5	4459.20	fee	2025-04-16 00:00:00	ATM Withdrawal Fee	t	\N	\N	45	2025-04-16 00:00:00
1139	22	\N	1	\N	822.83	withdrawal	2025-01-04 00:00:00	Cash Removed from Account	f	6	3	45	2025-01-04 00:00:00
1140	22	\N	12	6	300.98	withdrawal	2025-05-05 00:00:00	Cash Removed from Account	f	\N	\N	20	2025-05-05 00:00:00
1141	22	\N	2	\N	3945.36	income	2025-06-26 00:00:00	Freelance Project Payment	f	\N	\N	44	2025-06-26 00:00:00
1142	22	41	\N	7	1529.84	deposit	2025-03-28 00:00:00	Cheque Deposit	f	6	\N	33	2025-03-28 00:00:00
1143	22	\N	1	\N	1278.56	expense	2025-06-18 00:00:00	Public Transport Fare	f	15	\N	50	2025-06-18 00:00:00
1144	22	13	\N	\N	426.07	transfer	2025-06-25 00:00:00	Transfer to Savings	f	\N	\N	47	2025-06-25 00:00:00
1145	22	32	\N	3	3856.02	deposit	2025-04-28 00:00:00	Online Deposit	f	\N	\N	16	2025-04-28 00:00:00
1146	22	34	\N	4	245.10	withdrawal	2025-05-02 00:00:00	ATM Cash Withdrawal	f	13	\N	3	2025-05-02 00:00:00
1147	22	23	\N	7	4624.11	income	2025-03-17 00:00:00	Dividend Payment	f	19	\N	5	2025-03-17 00:00:00
1148	22	15	\N	2	4407.98	withdrawal	2025-02-11 00:00:00	Cash Removed from Account	f	\N	4	28	2025-02-11 00:00:00
1149	22	36	\N	9	798.66	income	2025-02-01 00:00:00	Bonus Received	f	\N	2	24	2025-02-01 00:00:00
1150	22	41	\N	2	3164.67	expense	2025-05-02 00:00:00	Monthly Rent Payment	f	18	\N	19	2025-05-02 00:00:00
1151	22	\N	4	4	3227.56	fee	2025-02-02 00:00:00	ATM Withdrawal Fee	f	\N	\N	42	2025-02-02 00:00:00
1152	22	26	\N	3	1917.30	deposit	2025-04-30 00:00:00	Cheque Deposit	f	\N	\N	4	2025-04-30 00:00:00
1153	22	23	\N	6	818.54	expense	2025-01-14 00:00:00	Clothing Store Purchase	f	\N	\N	49	2025-01-14 00:00:00
1154	22	18	\N	\N	1331.93	expense	2025-02-28 00:00:00	Clothing Store Purchase	f	\N	3	45	2025-02-28 00:00:00
1155	22	38	\N	\N	222.36	income	2025-03-05 00:00:00	Freelance Project Payment	f	\N	\N	32	2025-03-05 00:00:00
1156	22	\N	1	\N	1278.56	expense	2025-06-18 00:00:00	Public Transport Fare	f	15	\N	50	2025-06-18 00:00:00
1157	22	27	\N	\N	335.99	deposit	2025-04-30 00:00:00	Online Deposit	t	5	\N	7	2025-04-30 00:00:00
1158	22	7	\N	\N	4883.16	deposit	2025-05-31 00:00:00	Cheque Deposit	f	13	\N	25	2025-05-31 00:00:00
1159	22	14	\N	\N	257.29	fee	2025-03-10 00:00:00	Monthly Account Fee	f	19	\N	9	2025-03-10 00:00:00
1160	22	20	\N	\N	2383.07	expense	2025-06-11 00:00:00	Grocery Store Purchase	f	\N	\N	19	2025-06-11 00:00:00
1161	22	33	\N	\N	795.03	fee	2025-03-29 00:00:00	Monthly Account Fee	f	\N	\N	13	2025-03-29 00:00:00
1162	22	51	\N	\N	106.07	fee	2025-05-16 00:00:00	Monthly Account Fee	f	\N	\N	8	2025-05-16 00:00:00
1163	22	23	\N	2	4024.47	expense	2025-01-18 00:00:00	Mobile Data Recharge	f	10	\N	38	2025-01-18 00:00:00
1164	22	\N	3	\N	4113.73	deposit	2025-03-17 00:00:00	Cash Deposit at Branch	t	19	\N	44	2025-03-17 00:00:00
1165	22	8	\N	\N	3136.85	income	2025-01-26 00:00:00	Interest Income	f	\N	\N	37	2025-01-26 00:00:00
1166	22	30	\N	\N	2496.63	fee	2025-02-01 00:00:00	Service Charge	f	15	\N	29	2025-02-01 00:00:00
1167	22	7	\N	9	3427.98	income	2025-04-11 00:00:00	Interest Income	f	\N	4	34	2025-04-11 00:00:00
1168	22	37	\N	1	575.56	withdrawal	2025-01-27 00:00:00	Cash Removed from Account	f	\N	\N	5	2025-01-27 00:00:00
1169	22	\N	2	3	4096.86	expense	2025-05-14 00:00:00	Grocery Store Purchase	f	\N	3	23	2025-05-14 00:00:00
1170	22	30	\N	\N	1980.78	transfer	2025-01-25 00:00:00	Transfer to Savings	f	\N	\N	31	2025-01-25 00:00:00
1171	22	48	\N	\N	3684.36	withdrawal	2025-06-20 00:00:00	ATM Cash Withdrawal	f	15	\N	12	2025-06-20 00:00:00
1172	22	16	\N	\N	2045.03	fee	2025-01-14 00:00:00	Service Charge	t	5	\N	35	2025-01-14 00:00:00
1173	22	22	\N	6	1428.30	transfer	2025-03-30 00:00:00	Transfer from Checking	f	\N	\N	33	2025-03-30 00:00:00
1174	22	12	\N	9	2989.85	expense	2025-01-17 00:00:00	Mobile Data Recharge	f	\N	5	13	2025-01-17 00:00:00
1175	22	\N	10	5	2975.09	deposit	2025-05-01 00:00:00	Cheque Deposit	f	9	4	50	2025-05-01 00:00:00
1176	22	\N	10	\N	3559.34	expense	2025-03-27 00:00:00	Restaurant Dinner	f	\N	\N	22	2025-03-27 00:00:00
1177	22	24	\N	\N	2761.38	deposit	2025-05-25 00:00:00	Cheque Deposit	t	\N	\N	12	2025-05-25 00:00:00
1178	22	22	\N	8	3216.19	deposit	2025-04-08 00:00:00	Online Deposit	f	\N	\N	4	2025-04-08 00:00:00
1179	22	\N	5	3	3910.14	deposit	2025-02-05 00:00:00	Online Deposit	f	\N	\N	18	2025-02-05 00:00:00
1180	22	44	\N	7	292.18	income	2025-01-26 00:00:00	Salary Payment	f	10	\N	38	2025-01-26 00:00:00
1181	22	41	\N	\N	4366.20	income	2025-05-23 00:00:00	Bonus Received	f	\N	\N	28	2025-05-23 00:00:00
1182	22	34	\N	3	1379.74	income	2025-05-24 00:00:00	Refund Processed	f	\N	\N	39	2025-05-24 00:00:00
1183	22	6	\N	\N	4755.91	withdrawal	2025-03-25 00:00:00	ATM Cash Withdrawal	f	12	\N	27	2025-03-25 00:00:00
1184	22	22	\N	1	3216.41	income	2025-02-15 00:00:00	Dividend Payment	f	4	3	19	2025-02-15 00:00:00
1185	22	\N	1	\N	4655.16	withdrawal	2025-06-17 00:00:00	Cash Removed from Account	f	1	\N	28	2025-06-17 00:00:00
1186	22	5	\N	\N	4237.08	income	2025-06-27 00:00:00	Bonus Received	t	\N	\N	5	2025-06-27 00:00:00
1187	22	42	\N	2	2681.05	income	2025-02-08 00:00:00	Freelance Project Payment	f	\N	1	9	2025-02-08 00:00:00
1188	22	\N	11	3	1599.56	transfer	2025-03-13 00:00:00	Transfer from Checking	f	\N	\N	24	2025-03-13 00:00:00
1189	22	2	\N	\N	4466.84	deposit	2025-04-07 00:00:00	Cash Deposit at Branch	f	\N	\N	32	2025-04-07 00:00:00
1190	22	\N	11	\N	999.65	fee	2025-02-12 00:00:00	Monthly Account Fee	f	9	\N	26	2025-02-12 00:00:00
1191	23	\N	7	7	4464.54	transfer	2025-03-24 00:00:00	Transfer to Savings	t	\N	\N	0	2025-03-24 00:00:00
1192	23	14	\N	6	3603.67	transfer	2025-06-15 00:00:00	Transfer from Checking	f	\N	\N	12	2025-06-15 00:00:00
1193	23	30	\N	\N	4868.82	transfer	2025-04-11 00:00:00	Bank Internal Transfer	f	10	\N	36	2025-04-11 00:00:00
1194	23	29	\N	\N	4637.32	fee	2025-03-28 00:00:00	Monthly Account Fee	f	20	\N	45	2025-03-28 00:00:00
1195	23	50	\N	\N	2965.87	fee	2025-01-04 00:00:00	Monthly Account Fee	f	\N	\N	7	2025-01-04 00:00:00
1196	23	6	\N	5	668.81	deposit	2025-06-22 00:00:00	Online Deposit	f	10	5	2	2025-06-22 00:00:00
1197	23	21	\N	\N	4218.19	deposit	2025-01-05 00:00:00	Online Deposit	f	\N	\N	6	2025-01-05 00:00:00
1198	23	\N	13	\N	4281.10	deposit	2025-03-26 00:00:00	Online Deposit	f	\N	\N	21	2025-03-26 00:00:00
1199	23	\N	9	7	2645.69	income	2025-01-01 00:00:00	Interest Income	f	11	1	47	2025-01-01 00:00:00
1200	23	45	\N	1	472.83	fee	2025-04-19 00:00:00	ATM Withdrawal Fee	f	4	\N	17	2025-04-19 00:00:00
1201	23	33	\N	\N	499.59	deposit	2025-06-14 00:00:00	Cash Deposit at Branch	f	\N	\N	34	2025-06-14 00:00:00
1202	23	\N	11	\N	3751.45	deposit	2025-04-13 00:00:00	Cheque Deposit	f	\N	\N	17	2025-04-13 00:00:00
1203	23	9	\N	\N	3398.97	deposit	2025-06-02 00:00:00	Cheque Deposit	f	\N	3	47	2025-06-02 00:00:00
1204	23	41	\N	2	515.16	withdrawal	2025-05-12 00:00:00	ATM Cash Withdrawal	f	\N	\N	33	2025-05-12 00:00:00
1205	23	\N	4	\N	4029.92	deposit	2025-06-06 00:00:00	Cheque Deposit	f	\N	5	48	2025-06-06 00:00:00
1206	23	4	\N	8	3894.23	income	2025-06-21 00:00:00	Freelance Project Payment	f	\N	\N	1	2025-06-21 00:00:00
1207	23	45	\N	4	1837.37	expense	2025-06-16 00:00:00	Streaming Subscription	f	12	\N	3	2025-06-16 00:00:00
1208	23	17	\N	\N	47.68	withdrawal	2025-01-22 00:00:00	Cash Removed from Account	f	16	1	27	2025-01-22 00:00:00
1209	23	\N	12	3	4401.23	income	2025-01-03 00:00:00	Interest Income	f	\N	4	39	2025-01-03 00:00:00
1210	23	48	\N	\N	4738.61	transfer	2025-03-30 00:00:00	Transfer from Checking	f	11	\N	49	2025-03-30 00:00:00
1211	23	29	\N	5	4323.80	transfer	2025-03-02 00:00:00	Transfer to Savings	f	\N	4	30	2025-03-02 00:00:00
1212	23	\N	11	3	4632.82	deposit	2025-01-08 00:00:00	Online Deposit	f	\N	\N	4	2025-01-08 00:00:00
1213	23	29	\N	\N	4739.93	income	2025-06-03 00:00:00	Interest Income	f	22	\N	21	2025-06-03 00:00:00
1214	23	23	\N	\N	3524.31	withdrawal	2025-01-01 00:00:00	Cash Removed from Account	f	\N	\N	30	2025-01-01 00:00:00
1215	23	\N	4	2	2441.21	fee	2025-02-26 00:00:00	Service Charge	f	\N	\N	34	2025-02-26 00:00:00
1216	23	\N	12	\N	1303.85	withdrawal	2025-05-27 00:00:00	ATM Cash Withdrawal	f	\N	\N	9	2025-05-27 00:00:00
1217	23	\N	4	4	2029.46	income	2025-02-05 00:00:00	Interest Income	f	\N	\N	39	2025-02-05 00:00:00
1218	23	13	\N	\N	4888.62	transfer	2025-06-22 00:00:00	Transfer from Checking	f	\N	\N	13	2025-06-22 00:00:00
1219	23	33	\N	3	4771.81	fee	2025-01-27 00:00:00	ATM Withdrawal Fee	f	\N	\N	30	2025-01-27 00:00:00
1220	23	47	\N	8	2195.66	deposit	2025-01-18 00:00:00	Cash Deposit at Branch	f	19	\N	23	2025-01-18 00:00:00
1221	23	\N	3	\N	4816.65	income	2025-06-06 00:00:00	Refund Processed	f	\N	\N	25	2025-06-06 00:00:00
1222	23	47	\N	2	1439.01	deposit	2025-03-22 00:00:00	Cheque Deposit	f	\N	\N	20	2025-03-22 00:00:00
1223	23	32	\N	\N	768.53	income	2025-04-22 00:00:00	Dividend Payment	f	\N	2	23	2025-04-22 00:00:00
1224	23	41	\N	5	2375.80	withdrawal	2025-06-30 00:00:00	Cash Removed from Account	f	22	\N	18	2025-06-30 00:00:00
1225	23	\N	7	9	2514.49	withdrawal	2025-05-05 00:00:00	Cash Removed from Account	f	20	\N	30	2025-05-05 00:00:00
1226	23	3	\N	\N	1952.19	fee	2025-04-24 00:00:00	Monthly Account Fee	t	\N	\N	49	2025-04-24 00:00:00
1227	23	48	\N	6	500.41	expense	2025-04-11 00:00:00	Coffee Shop	f	22	\N	6	2025-04-11 00:00:00
1228	23	45	\N	5	336.50	deposit	2025-05-17 00:00:00	Online Deposit	t	13	\N	14	2025-05-17 00:00:00
1229	23	4	\N	\N	4154.47	income	2025-06-02 00:00:00	Salary Payment	f	\N	\N	31	2025-06-02 00:00:00
1230	23	34	\N	\N	3834.19	transfer	2025-03-08 00:00:00	Transfer to Savings	t	22	\N	24	2025-03-08 00:00:00
1231	23	24	\N	1	4013.05	withdrawal	2025-06-27 00:00:00	ATM Cash Withdrawal	f	\N	\N	22	2025-06-27 00:00:00
1232	23	\N	3	9	4382.33	deposit	2025-05-18 00:00:00	Cash Deposit at Branch	f	21	\N	15	2025-05-18 00:00:00
1233	23	15	\N	3	2087.49	expense	2025-03-20 00:00:00	Fuel Station	f	\N	\N	39	2025-03-20 00:00:00
1234	23	44	\N	\N	1563.61	fee	2025-03-09 00:00:00	Service Charge	f	\N	\N	3	2025-03-09 00:00:00
1235	24	\N	10	\N	728.74	income	2025-04-13 00:00:00	Dividend Payment	f	\N	\N	28	2025-04-13 00:00:00
1236	24	19	\N	\N	1208.91	fee	2025-06-22 00:00:00	Service Charge	f	\N	\N	49	2025-06-22 00:00:00
1237	24	\N	11	4	3654.69	expense	2025-02-07 00:00:00	Fuel Station	f	\N	\N	38	2025-02-07 00:00:00
1238	24	43	\N	4	2945.39	income	2025-06-07 00:00:00	Dividend Payment	t	7	\N	4	2025-06-07 00:00:00
1239	24	10	\N	\N	1915.04	fee	2025-06-21 00:00:00	Service Charge	f	\N	\N	22	2025-06-21 00:00:00
1240	24	40	\N	3	2998.44	income	2025-02-28 00:00:00	Interest Income	f	\N	\N	11	2025-02-28 00:00:00
1241	24	\N	8	3	3261.22	deposit	2025-06-03 00:00:00	Online Deposit	f	2	\N	7	2025-06-03 00:00:00
1242	24	31	\N	\N	2743.89	expense	2025-03-14 00:00:00	Coffee Shop	f	\N	5	33	2025-03-14 00:00:00
1243	24	26	\N	\N	2774.57	transfer	2025-02-24 00:00:00	Transfer from Checking	f	\N	\N	28	2025-02-24 00:00:00
1244	24	\N	11	7	2628.96	income	2025-01-31 00:00:00	Salary Payment	t	\N	1	29	2025-01-31 00:00:00
1245	24	9	\N	\N	3165.05	withdrawal	2025-01-13 00:00:00	Cash Removed from Account	f	\N	\N	21	2025-01-13 00:00:00
1246	24	\N	10	\N	4964.86	income	2025-01-31 00:00:00	Salary Payment	f	\N	\N	14	2025-01-31 00:00:00
1247	24	14	\N	9	1898.44	transfer	2025-02-05 00:00:00	Transfer to Savings	f	\N	\N	24	2025-02-05 00:00:00
1248	24	\N	11	6	4619.59	deposit	2025-04-04 00:00:00	Cash Deposit at Branch	f	22	\N	23	2025-04-04 00:00:00
1249	24	30	\N	\N	3485.64	expense	2025-01-15 00:00:00	Streaming Subscription	f	\N	\N	23	2025-01-15 00:00:00
1250	24	22	\N	\N	2746.94	fee	2025-06-20 00:00:00	Service Charge	f	\N	\N	10	2025-06-20 00:00:00
1251	24	31	\N	\N	4289.95	income	2025-01-05 00:00:00	Interest Income	f	\N	\N	22	2025-01-05 00:00:00
1252	24	13	\N	\N	3063.62	deposit	2025-06-25 00:00:00	Cash Deposit at Branch	f	\N	\N	35	2025-06-25 00:00:00
1253	24	13	\N	\N	4009.08	transfer	2025-03-25 00:00:00	Bank Internal Transfer	f	17	4	22	2025-03-25 00:00:00
1254	24	47	\N	8	2892.50	fee	2025-02-05 00:00:00	Monthly Account Fee	f	\N	\N	49	2025-02-05 00:00:00
1255	24	10	\N	1	1129.91	withdrawal	2025-03-22 00:00:00	ATM Cash Withdrawal	f	\N	\N	10	2025-03-22 00:00:00
1256	24	\N	5	\N	3832.05	withdrawal	2025-06-23 00:00:00	ATM Cash Withdrawal	f	10	1	31	2025-06-23 00:00:00
1257	24	25	\N	\N	33.26	fee	2025-04-19 00:00:00	Monthly Account Fee	f	\N	1	20	2025-04-19 00:00:00
1258	24	48	\N	7	3446.60	expense	2025-04-28 00:00:00	Monthly Rent Payment	f	\N	\N	4	2025-04-28 00:00:00
1259	24	43	\N	\N	660.25	withdrawal	2025-06-12 00:00:00	ATM Cash Withdrawal	f	4	\N	5	2025-06-12 00:00:00
1260	24	23	\N	4	3766.09	expense	2025-01-22 00:00:00	Grocery Store Purchase	f	\N	3	15	2025-01-22 00:00:00
1261	24	14	\N	2	1939.17	deposit	2025-01-16 00:00:00	Online Deposit	f	\N	2	27	2025-01-16 00:00:00
1262	24	46	\N	4	2325.48	deposit	2025-03-23 00:00:00	Online Deposit	f	16	\N	12	2025-03-23 00:00:00
1263	24	\N	1	\N	2211.25	deposit	2025-01-21 00:00:00	Cheque Deposit	f	16	\N	31	2025-01-21 00:00:00
1264	24	50	\N	6	4174.69	deposit	2025-04-30 00:00:00	Online Deposit	f	\N	5	16	2025-04-30 00:00:00
1265	24	35	\N	1	2786.85	transfer	2025-03-31 00:00:00	Bank Internal Transfer	f	\N	\N	39	2025-03-31 00:00:00
1266	24	\N	1	\N	3781.80	deposit	2025-02-08 00:00:00	Online Deposit	f	\N	\N	2	2025-02-08 00:00:00
1267	24	49	\N	\N	4145.01	income	2025-01-20 00:00:00	Refund Processed	t	\N	\N	8	2025-01-20 00:00:00
1268	24	6	\N	6	3247.83	transfer	2025-01-18 00:00:00	Transfer from Checking	f	\N	4	17	2025-01-18 00:00:00
1269	24	48	\N	6	850.97	withdrawal	2025-03-09 00:00:00	Cash Removed from Account	f	\N	\N	5	2025-03-09 00:00:00
1270	24	21	\N	\N	2035.19	withdrawal	2025-01-22 00:00:00	ATM Cash Withdrawal	f	\N	\N	47	2025-01-22 00:00:00
1271	24	\N	1	\N	2553.47	withdrawal	2025-03-04 00:00:00	Cash Removed from Account	f	22	\N	2	2025-03-04 00:00:00
1272	24	1	\N	4	4142.73	fee	2025-04-21 00:00:00	ATM Withdrawal Fee	f	12	\N	30	2025-04-21 00:00:00
1273	24	25	\N	\N	4983.92	withdrawal	2025-06-20 00:00:00	ATM Cash Withdrawal	f	\N	3	22	2025-06-20 00:00:00
1274	24	45	\N	\N	2267.40	income	2025-03-31 00:00:00	Salary Payment	f	12	\N	29	2025-03-31 00:00:00
1275	24	19	\N	\N	763.84	fee	2025-04-06 00:00:00	ATM Withdrawal Fee	f	4	\N	39	2025-04-06 00:00:00
1276	24	42	\N	\N	958.92	expense	2025-06-21 00:00:00	Streaming Subscription	f	\N	\N	15	2025-06-21 00:00:00
1277	24	\N	2	3	3993.49	fee	2025-06-02 00:00:00	Monthly Account Fee	f	\N	\N	11	2025-06-02 00:00:00
1278	24	12	\N	9	1425.47	expense	2025-04-25 00:00:00	Clothing Store Purchase	f	7	\N	13	2025-04-25 00:00:00
1279	24	37	\N	2	4858.92	income	2025-04-04 00:00:00	Interest Income	f	\N	\N	0	2025-04-04 00:00:00
1280	24	29	\N	8	706.01	income	2025-04-11 00:00:00	Freelance Project Payment	f	9	\N	20	2025-04-11 00:00:00
1281	24	41	\N	5	2278.62	expense	2025-05-18 00:00:00	Coffee Shop	f	\N	\N	3	2025-05-18 00:00:00
1282	24	\N	12	\N	2518.50	withdrawal	2025-04-09 00:00:00	Cash Removed from Account	t	\N	\N	10	2025-04-09 00:00:00
1283	24	39	\N	5	1606.40	transfer	2025-06-10 00:00:00	Transfer to Savings	f	\N	\N	41	2025-06-10 00:00:00
1284	24	37	\N	\N	177.10	fee	2025-05-11 00:00:00	Monthly Account Fee	f	11	\N	34	2025-05-11 00:00:00
1285	24	\N	9	4	4647.96	transfer	2025-02-18 00:00:00	Bank Internal Transfer	f	16	\N	8	2025-02-18 00:00:00
1286	24	1	\N	\N	1864.84	transfer	2025-02-26 00:00:00	Transfer from Checking	f	21	\N	5	2025-02-26 00:00:00
1287	24	29	\N	4	3184.15	transfer	2025-05-29 00:00:00	Transfer from Checking	f	14	\N	44	2025-05-29 00:00:00
1288	24	\N	4	6	3283.76	deposit	2024-06-08 00:00:00	Cheque Deposit	f	3	\N	39	2024-06-08 00:00:00
1289	24	45	\N	9	1923.45	deposit	2024-01-01 00:00:00	Cash Deposit at Branch	f	\N	\N	35	2024-01-01 00:00:00
1290	24	11	\N	8	3266.24	income	2024-04-12 00:00:00	Salary Payment	f	23	\N	50	2024-04-12 00:00:00
1291	24	\N	1	9	3863.35	transfer	2024-02-17 00:00:00	Bank Internal Transfer	f	\N	1	11	2024-02-17 00:00:00
1292	24	23	\N	\N	2409.31	withdrawal	2024-02-27 00:00:00	Cash Removed from Account	f	\N	\N	29	2024-02-27 00:00:00
1293	24	41	\N	\N	353.69	income	2024-03-05 00:00:00	Bonus Received	f	6	\N	48	2024-03-05 00:00:00
1294	24	\N	7	6	4838.62	income	2024-04-14 00:00:00	Interest Income	f	10	\N	48	2024-04-14 00:00:00
1295	24	\N	12	\N	1903.35	deposit	2024-04-07 00:00:00	Cash Deposit at Branch	f	\N	\N	43	2024-04-07 00:00:00
1296	24	30	\N	\N	1999.05	income	2024-05-20 00:00:00	Interest Income	f	\N	\N	33	2024-05-20 00:00:00
1297	24	7	\N	\N	2954.90	transfer	2024-03-16 00:00:00	Transfer to Savings	t	\N	\N	33	2024-03-16 00:00:00
1298	24	41	\N	1	1643.98	transfer	2024-02-23 00:00:00	Bank Internal Transfer	f	\N	3	1	2024-02-23 00:00:00
1299	24	21	\N	5	730.24	income	2024-05-14 00:00:00	Interest Income	f	\N	1	8	2024-05-14 00:00:00
1300	24	15	\N	3	146.06	fee	2024-03-12 00:00:00	Service Charge	f	20	\N	2	2024-03-12 00:00:00
1301	24	\N	6	\N	2754.78	deposit	2024-03-31 00:00:00	Online Deposit	f	\N	\N	9	2024-03-31 00:00:00
1302	24	22	\N	6	4023.55	fee	2024-04-24 00:00:00	Service Charge	f	\N	\N	37	2024-04-24 00:00:00
1303	24	1	\N	9	2998.53	withdrawal	2024-02-22 00:00:00	Cash Removed from Account	f	\N	\N	33	2024-02-22 00:00:00
1304	24	12	\N	\N	4169.93	deposit	2024-04-07 00:00:00	Cheque Deposit	f	10	\N	18	2024-04-07 00:00:00
1305	24	48	\N	\N	1184.92	expense	2024-02-05 00:00:00	Mobile Data Recharge	f	\N	\N	23	2024-02-05 00:00:00
1306	24	30	\N	8	1030.68	withdrawal	2024-01-15 00:00:00	Cash Removed from Account	f	\N	\N	28	2024-01-15 00:00:00
1307	24	10	\N	\N	4455.16	deposit	2024-05-09 00:00:00	Online Deposit	t	\N	\N	13	2024-05-09 00:00:00
1308	24	26	\N	7	3410.99	fee	2024-04-07 00:00:00	ATM Withdrawal Fee	f	\N	\N	13	2024-04-07 00:00:00
1309	24	35	\N	2	1681.76	withdrawal	2024-01-18 00:00:00	Cash Removed from Account	t	\N	\N	40	2024-01-18 00:00:00
1310	24	9	\N	4	2313.06	deposit	2024-01-09 00:00:00	Cheque Deposit	f	\N	\N	9	2024-01-09 00:00:00
1311	24	\N	3	\N	468.33	income	2024-03-18 00:00:00	Bonus Received	f	22	3	46	2024-03-18 00:00:00
1312	24	24	\N	6	2710.59	income	2024-02-19 00:00:00	Refund Processed	f	7	\N	42	2024-02-19 00:00:00
1313	24	12	\N	5	2414.48	transfer	2024-05-30 00:00:00	Transfer to Savings	f	2	\N	8	2024-05-30 00:00:00
1314	24	44	\N	7	650.58	income	2024-06-01 00:00:00	Freelance Project Payment	f	23	\N	24	2024-06-01 00:00:00
1315	24	\N	1	\N	4727.21	income	2024-02-11 00:00:00	Refund Processed	f	16	\N	10	2024-02-11 00:00:00
1316	24	\N	11	2	4474.81	fee	2024-05-22 00:00:00	ATM Withdrawal Fee	f	\N	\N	10	2024-05-22 00:00:00
1317	24	24	\N	\N	4660.73	fee	2024-05-28 00:00:00	Monthly Account Fee	f	\N	\N	34	2024-05-28 00:00:00
1318	24	6	\N	\N	4818.21	transfer	2024-04-19 00:00:00	Transfer to Savings	f	\N	2	23	2024-04-19 00:00:00
1319	24	16	\N	\N	1280.15	transfer	2024-02-18 00:00:00	Transfer from Checking	f	\N	\N	7	2024-02-18 00:00:00
1320	24	40	\N	\N	2942.49	expense	2024-05-10 00:00:00	Grocery Store Purchase	f	\N	\N	6	2024-05-10 00:00:00
1321	24	10	\N	\N	1481.56	deposit	2024-03-21 00:00:00	Cheque Deposit	f	10	\N	9	2024-03-21 00:00:00
1322	24	43	\N	9	3880.48	withdrawal	2024-05-18 00:00:00	ATM Cash Withdrawal	f	15	\N	12	2024-05-18 00:00:00
1323	24	10	\N	\N	1012.49	expense	2024-02-05 00:00:00	Public Transport Fare	f	\N	\N	3	2024-02-05 00:00:00
1324	24	27	\N	\N	95.15	fee	2024-06-15 00:00:00	Monthly Account Fee	f	\N	\N	11	2024-06-15 00:00:00
1325	24	6	\N	8	2996.69	withdrawal	2024-04-20 00:00:00	ATM Cash Withdrawal	f	23	\N	28	2024-04-20 00:00:00
1326	24	\N	7	\N	3016.92	transfer	2024-06-24 00:00:00	Transfer to Savings	f	\N	\N	16	2024-06-24 00:00:00
1327	24	\N	6	\N	842.14	fee	2024-02-22 00:00:00	Monthly Account Fee	f	\N	\N	10	2024-02-22 00:00:00
1328	24	\N	4	9	4480.28	withdrawal	2024-03-14 00:00:00	Cash Removed from Account	f	\N	\N	32	2024-03-14 00:00:00
1329	24	24	\N	2	4240.81	income	2024-06-14 00:00:00	Bonus Received	f	\N	\N	17	2024-06-14 00:00:00
1330	24	47	\N	\N	3640.09	transfer	2024-05-07 00:00:00	Bank Internal Transfer	f	\N	\N	1	2024-05-07 00:00:00
1331	24	41	\N	4	2423.05	expense	2024-05-02 00:00:00	Grocery Store Purchase	f	\N	\N	15	2024-05-02 00:00:00
1332	24	19	\N	\N	3327.44	transfer	2024-04-22 00:00:00	Bank Internal Transfer	f	15	\N	48	2024-04-22 00:00:00
1333	24	31	\N	6	4307.01	withdrawal	2024-01-06 00:00:00	ATM Cash Withdrawal	f	\N	\N	5	2024-01-06 00:00:00
1334	24	37	\N	\N	618.61	fee	2024-02-26 00:00:00	Monthly Account Fee	f	\N	1	19	2024-02-26 00:00:00
1335	24	16	\N	3	2030.90	deposit	2024-05-10 00:00:00	Online Deposit	f	1	\N	0	2024-05-10 00:00:00
1336	24	8	\N	\N	3447.40	fee	2024-03-11 00:00:00	Monthly Account Fee	f	\N	\N	14	2024-03-11 00:00:00
1337	24	\N	2	5	452.40	income	2024-03-09 00:00:00	Refund Processed	t	\N	3	29	2024-03-09 00:00:00
1338	24	\N	2	7	3964.77	deposit	2024-04-04 00:00:00	Cash Deposit at Branch	f	17	\N	26	2024-04-04 00:00:00
1339	24	14	\N	\N	4898.24	fee	2024-01-16 00:00:00	Monthly Account Fee	f	20	\N	45	2024-01-16 00:00:00
1340	24	8	\N	\N	2874.47	withdrawal	2024-02-01 00:00:00	Cash Removed from Account	f	\N	\N	42	2024-02-01 00:00:00
1341	24	48	\N	\N	1819.52	deposit	2024-01-27 00:00:00	Online Deposit	t	5	\N	39	2024-01-27 00:00:00
1342	24	\N	11	\N	2217.38	income	2024-03-09 00:00:00	Salary Payment	f	\N	\N	21	2024-03-09 00:00:00
1343	24	10	\N	7	4886.77	expense	2024-01-06 00:00:00	Mobile Data Recharge	t	\N	\N	48	2024-01-06 00:00:00
1344	24	\N	2	\N	1307.60	income	2024-01-18 00:00:00	Bonus Received	f	\N	\N	34	2024-01-18 00:00:00
1345	24	46	\N	6	143.71	withdrawal	2024-05-29 00:00:00	Cash Removed from Account	f	2	\N	35	2024-05-29 00:00:00
1346	24	36	\N	7	4117.56	income	2024-06-22 00:00:00	Dividend Payment	f	\N	1	24	2024-06-22 00:00:00
1347	24	39	\N	3	4785.39	income	2024-02-01 00:00:00	Refund Processed	f	\N	\N	30	2024-02-01 00:00:00
1348	24	\N	2	\N	2474.57	fee	2024-02-20 00:00:00	Service Charge	f	\N	\N	48	2024-02-20 00:00:00
1349	24	9	\N	\N	1260.44	transfer	2024-03-26 00:00:00	Bank Internal Transfer	t	\N	\N	30	2024-03-26 00:00:00
1350	24	17	\N	\N	3522.92	expense	2024-01-03 00:00:00	Utility Bill Payment	t	\N	\N	17	2024-01-03 00:00:00
1351	24	\N	7	9	1312.16	expense	2024-05-31 00:00:00	Monthly Rent Payment	t	\N	1	17	2024-05-31 00:00:00
1352	24	3	\N	3	3293.86	deposit	2024-04-02 00:00:00	Cash Deposit at Branch	f	\N	5	2	2024-04-02 00:00:00
1353	24	32	\N	2	4693.84	deposit	2024-04-03 00:00:00	Cheque Deposit	f	\N	\N	32	2024-04-03 00:00:00
1354	24	\N	5	4	3478.39	income	2024-02-20 00:00:00	Dividend Payment	f	\N	\N	48	2024-02-20 00:00:00
1355	24	43	\N	8	3595.55	transfer	2024-02-18 00:00:00	Transfer from Checking	f	17	\N	48	2024-02-18 00:00:00
1356	1	4	\N	\N	1249.67	expense	2025-04-03 00:00:00	Public Transport Fare	f	\N	\N	47	2025-04-03 00:00:00
1357	1	13	\N	\N	369.44	withdrawal	2025-05-22 00:00:00	Cash Removed from Account	f	\N	\N	47	2025-05-22 00:00:00
1358	1	16	\N	\N	4786.16	deposit	2025-03-01 00:00:00	Online Deposit	f	\N	\N	7	2025-03-01 00:00:00
1359	1	\N	10	\N	3653.03	fee	2025-05-21 00:00:00	Monthly Account Fee	f	\N	\N	3	2025-05-21 00:00:00
1360	1	50	\N	\N	2321.13	fee	2025-06-18 00:00:00	Service Charge	t	17	\N	2	2025-06-18 00:00:00
1361	1	\N	7	8	3412.28	transfer	2025-06-15 00:00:00	Bank Internal Transfer	f	21	\N	6	2025-06-15 00:00:00
1362	1	45	\N	\N	4960.52	income	2025-02-25 00:00:00	Freelance Project Payment	f	\N	\N	48	2025-02-25 00:00:00
1363	1	6	\N	8	1190.83	income	2025-01-14 00:00:00	Bonus Received	f	6	\N	12	2025-01-14 00:00:00
1364	1	39	\N	6	517.13	fee	2025-04-21 00:00:00	Service Charge	f	19	\N	14	2025-04-21 00:00:00
1365	1	50	\N	5	827.20	withdrawal	2025-04-10 00:00:00	ATM Cash Withdrawal	f	\N	1	37	2025-04-10 00:00:00
1366	1	9	\N	7	200.39	transfer	2025-01-16 00:00:00	Transfer to Savings	f	\N	\N	1	2025-01-16 00:00:00
1367	1	45	\N	4	3846.29	transfer	2025-02-16 00:00:00	Transfer from Checking	f	13	\N	4	2025-02-16 00:00:00
1368	1	\N	6	\N	2873.82	fee	2025-04-01 00:00:00	ATM Withdrawal Fee	f	\N	4	31	2025-04-01 00:00:00
1369	1	1	\N	3	3312.67	fee	2025-03-27 00:00:00	Monthly Account Fee	f	\N	\N	10	2025-03-27 00:00:00
1370	1	\N	11	\N	4366.63	fee	2025-01-10 00:00:00	Service Charge	f	13	\N	18	2025-01-10 00:00:00
1371	1	40	\N	3	4053.61	transfer	2025-06-24 00:00:00	Transfer from Checking	f	\N	\N	7	2025-06-24 00:00:00
1372	1	27	\N	\N	215.72	withdrawal	2025-01-05 00:00:00	Cash Removed from Account	f	10	\N	33	2025-01-05 00:00:00
1373	1	\N	4	\N	1739.93	withdrawal	2025-02-01 00:00:00	ATM Cash Withdrawal	f	11	\N	46	2025-02-01 00:00:00
1374	1	\N	8	\N	3110.93	transfer	2025-05-09 00:00:00	Bank Internal Transfer	f	16	\N	11	2025-05-09 00:00:00
1375	1	27	\N	3	1076.17	deposit	2025-05-22 00:00:00	Cheque Deposit	f	\N	\N	36	2025-05-22 00:00:00
1376	1	2	\N	\N	78.55	income	2025-01-07 00:00:00	Salary Payment	f	19	\N	19	2025-01-07 00:00:00
1377	1	40	\N	1	3318.51	expense	2025-03-22 00:00:00	Fuel Station	f	11	\N	21	2025-03-22 00:00:00
1378	1	20	\N	8	101.55	transfer	2025-03-29 00:00:00	Transfer to Savings	f	9	\N	34	2025-03-29 00:00:00
1379	1	\N	12	8	417.44	fee	2025-03-16 00:00:00	ATM Withdrawal Fee	f	13	4	27	2025-03-16 00:00:00
1380	1	3	\N	\N	4209.18	transfer	2025-04-12 00:00:00	Transfer from Checking	f	\N	\N	34	2025-04-12 00:00:00
1381	1	\N	7	\N	2241.15	withdrawal	2025-03-23 00:00:00	ATM Cash Withdrawal	f	\N	\N	27	2025-03-23 00:00:00
1382	1	32	\N	7	3346.89	fee	2025-06-08 00:00:00	Monthly Account Fee	f	\N	\N	15	2025-06-08 00:00:00
1383	1	19	\N	\N	1208.31	transfer	2025-03-12 00:00:00	Transfer to Savings	f	\N	\N	11	2025-03-12 00:00:00
1384	1	\N	8	\N	3463.83	withdrawal	2025-02-27 00:00:00	ATM Cash Withdrawal	f	\N	\N	35	2025-02-27 00:00:00
1385	1	25	\N	\N	2746.21	income	2025-04-01 00:00:00	Bonus Received	f	\N	\N	6	2025-04-01 00:00:00
1386	1	43	\N	\N	691.82	withdrawal	2025-01-04 00:00:00	Cash Removed from Account	t	\N	\N	1	2025-01-04 00:00:00
1387	1	1	\N	\N	131.61	deposit	2025-01-15 00:00:00	Cash Deposit at Branch	t	17	5	40	2025-01-15 00:00:00
1388	1	14	\N	3	3254.31	fee	2025-05-18 00:00:00	Monthly Account Fee	f	\N	\N	17	2025-05-18 00:00:00
1389	1	1	\N	8	1832.02	income	2025-01-07 00:00:00	Refund Processed	f	\N	\N	37	2025-01-07 00:00:00
1390	1	5	\N	1	938.05	withdrawal	2025-05-01 00:00:00	ATM Cash Withdrawal	f	\N	\N	50	2025-05-01 00:00:00
1391	1	\N	7	8	4524.55	fee	2025-05-06 00:00:00	Monthly Account Fee	f	\N	\N	1	2025-05-06 00:00:00
1392	1	\N	6	4	1611.92	fee	2025-01-02 00:00:00	Monthly Account Fee	f	\N	\N	1	2025-01-02 00:00:00
1393	1	40	\N	8	70.10	fee	2025-03-25 00:00:00	Monthly Account Fee	f	\N	\N	8	2025-03-25 00:00:00
1394	1	13	\N	\N	3467.98	expense	2025-04-04 00:00:00	Monthly Rent Payment	t	\N	1	9	2025-04-04 00:00:00
1395	1	40	\N	3	4368.18	expense	2025-06-15 00:00:00	Public Transport Fare	f	12	\N	40	2025-06-15 00:00:00
1396	2	2	\N	1	3348.86	fee	2025-01-16 00:00:00	Service Charge	f	\N	\N	14	2025-01-16 00:00:00
1397	2	46	\N	1	1983.86	deposit	2025-06-16 00:00:00	Cash Deposit at Branch	f	19	5	48	2025-06-16 00:00:00
1398	2	4	\N	8	3229.48	expense	2025-02-21 00:00:00	Coffee Shop	f	\N	\N	50	2025-02-21 00:00:00
1399	2	48	\N	1	1215.40	withdrawal	2025-06-22 00:00:00	ATM Cash Withdrawal	f	\N	\N	11	2025-06-22 00:00:00
1400	2	32	\N	6	3356.69	fee	2025-06-30 00:00:00	ATM Withdrawal Fee	f	\N	\N	29	2025-06-30 00:00:00
1401	2	46	\N	9	3030.65	fee	2025-05-24 00:00:00	ATM Withdrawal Fee	f	13	\N	11	2025-05-24 00:00:00
1402	2	26	\N	\N	3705.61	withdrawal	2025-01-06 00:00:00	ATM Cash Withdrawal	f	\N	\N	10	2025-01-06 00:00:00
1403	2	40	\N	\N	1245.53	transfer	2025-06-09 00:00:00	Bank Internal Transfer	f	13	\N	28	2025-06-09 00:00:00
1404	2	50	\N	\N	207.84	transfer	2025-03-02 00:00:00	Transfer from Checking	f	\N	\N	43	2025-03-02 00:00:00
1405	2	39	\N	4	3874.25	transfer	2025-06-12 00:00:00	Transfer from Checking	f	\N	\N	9	2025-06-12 00:00:00
1406	2	6	\N	9	4025.69	expense	2025-03-08 00:00:00	Grocery Store Purchase	t	\N	\N	22	2025-03-08 00:00:00
1407	2	\N	3	\N	4049.26	deposit	2025-03-21 00:00:00	Online Deposit	f	\N	3	37	2025-03-21 00:00:00
1408	2	48	\N	\N	2570.91	withdrawal	2025-06-12 00:00:00	Cash Removed from Account	f	1	\N	2	2025-06-12 00:00:00
1409	2	\N	3	\N	2138.76	deposit	2025-04-18 00:00:00	Online Deposit	f	\N	\N	17	2025-04-18 00:00:00
1410	2	\N	3	\N	3972.49	income	2025-05-14 00:00:00	Refund Processed	f	14	\N	33	2025-05-14 00:00:00
1411	2	23	\N	1	3744.51	fee	2025-04-01 00:00:00	Monthly Account Fee	f	\N	\N	15	2025-04-01 00:00:00
1412	2	15	\N	\N	2610.73	fee	2025-01-02 00:00:00	ATM Withdrawal Fee	f	\N	\N	11	2025-01-02 00:00:00
1413	2	39	\N	8	3097.37	expense	2025-01-01 00:00:00	Monthly Rent Payment	f	\N	\N	37	2025-01-01 00:00:00
1414	2	16	\N	1	4868.65	transfer	2025-01-14 00:00:00	Transfer to Savings	f	\N	\N	41	2025-01-14 00:00:00
1415	2	12	\N	1	897.57	deposit	2025-02-02 00:00:00	Online Deposit	f	\N	\N	23	2025-02-02 00:00:00
1416	2	13	\N	\N	2561.99	expense	2025-01-17 00:00:00	Restaurant Dinner	f	\N	\N	6	2025-01-17 00:00:00
1417	2	47	\N	\N	264.68	deposit	2025-03-25 00:00:00	Online Deposit	f	\N	\N	42	2025-03-25 00:00:00
1418	2	48	\N	\N	4197.91	deposit	2025-02-18 00:00:00	Cash Deposit at Branch	f	\N	\N	18	2025-02-18 00:00:00
1419	2	\N	4	4	2284.64	transfer	2025-04-12 00:00:00	Transfer from Checking	f	3	\N	14	2025-04-12 00:00:00
1420	2	7	\N	5	3740.47	transfer	2025-02-15 00:00:00	Transfer from Checking	f	\N	4	37	2025-02-15 00:00:00
1421	2	45	\N	2	1979.35	expense	2025-01-08 00:00:00	Public Transport Fare	f	\N	\N	44	2025-01-08 00:00:00
1422	2	\N	4	\N	4413.36	income	2025-03-25 00:00:00	Refund Processed	f	\N	\N	31	2025-03-25 00:00:00
1423	2	5	\N	\N	2648.67	transfer	2025-06-21 00:00:00	Transfer from Checking	f	\N	5	31	2025-06-21 00:00:00
1424	2	\N	3	3	1050.72	expense	2025-03-15 00:00:00	Mobile Data Recharge	f	\N	\N	29	2025-03-15 00:00:00
1425	2	25	\N	\N	160.19	expense	2025-06-20 00:00:00	Utility Bill Payment	f	\N	2	20	2025-06-20 00:00:00
1426	2	26	\N	5	893.98	income	2025-05-04 00:00:00	Refund Processed	f	\N	\N	3	2025-05-04 00:00:00
1427	2	35	\N	\N	4768.22	fee	2025-03-24 00:00:00	ATM Withdrawal Fee	f	17	3	15	2025-03-24 00:00:00
1428	2	47	\N	4	123.35	income	2025-03-14 00:00:00	Refund Processed	f	\N	\N	33	2025-03-14 00:00:00
1429	2	13	\N	7	4010.51	expense	2025-04-18 00:00:00	Restaurant Dinner	f	\N	\N	43	2025-04-18 00:00:00
1430	2	6	\N	4	4418.44	income	2025-01-28 00:00:00	Refund Processed	f	3	\N	50	2025-01-28 00:00:00
1431	2	40	\N	\N	46.00	deposit	2025-01-29 00:00:00	Cheque Deposit	f	13	\N	1	2025-01-29 00:00:00
1432	2	\N	3	9	1064.67	deposit	2025-05-07 00:00:00	Cash Deposit at Branch	f	\N	\N	49	2025-05-07 00:00:00
1433	3	\N	5	\N	4085.72	fee	2025-03-23 00:00:00	Monthly Account Fee	f	7	\N	36	2025-03-23 00:00:00
1434	3	23	\N	\N	348.76	transfer	2025-02-11 00:00:00	Transfer from Checking	f	\N	\N	17	2025-02-11 00:00:00
1435	3	16	\N	\N	3113.34	transfer	2025-05-31 00:00:00	Transfer from Checking	f	20	\N	20	2025-05-31 00:00:00
1436	3	\N	6	2	756.79	income	2025-06-22 00:00:00	Bonus Received	t	\N	\N	36	2025-06-22 00:00:00
1437	3	\N	5	\N	4812.73	income	2025-06-12 00:00:00	Freelance Project Payment	f	\N	\N	21	2025-06-12 00:00:00
1438	3	5	\N	\N	121.74	fee	2025-04-16 00:00:00	Service Charge	f	\N	\N	7	2025-04-16 00:00:00
1439	3	37	\N	9	1800.35	transfer	2025-01-06 00:00:00	Transfer to Savings	f	\N	2	39	2025-01-06 00:00:00
1440	3	14	\N	7	1550.94	income	2025-01-06 00:00:00	Interest Income	t	6	\N	3	2025-01-06 00:00:00
1441	3	14	\N	9	1423.32	transfer	2025-06-03 00:00:00	Transfer from Checking	f	\N	\N	44	2025-06-03 00:00:00
1442	3	23	\N	8	684.73	withdrawal	2025-04-04 00:00:00	ATM Cash Withdrawal	f	\N	\N	27	2025-04-04 00:00:00
1443	3	\N	7	\N	1880.47	deposit	2025-03-01 00:00:00	Cheque Deposit	f	\N	\N	38	2025-03-01 00:00:00
1444	3	7	\N	\N	522.29	expense	2025-05-01 00:00:00	Public Transport Fare	f	\N	\N	45	2025-05-01 00:00:00
1445	3	1	\N	7	4726.51	income	2025-01-11 00:00:00	Dividend Payment	f	\N	\N	12	2025-01-11 00:00:00
1446	3	29	\N	\N	4856.26	withdrawal	2025-03-19 00:00:00	Cash Removed from Account	f	15	\N	14	2025-03-19 00:00:00
1447	3	36	\N	\N	3423.56	withdrawal	2025-04-03 00:00:00	ATM Cash Withdrawal	f	\N	\N	11	2025-04-03 00:00:00
1448	3	36	\N	\N	4922.08	deposit	2025-06-25 00:00:00	Cash Deposit at Branch	f	\N	\N	25	2025-06-25 00:00:00
1449	3	\N	5	\N	4787.82	withdrawal	2025-06-20 00:00:00	ATM Cash Withdrawal	f	17	\N	10	2025-06-20 00:00:00
1450	3	49	\N	2	359.86	expense	2025-01-20 00:00:00	Mobile Data Recharge	t	4	\N	22	2025-01-20 00:00:00
1451	3	33	\N	5	4318.37	fee	2025-03-06 00:00:00	ATM Withdrawal Fee	f	\N	\N	16	2025-03-06 00:00:00
1452	3	40	\N	5	1847.50	transfer	2025-03-25 00:00:00	Transfer to Savings	f	4	1	49	2025-03-25 00:00:00
1453	3	\N	7	\N	4384.27	withdrawal	2025-02-17 00:00:00	ATM Cash Withdrawal	f	\N	\N	31	2025-02-17 00:00:00
1454	3	1	\N	3	3924.02	fee	2025-04-05 00:00:00	Monthly Account Fee	t	9	\N	38	2025-04-05 00:00:00
1455	3	2	\N	\N	1636.39	expense	2025-06-05 00:00:00	Streaming Subscription	f	12	\N	34	2025-06-05 00:00:00
1456	3	\N	5	\N	3932.76	withdrawal	2025-05-31 00:00:00	Cash Removed from Account	f	\N	\N	38	2025-05-31 00:00:00
1457	3	34	\N	\N	2315.67	deposit	2025-06-19 00:00:00	Cash Deposit at Branch	f	2	\N	41	2025-06-19 00:00:00
1458	3	17	\N	9	2060.61	fee	2025-04-01 00:00:00	ATM Withdrawal Fee	f	\N	\N	47	2025-04-01 00:00:00
1459	3	\N	5	2	118.05	income	2025-04-27 00:00:00	Freelance Project Payment	f	9	\N	12	2025-04-27 00:00:00
1460	3	46	\N	\N	3939.80	deposit	2025-03-03 00:00:00	Cash Deposit at Branch	f	\N	4	0	2025-03-03 00:00:00
1461	3	\N	7	\N	4267.10	deposit	2025-01-19 00:00:00	Online Deposit	t	\N	3	35	2025-01-19 00:00:00
1462	3	34	\N	\N	2110.62	withdrawal	2025-03-26 00:00:00	ATM Cash Withdrawal	f	5	\N	3	2025-03-26 00:00:00
1463	3	\N	6	\N	4683.45	deposit	2025-02-08 00:00:00	Online Deposit	f	10	\N	5	2025-02-08 00:00:00
1464	3	45	\N	\N	723.62	withdrawal	2025-06-29 00:00:00	Cash Removed from Account	f	\N	\N	41	2025-06-29 00:00:00
1465	3	8	\N	6	2902.54	transfer	2025-06-20 00:00:00	Bank Internal Transfer	f	13	\N	29	2025-06-20 00:00:00
1466	3	6	\N	2	696.68	fee	2025-06-26 00:00:00	Service Charge	t	\N	3	44	2025-06-26 00:00:00
1467	3	5	\N	\N	2636.72	expense	2025-02-21 00:00:00	Grocery Store Purchase	t	\N	\N	5	2025-02-21 00:00:00
1468	4	\N	8	\N	1678.49	fee	2025-03-01 00:00:00	ATM Withdrawal Fee	f	\N	2	33	2025-03-01 00:00:00
1469	4	\N	8	\N	37.13	income	2025-02-24 00:00:00	Interest Income	f	19	\N	43	2025-02-24 00:00:00
1470	4	\N	8	5	2490.31	income	2025-05-20 00:00:00	Freelance Project Payment	f	17	\N	19	2025-05-20 00:00:00
1471	4	14	\N	\N	293.83	deposit	2025-02-28 00:00:00	Cash Deposit at Branch	f	\N	3	24	2025-02-28 00:00:00
1472	4	\N	8	\N	3964.19	income	2025-06-13 00:00:00	Salary Payment	f	\N	3	33	2025-06-13 00:00:00
1474	4	26	\N	3	879.55	deposit	2025-04-15 00:00:00	Cash Deposit at Branch	f	\N	1	19	2025-04-15 00:00:00
1475	4	41	\N	\N	3993.47	withdrawal	2025-05-08 00:00:00	Cash Removed from Account	f	\N	\N	34	2025-05-08 00:00:00
1476	4	16	\N	\N	2683.40	withdrawal	2025-03-29 00:00:00	Cash Removed from Account	f	\N	\N	35	2025-03-29 00:00:00
1477	4	5	\N	\N	115.58	income	2025-06-03 00:00:00	Dividend Payment	f	\N	\N	49	2025-06-03 00:00:00
1478	4	5	\N	\N	3308.81	withdrawal	2025-02-23 00:00:00	Cash Removed from Account	f	\N	\N	35	2025-02-23 00:00:00
1479	4	44	\N	5	4559.09	income	2025-04-01 00:00:00	Bonus Received	f	\N	\N	34	2025-04-01 00:00:00
1480	4	\N	8	1	376.24	fee	2025-06-07 00:00:00	Service Charge	f	\N	\N	9	2025-06-07 00:00:00
1481	4	31	\N	8	4583.18	fee	2025-02-12 00:00:00	ATM Withdrawal Fee	f	18	\N	29	2025-02-12 00:00:00
1482	4	34	\N	7	1403.80	fee	2025-05-24 00:00:00	ATM Withdrawal Fee	f	\N	\N	4	2025-05-24 00:00:00
1483	4	\N	8	7	1878.08	income	2025-03-02 00:00:00	Freelance Project Payment	f	15	\N	44	2025-03-02 00:00:00
1484	4	48	\N	\N	3714.23	deposit	2025-03-07 00:00:00	Cheque Deposit	t	\N	\N	19	2025-03-07 00:00:00
1485	4	19	\N	3	3612.72	expense	2025-01-30 00:00:00	Monthly Rent Payment	f	19	\N	49	2025-01-30 00:00:00
1486	4	3	\N	\N	2450.25	deposit	2025-03-07 00:00:00	Online Deposit	f	\N	\N	49	2025-03-07 00:00:00
1487	4	20	\N	3	3549.64	withdrawal	2025-01-21 00:00:00	ATM Cash Withdrawal	t	\N	\N	16	2025-01-21 00:00:00
1488	24	7	\N	\N	398.46	fee	2025-06-18 00:00:00	Service Charge	f	\N	\N	9	2025-06-18 00:00:00
1491	4	16	\N	\N	4853.83	income	2025-04-16 00:00:00	Freelance Project Payment	f	\N	\N	10	2025-04-16 00:00:00
1490	4	29	\N	\N	4840.38	withdrawal	2025-02-01 00:00:00	Cash Removed from 	f	\N	\N	37	2025-01-02 00:00:00
1502	10	\N	6	9	1591.33	transfer	2025-01-11 00:00:00	Transfer to Savings	f	\N	\N	3	2025-01-11 00:00:00
1503	10	\N	2	\N	3767.20	deposit	2025-05-24 00:00:00	Cheque Deposit	f	\N	2	11	2025-05-24 00:00:00
1504	10	\N	7	\N	1279.57	transfer	2025-02-07 00:00:00	Transfer from Checking	f	\N	4	14	2025-02-07 00:00:00
1505	10	16	\N	2	710.49	transfer	2025-04-28 00:00:00	Bank Internal Transfer	t	\N	\N	39	2025-04-28 00:00:00
1506	10	14	\N	1	1232.10	withdrawal	2025-03-25 00:00:00	Cash Removed from Account	f	11	\N	20	2025-03-25 00:00:00
1507	10	34	\N	\N	4003.49	income	2025-06-22 00:00:00	Refund Processed	f	\N	\N	15	2025-06-22 00:00:00
1508	10	27	\N	\N	2237.88	withdrawal	2025-03-07 00:00:00	Cash Removed from Account	f	3	4	40	2025-03-07 00:00:00
1509	10	14	\N	4	4398.71	transfer	2025-04-24 00:00:00	Bank Internal Transfer	f	\N	\N	10	2025-04-24 00:00:00
1510	10	\N	7	2	854.27	deposit	2025-03-04 00:00:00	Cash Deposit at Branch	f	\N	\N	15	2025-03-04 00:00:00
1511	10	\N	5	\N	1825.38	withdrawal	2025-03-09 00:00:00	Cash Removed from Account	f	22	\N	25	2025-03-09 00:00:00
1512	10	\N	3	2	20.58	income	2025-04-24 00:00:00	Dividend Payment	f	\N	\N	25	2025-04-24 00:00:00
1513	10	24	\N	\N	1779.57	deposit	2025-04-14 00:00:00	Cheque Deposit	f	\N	\N	2	2025-04-14 00:00:00
1514	10	8	\N	\N	1690.64	deposit	2025-04-20 00:00:00	Online Deposit	f	\N	\N	0	2025-04-20 00:00:00
1515	10	\N	8	2	4642.56	deposit	2025-02-17 00:00:00	Cash Deposit at Branch	f	1	\N	2	2025-02-17 00:00:00
1516	10	18	\N	\N	1994.56	fee	2025-05-02 00:00:00	Monthly Account Fee	t	\N	\N	19	2025-05-02 00:00:00
1517	10	\N	8	1	413.86	expense	2025-01-21 00:00:00	Mobile Data Recharge	f	15	\N	44	2025-01-21 00:00:00
1518	10	47	\N	2	136.97	expense	2025-01-06 00:00:00	Restaurant Dinner	f	15	\N	3	2025-01-06 00:00:00
1519	10	26	\N	5	696.61	income	2025-03-10 00:00:00	Salary Payment	f	11	\N	23	2025-03-10 00:00:00
1520	11	8	\N	\N	3609.10	expense	2025-01-10 00:00:00	Fuel Station	t	\N	\N	42	2025-01-10 00:00:00
1521	11	\N	8	\N	3680.95	deposit	2025-02-04 00:00:00	Cheque Deposit	f	\N	\N	38	2025-02-04 00:00:00
1522	11	46	\N	\N	4797.02	withdrawal	2025-05-06 00:00:00	Cash Removed from Account	t	\N	\N	14	2025-05-06 00:00:00
1523	11	\N	12	9	4113.43	fee	2025-03-16 00:00:00	ATM Withdrawal Fee	f	\N	\N	26	2025-03-16 00:00:00
1524	11	32	\N	\N	2240.44	expense	2025-05-06 00:00:00	Utility Bill Payment	f	7	\N	49	2025-05-06 00:00:00
1525	11	9	\N	\N	4865.47	transfer	2025-04-11 00:00:00	Bank Internal Transfer	f	\N	\N	4	2025-04-11 00:00:00
1526	11	26	\N	\N	3685.18	transfer	2025-01-28 00:00:00	Transfer from Checking	f	4	\N	21	2025-01-28 00:00:00
1527	11	22	\N	2	1274.11	fee	2025-04-18 00:00:00	Service Charge	f	17	\N	28	2025-04-18 00:00:00
1528	11	40	\N	5	2842.50	expense	2025-05-27 00:00:00	Grocery Store Purchase	f	\N	\N	27	2025-05-27 00:00:00
1529	11	\N	6	7	4891.35	fee	2025-02-03 00:00:00	Monthly Account Fee	f	\N	\N	36	2025-02-03 00:00:00
1530	11	38	\N	\N	1071.08	fee	2025-02-14 00:00:00	ATM Withdrawal Fee	f	\N	\N	8	2025-02-14 00:00:00
1531	11	23	\N	\N	4377.69	deposit	2025-02-14 00:00:00	Online Deposit	t	\N	5	12	2025-02-14 00:00:00
1532	11	17	\N	\N	1977.71	deposit	2025-02-06 00:00:00	Online Deposit	f	\N	3	41	2025-02-06 00:00:00
1533	11	\N	9	\N	1121.92	transfer	2025-03-08 00:00:00	Bank Internal Transfer	f	\N	\N	12	2025-03-08 00:00:00
1534	11	24	\N	\N	4615.40	withdrawal	2025-05-10 00:00:00	Cash Removed from Account	f	\N	\N	50	2025-05-10 00:00:00
1535	11	26	\N	\N	4190.37	expense	2025-02-01 00:00:00	Restaurant Dinner	f	3	1	27	2025-02-01 00:00:00
1536	11	\N	5	\N	3428.40	income	2025-03-11 00:00:00	Salary Payment	f	\N	\N	15	2025-03-11 00:00:00
1537	11	\N	2	\N	3648.51	fee	2025-01-27 00:00:00	Service Charge	t	14	3	32	2025-01-27 00:00:00
1538	11	\N	5	\N	496.17	expense	2025-03-14 00:00:00	Fuel Station	f	\N	\N	19	2025-03-14 00:00:00
1539	11	35	\N	8	2122.39	income	2025-06-14 00:00:00	Salary Payment	f	\N	\N	21	2025-06-14 00:00:00
1540	11	42	\N	\N	1739.19	transfer	2025-04-04 00:00:00	Bank Internal Transfer	f	\N	\N	33	2025-04-04 00:00:00
1541	11	\N	12	2	3397.54	fee	2025-03-09 00:00:00	Service Charge	f	\N	3	2	2025-03-09 00:00:00
1542	11	8	\N	\N	605.39	transfer	2025-03-05 00:00:00	Bank Internal Transfer	f	\N	\N	10	2025-03-05 00:00:00
1543	11	15	\N	\N	595.98	fee	2025-05-23 00:00:00	Service Charge	f	\N	2	42	2025-05-23 00:00:00
1544	11	50	\N	\N	4710.23	fee	2025-05-07 00:00:00	Service Charge	f	\N	\N	7	2025-05-07 00:00:00
1545	11	2	\N	9	588.55	expense	2025-01-11 00:00:00	Restaurant Dinner	f	\N	\N	26	2025-01-11 00:00:00
1546	11	\N	12	1	1512.43	withdrawal	2025-06-21 00:00:00	ATM Cash Withdrawal	f	\N	3	46	2025-06-21 00:00:00
1547	11	40	\N	4	21.42	withdrawal	2025-05-27 00:00:00	ATM Cash Withdrawal	f	\N	\N	43	2025-05-27 00:00:00
1548	11	10	\N	6	2282.53	withdrawal	2025-05-04 00:00:00	ATM Cash Withdrawal	f	16	\N	20	2025-05-04 00:00:00
1549	11	44	\N	\N	4371.87	income	2025-05-06 00:00:00	Bonus Received	f	\N	\N	13	2025-05-06 00:00:00
1550	11	37	\N	7	549.50	transfer	2025-01-02 00:00:00	Transfer to Savings	f	\N	1	38	2025-01-02 00:00:00
1551	11	19	\N	8	761.33	fee	2025-04-17 00:00:00	Monthly Account Fee	f	18	1	26	2025-04-17 00:00:00
1552	11	3	\N	5	1281.96	expense	2025-01-22 00:00:00	Restaurant Dinner	f	16	\N	20	2025-01-22 00:00:00
1553	11	43	\N	1	547.69	transfer	2025-02-26 00:00:00	Transfer from Checking	f	14	\N	40	2025-02-26 00:00:00
1554	11	\N	9	\N	4020.35	withdrawal	2025-02-18 00:00:00	Cash Removed from Account	f	\N	\N	36	2025-02-18 00:00:00
1555	11	\N	3	\N	3374.54	deposit	2025-05-12 00:00:00	Online Deposit	f	\N	3	49	2025-05-12 00:00:00
1556	11	6	\N	4	1628.51	deposit	2025-05-16 00:00:00	Cheque Deposit	f	\N	\N	2	2025-05-16 00:00:00
1557	11	32	\N	\N	2193.87	income	2025-03-10 00:00:00	Refund Processed	f	\N	\N	32	2025-03-10 00:00:00
1558	11	\N	11	\N	911.46	withdrawal	2025-02-09 00:00:00	ATM Cash Withdrawal	f	\N	\N	16	2025-02-09 00:00:00
1559	11	33	\N	\N	326.62	expense	2025-05-23 00:00:00	Restaurant Dinner	t	3	\N	34	2025-05-23 00:00:00
1560	11	\N	6	6	593.21	income	2025-04-03 00:00:00	Refund Processed	t	4	4	3	2025-04-03 00:00:00
1561	11	15	\N	7	3369.96	transfer	2025-01-01 00:00:00	Bank Internal Transfer	f	\N	\N	23	2025-01-01 00:00:00
1562	11	9	\N	\N	2110.59	income	2025-03-09 00:00:00	Refund Processed	f	\N	\N	35	2025-03-09 00:00:00
1563	11	3	\N	\N	124.96	deposit	2025-01-19 00:00:00	Cash Deposit at Branch	f	15	\N	32	2025-01-19 00:00:00
1564	11	3	\N	\N	561.42	income	2025-06-05 00:00:00	Interest Income	f	20	\N	46	2025-06-05 00:00:00
1565	11	\N	9	\N	1081.00	deposit	2025-01-21 00:00:00	Online Deposit	t	12	\N	38	2025-01-21 00:00:00
1566	11	42	\N	\N	4832.89	transfer	2025-05-10 00:00:00	Transfer to Savings	f	\N	\N	12	2025-05-10 00:00:00
1567	11	8	\N	\N	2284.34	expense	2025-02-08 00:00:00	Clothing Store Purchase	f	\N	\N	44	2025-02-08 00:00:00
1568	11	47	\N	\N	3618.73	transfer	2025-06-24 00:00:00	Transfer from Checking	f	\N	1	23	2025-06-24 00:00:00
1569	12	\N	9	1	612.85	withdrawal	2025-02-20 00:00:00	Cash Removed from Account	f	21	\N	47	2025-02-20 00:00:00
1570	12	\N	6	\N	3512.80	fee	2025-05-02 00:00:00	Service Charge	f	\N	5	28	2025-05-02 00:00:00
1571	12	44	\N	\N	4499.33	transfer	2025-01-26 00:00:00	Transfer from Checking	f	\N	\N	18	2025-01-26 00:00:00
1572	12	\N	5	6	399.93	transfer	2025-02-02 00:00:00	Transfer from Checking	f	\N	\N	12	2025-02-02 00:00:00
1573	12	45	\N	\N	2100.20	income	2025-05-21 00:00:00	Bonus Received	f	\N	\N	36	2025-05-21 00:00:00
1574	12	\N	11	\N	3277.71	fee	2025-01-12 00:00:00	Service Charge	f	\N	2	17	2025-01-12 00:00:00
1575	12	6	\N	\N	694.02	expense	2025-05-27 00:00:00	Monthly Rent Payment	f	16	\N	9	2025-05-27 00:00:00
1576	12	34	\N	\N	1841.34	expense	2025-02-24 00:00:00	Fuel Station	f	\N	2	45	2025-02-24 00:00:00
1577	12	\N	12	\N	1218.87	transfer	2025-06-14 00:00:00	Transfer from Checking	f	\N	\N	1	2025-06-14 00:00:00
1578	12	\N	13	2	3704.60	income	2025-06-12 00:00:00	Freelance Project Payment	f	\N	\N	25	2025-06-12 00:00:00
1579	12	26	\N	7	1176.11	income	2025-05-08 00:00:00	Freelance Project Payment	f	23	\N	32	2025-05-08 00:00:00
1580	12	46	\N	3	1840.10	withdrawal	2025-01-06 00:00:00	ATM Cash Withdrawal	f	17	\N	45	2025-01-06 00:00:00
1581	12	6	\N	6	4483.52	transfer	2025-06-01 00:00:00	Transfer from Checking	t	\N	\N	15	2025-06-01 00:00:00
1582	12	50	\N	\N	4645.43	transfer	2025-01-26 00:00:00	Bank Internal Transfer	f	\N	1	21	2025-01-26 00:00:00
1583	12	12	\N	\N	3890.66	transfer	2025-04-25 00:00:00	Bank Internal Transfer	f	8	\N	32	2025-04-25 00:00:00
1584	12	9	\N	\N	1582.93	expense	2025-02-27 00:00:00	Monthly Rent Payment	t	18	\N	36	2025-02-27 00:00:00
1585	12	11	\N	\N	3397.47	transfer	2025-06-08 00:00:00	Transfer from Checking	f	\N	\N	46	2025-06-08 00:00:00
1586	12	7	\N	3	3579.15	deposit	2025-05-10 00:00:00	Cheque Deposit	f	20	\N	22	2025-05-10 00:00:00
1587	12	12	\N	\N	2750.55	expense	2025-05-08 00:00:00	Clothing Store Purchase	f	\N	2	9	2025-05-08 00:00:00
1588	12	17	\N	7	2040.23	transfer	2025-01-12 00:00:00	Transfer from Checking	f	\N	\N	37	2025-01-12 00:00:00
1589	12	48	\N	1	1294.75	deposit	2025-06-14 00:00:00	Cheque Deposit	f	\N	\N	25	2025-06-14 00:00:00
1590	12	\N	9	3	3964.00	expense	2025-03-28 00:00:00	Restaurant Dinner	f	\N	\N	8	2025-03-28 00:00:00
1591	12	2	\N	4	2621.00	deposit	2025-06-11 00:00:00	Online Deposit	f	\N	\N	1	2025-06-11 00:00:00
1592	12	\N	12	\N	3854.16	transfer	2025-03-06 00:00:00	Transfer from Checking	f	\N	5	21	2025-03-06 00:00:00
1593	12	24	\N	9	3427.27	expense	2025-01-03 00:00:00	Restaurant Dinner	f	\N	\N	12	2025-01-03 00:00:00
1594	12	12	\N	\N	3120.09	income	2025-06-16 00:00:00	Bonus Received	f	\N	\N	2	2025-06-16 00:00:00
1595	12	\N	2	\N	1091.70	expense	2025-03-08 00:00:00	Streaming Subscription	f	\N	\N	12	2025-03-08 00:00:00
1596	12	12	\N	\N	1569.59	fee	2025-04-23 00:00:00	Monthly Account Fee	f	\N	2	22	2025-04-23 00:00:00
1597	12	\N	5	5	178.09	income	2025-04-17 00:00:00	Refund Processed	f	\N	\N	47	2025-04-17 00:00:00
1598	12	39	\N	\N	3659.49	withdrawal	2025-05-21 00:00:00	ATM Cash Withdrawal	f	\N	\N	50	2025-05-21 00:00:00
1599	12	\N	10	\N	1610.33	withdrawal	2025-01-25 00:00:00	ATM Cash Withdrawal	f	22	\N	33	2025-01-25 00:00:00
1600	12	28	\N	\N	3723.68	expense	2025-05-26 00:00:00	Streaming Subscription	t	\N	\N	11	2025-05-26 00:00:00
1601	12	42	\N	7	4536.27	deposit	2025-03-28 00:00:00	Cash Deposit at Branch	f	\N	\N	35	2025-03-28 00:00:00
1602	13	45	\N	3	4463.52	income	2025-06-16 00:00:00	Salary Payment	f	\N	\N	8	2025-06-16 00:00:00
1603	13	7	\N	\N	4302.90	transfer	2025-02-19 00:00:00	Transfer to Savings	f	17	\N	43	2025-02-19 00:00:00
1604	13	\N	8	7	3026.56	withdrawal	2025-05-05 00:00:00	ATM Cash Withdrawal	f	\N	\N	48	2025-05-05 00:00:00
1605	13	\N	1	3	215.95	income	2025-05-19 00:00:00	Refund Processed	f	19	\N	15	2025-05-19 00:00:00
1606	13	37	\N	\N	2421.53	fee	2025-06-23 00:00:00	Monthly Account Fee	f	\N	\N	11	2025-06-23 00:00:00
1607	13	30	\N	5	1304.90	expense	2025-02-14 00:00:00	Monthly Rent Payment	f	\N	\N	38	2025-02-14 00:00:00
1608	13	26	\N	\N	2407.73	fee	2025-04-05 00:00:00	Monthly Account Fee	f	\N	\N	7	2025-04-05 00:00:00
1609	13	8	\N	\N	1453.37	fee	2025-06-04 00:00:00	ATM Withdrawal Fee	f	\N	\N	3	2025-06-04 00:00:00
1610	13	40	\N	\N	1835.56	fee	2025-05-14 00:00:00	ATM Withdrawal Fee	f	10	\N	49	2025-05-14 00:00:00
1611	13	7	\N	\N	439.75	fee	2025-03-27 00:00:00	Service Charge	f	\N	\N	49	2025-03-27 00:00:00
1612	13	6	\N	1	2393.15	fee	2025-02-22 00:00:00	ATM Withdrawal Fee	f	\N	\N	30	2025-02-22 00:00:00
1613	13	\N	11	4	280.87	transfer	2025-04-10 00:00:00	Transfer to Savings	f	\N	2	22	2025-04-10 00:00:00
1614	13	9	\N	\N	2509.10	fee	2025-05-22 00:00:00	ATM Withdrawal Fee	f	\N	3	42	2025-05-22 00:00:00
1615	13	\N	4	3	4645.57	deposit	2025-03-05 00:00:00	Cheque Deposit	f	14	5	40	2025-03-05 00:00:00
1616	13	\N	11	9	1377.13	deposit	2025-04-24 00:00:00	Online Deposit	f	\N	1	43	2025-04-24 00:00:00
1617	13	\N	2	\N	1540.13	withdrawal	2025-05-08 00:00:00	Cash Removed from Account	f	\N	\N	19	2025-05-08 00:00:00
1618	13	2	\N	\N	4493.49	fee	2025-06-07 00:00:00	Monthly Account Fee	f	11	\N	41	2025-06-07 00:00:00
1619	13	18	\N	\N	4509.19	withdrawal	2025-06-17 00:00:00	ATM Cash Withdrawal	f	\N	\N	13	2025-06-17 00:00:00
1620	13	\N	5	\N	2906.84	withdrawal	2025-02-01 00:00:00	ATM Cash Withdrawal	f	\N	\N	4	2025-02-01 00:00:00
1621	13	\N	9	7	995.64	withdrawal	2025-01-27 00:00:00	ATM Cash Withdrawal	f	\N	5	12	2025-01-27 00:00:00
1622	13	23	\N	2	139.01	income	2025-01-23 00:00:00	Refund Processed	f	\N	\N	41	2025-01-23 00:00:00
1623	13	6	\N	\N	64.37	withdrawal	2025-03-04 00:00:00	Cash Removed from Account	f	\N	\N	14	2025-03-04 00:00:00
1624	13	\N	10	9	3021.54	expense	2025-05-24 00:00:00	Grocery Store Purchase	f	\N	\N	46	2025-05-24 00:00:00
1625	13	15	\N	\N	3639.30	expense	2025-03-20 00:00:00	Utility Bill Payment	f	8	\N	19	2025-03-20 00:00:00
1626	13	\N	3	1	3611.65	deposit	2025-01-24 00:00:00	Online Deposit	f	23	1	13	2025-01-24 00:00:00
1627	13	\N	3	\N	400.26	transfer	2025-06-09 00:00:00	Transfer to Savings	t	\N	\N	17	2025-06-09 00:00:00
1628	13	\N	10	\N	794.47	withdrawal	2025-01-08 00:00:00	Cash Removed from Account	f	15	\N	42	2025-01-08 00:00:00
1629	13	\N	9	\N	748.87	fee	2025-01-06 00:00:00	Monthly Account Fee	f	22	\N	6	2025-01-06 00:00:00
1630	13	10	\N	\N	1772.07	transfer	2025-03-14 00:00:00	Transfer from Checking	f	\N	\N	47	2025-03-14 00:00:00
1631	13	41	\N	\N	1854.77	withdrawal	2025-02-08 00:00:00	ATM Cash Withdrawal	f	\N	\N	20	2025-02-08 00:00:00
1632	13	12	\N	7	2303.63	fee	2025-05-08 00:00:00	Service Charge	f	2	\N	40	2025-05-08 00:00:00
1633	13	11	\N	\N	115.23	expense	2025-06-22 00:00:00	Coffee Shop	f	\N	\N	34	2025-06-22 00:00:00
1634	13	39	\N	\N	3422.13	expense	2025-02-21 00:00:00	Fuel Station	t	10	\N	47	2025-02-21 00:00:00
1635	13	9	\N	5	674.87	withdrawal	2025-01-22 00:00:00	ATM Cash Withdrawal	f	\N	\N	49	2025-01-22 00:00:00
1636	13	51	\N	\N	2644.72	expense	2025-05-22 00:00:00	Mobile Data Recharge	f	\N	\N	39	2025-05-22 00:00:00
1637	13	5	\N	1	2934.27	fee	2025-02-13 00:00:00	Monthly Account Fee	f	17	\N	29	2025-02-13 00:00:00
1638	14	\N	8	4	4557.29	transfer	2025-05-24 00:00:00	Transfer to Savings	f	17	4	41	2025-05-24 00:00:00
1639	14	1	\N	\N	4353.28	deposit	2025-04-01 00:00:00	Cheque Deposit	f	\N	3	41	2025-04-01 00:00:00
1640	14	\N	11	\N	1442.58	fee	2025-02-27 00:00:00	ATM Withdrawal Fee	f	\N	\N	19	2025-02-27 00:00:00
1641	14	11	\N	\N	1090.89	income	2025-01-11 00:00:00	Interest Income	f	\N	\N	28	2025-01-11 00:00:00
1642	14	\N	12	6	4245.77	expense	2025-01-03 00:00:00	Restaurant Dinner	f	\N	\N	4	2025-01-03 00:00:00
1643	14	42	\N	9	2348.48	withdrawal	2025-04-08 00:00:00	Cash Removed from Account	f	15	\N	5	2025-04-08 00:00:00
1644	14	18	\N	7	4588.83	fee	2025-01-15 00:00:00	Monthly Account Fee	f	13	\N	9	2025-01-15 00:00:00
1645	14	43	\N	8	2966.03	withdrawal	2025-06-28 00:00:00	ATM Cash Withdrawal	f	16	\N	48	2025-06-28 00:00:00
1646	14	\N	5	5	2594.00	withdrawal	2025-06-09 00:00:00	ATM Cash Withdrawal	f	\N	\N	18	2025-06-09 00:00:00
1647	14	\N	6	\N	4356.54	transfer	2025-02-07 00:00:00	Transfer to Savings	t	\N	\N	27	2025-02-07 00:00:00
1648	14	22	\N	1	221.78	income	2025-05-27 00:00:00	Freelance Project Payment	f	\N	\N	2	2025-05-27 00:00:00
1649	14	11	\N	\N	992.41	withdrawal	2025-05-20 00:00:00	Cash Removed from Account	f	\N	\N	20	2025-05-20 00:00:00
1650	14	\N	2	\N	2739.89	withdrawal	2025-03-13 00:00:00	ATM Cash Withdrawal	f	\N	\N	19	2025-03-13 00:00:00
1651	14	26	\N	\N	4211.07	expense	2025-02-05 00:00:00	Clothing Store Purchase	f	12	\N	6	2025-02-05 00:00:00
1652	14	4	\N	6	1845.51	income	2025-01-29 00:00:00	Interest Income	f	\N	\N	15	2025-01-29 00:00:00
1653	14	45	\N	3	1450.35	income	2025-06-16 00:00:00	Salary Payment	t	6	\N	39	2025-06-16 00:00:00
1654	14	13	\N	1	2783.71	income	2025-02-15 00:00:00	Salary Payment	f	\N	\N	3	2025-02-15 00:00:00
1655	14	\N	12	8	3644.75	transfer	2025-04-09 00:00:00	Transfer from Checking	f	\N	\N	23	2025-04-09 00:00:00
1656	14	22	\N	1	15.13	fee	2025-03-03 00:00:00	Monthly Account Fee	f	9	3	35	2025-03-03 00:00:00
1657	14	20	\N	\N	4499.87	transfer	2025-01-05 00:00:00	Bank Internal Transfer	f	\N	\N	2	2025-01-05 00:00:00
1658	14	12	\N	3	4341.78	fee	2025-02-16 00:00:00	Service Charge	t	\N	5	19	2025-02-16 00:00:00
1659	14	12	\N	5	829.18	income	2025-06-30 00:00:00	Interest Income	f	2	\N	25	2025-06-30 00:00:00
1660	14	50	\N	3	3458.93	fee	2025-03-15 00:00:00	Service Charge	f	15	\N	40	2025-03-15 00:00:00
1661	14	\N	8	\N	4819.41	income	2025-06-07 00:00:00	Salary Payment	f	\N	\N	14	2025-06-07 00:00:00
1662	14	15	\N	\N	3551.74	deposit	2025-04-21 00:00:00	Cash Deposit at Branch	f	\N	2	28	2025-04-21 00:00:00
1663	14	\N	2	6	1699.09	expense	2025-03-11 00:00:00	Coffee Shop	f	\N	2	40	2025-03-11 00:00:00
1664	14	36	\N	\N	3435.24	income	2025-05-09 00:00:00	Bonus Received	f	\N	\N	15	2025-05-09 00:00:00
1665	14	35	\N	6	4835.00	deposit	2025-02-23 00:00:00	Online Deposit	f	\N	\N	0	2025-02-23 00:00:00
1666	14	8	\N	4	1284.14	income	2025-05-27 00:00:00	Salary Payment	f	\N	\N	37	2025-05-27 00:00:00
1667	14	\N	5	\N	1286.86	fee	2025-05-13 00:00:00	ATM Withdrawal Fee	f	8	\N	12	2025-05-13 00:00:00
1668	14	14	\N	\N	2119.14	deposit	2025-06-07 00:00:00	Cheque Deposit	f	\N	\N	30	2025-06-07 00:00:00
1669	14	\N	13	4	1561.69	transfer	2025-01-13 00:00:00	Transfer from Checking	f	\N	4	36	2025-01-13 00:00:00
1670	14	40	\N	\N	4050.14	withdrawal	2025-06-06 00:00:00	Cash Removed from Account	f	\N	1	4	2025-06-06 00:00:00
1671	14	16	\N	2	2425.01	fee	2025-01-24 00:00:00	ATM Withdrawal Fee	f	\N	\N	24	2025-01-24 00:00:00
1672	14	\N	8	\N	4373.73	transfer	2025-01-03 00:00:00	Bank Internal Transfer	f	\N	\N	9	2025-01-03 00:00:00
1673	14	13	\N	9	2355.85	fee	2025-02-22 00:00:00	ATM Withdrawal Fee	f	22	4	37	2025-02-22 00:00:00
1674	14	50	\N	8	2236.05	transfer	2025-04-18 00:00:00	Transfer to Savings	f	22	\N	2	2025-04-18 00:00:00
1675	14	26	\N	3	3034.29	income	2025-04-16 00:00:00	Freelance Project Payment	f	\N	\N	47	2025-04-16 00:00:00
1676	14	13	\N	\N	2674.38	deposit	2025-02-28 00:00:00	Cheque Deposit	f	11	\N	13	2025-02-28 00:00:00
1677	14	37	\N	\N	4134.44	withdrawal	2025-04-30 00:00:00	Cash Removed from Account	f	\N	\N	36	2025-04-30 00:00:00
1678	15	28	\N	7	4988.79	transfer	2025-02-16 00:00:00	Transfer from Checking	f	\N	3	40	2025-02-16 00:00:00
1679	15	\N	6	3	1306.13	expense	2025-03-24 00:00:00	Coffee Shop	t	\N	\N	47	2025-03-24 00:00:00
1680	15	3	\N	7	3806.80	expense	2025-02-24 00:00:00	Utility Bill Payment	f	\N	\N	12	2025-02-24 00:00:00
1681	15	\N	8	\N	4093.07	income	2025-06-14 00:00:00	Bonus Received	f	\N	\N	8	2025-06-14 00:00:00
1682	15	\N	4	1	4261.80	expense	2025-02-07 00:00:00	Mobile Data Recharge	f	\N	\N	10	2025-02-07 00:00:00
1683	15	37	\N	\N	1085.84	transfer	2025-01-07 00:00:00	Transfer from Checking	f	\N	\N	0	2025-01-07 00:00:00
1684	15	\N	11	5	2998.58	deposit	2025-03-01 00:00:00	Online Deposit	f	\N	\N	13	2025-03-01 00:00:00
1685	15	7	\N	\N	2643.91	fee	2025-02-05 00:00:00	ATM Withdrawal Fee	t	\N	\N	12	2025-02-05 00:00:00
1686	15	17	\N	4	2835.61	transfer	2025-02-05 00:00:00	Transfer to Savings	f	\N	\N	40	2025-02-05 00:00:00
1687	15	\N	3	\N	3844.39	transfer	2025-06-28 00:00:00	Transfer from Checking	f	\N	\N	2	2025-06-28 00:00:00
1688	15	22	\N	3	1578.91	expense	2025-03-25 00:00:00	Mobile Data Recharge	f	\N	\N	22	2025-03-25 00:00:00
1689	15	35	\N	\N	2893.79	deposit	2025-06-08 00:00:00	Cash Deposit at Branch	f	\N	\N	0	2025-06-08 00:00:00
1690	15	50	\N	4	4710.99	deposit	2025-03-14 00:00:00	Cheque Deposit	f	\N	\N	7	2025-03-14 00:00:00
1691	15	29	\N	\N	2013.76	withdrawal	2025-01-01 00:00:00	ATM Cash Withdrawal	f	\N	\N	24	2025-01-01 00:00:00
1692	15	\N	8	\N	868.58	withdrawal	2025-06-06 00:00:00	ATM Cash Withdrawal	f	\N	\N	7	2025-06-06 00:00:00
1693	15	40	\N	\N	3096.28	expense	2025-05-29 00:00:00	Coffee Shop	f	\N	4	47	2025-05-29 00:00:00
1694	15	\N	7	8	621.47	fee	2025-06-20 00:00:00	Monthly Account Fee	f	\N	\N	4	2025-06-20 00:00:00
1695	15	36	\N	\N	2114.36	expense	2025-05-12 00:00:00	Coffee Shop	f	13	\N	4	2025-05-12 00:00:00
1696	15	\N	2	\N	4982.96	deposit	2025-01-18 00:00:00	Online Deposit	f	\N	\N	7	2025-01-18 00:00:00
1697	15	23	\N	5	1130.03	deposit	2025-03-07 00:00:00	Cash Deposit at Branch	f	4	4	11	2025-03-07 00:00:00
1698	15	\N	9	6	1460.27	expense	2025-03-10 00:00:00	Fuel Station	f	\N	4	40	2025-03-10 00:00:00
1699	15	\N	12	\N	1982.53	income	2025-05-28 00:00:00	Dividend Payment	t	\N	\N	8	2025-05-28 00:00:00
1700	15	24	\N	\N	3746.00	transfer	2025-05-29 00:00:00	Transfer to Savings	f	3	\N	44	2025-05-29 00:00:00
1701	15	27	\N	\N	581.03	withdrawal	2025-05-25 00:00:00	Cash Removed from Account	f	\N	\N	4	2025-05-25 00:00:00
1702	24	8	\N	\N	1685.03	withdrawal	2025-03-31 00:00:00	Cash Removed from Account	f	5	\N	15	2025-03-31 00:00:00
1703	24	\N	4	\N	2885.83	fee	2025-01-04 00:00:00	ATM Withdrawal Fee	f	\N	\N	26	2025-01-04 00:00:00
1704	24	17	\N	2	3281.66	expense	2025-06-22 00:00:00	Monthly Rent Payment	f	12	\N	35	2025-06-22 00:00:00
1705	24	51	\N	4	4496.06	fee	2025-04-14 00:00:00	ATM Withdrawal Fee	f	\N	\N	0	2025-04-14 00:00:00
1706	24	\N	10	\N	2637.61	deposit	2025-06-08 00:00:00	Cash Deposit at Branch	f	\N	\N	21	2025-06-08 00:00:00
1707	24	13	\N	6	4276.49	fee	2025-01-11 00:00:00	Monthly Account Fee	f	\N	\N	2	2025-01-11 00:00:00
1708	24	\N	8	6	4784.20	deposit	2025-02-21 00:00:00	Online Deposit	f	\N	\N	28	2025-02-21 00:00:00
1709	24	\N	13	\N	1647.79	deposit	2025-06-12 00:00:00	Online Deposit	f	12	\N	49	2025-06-12 00:00:00
1710	24	1	\N	8	4417.81	expense	2025-05-02 00:00:00	Streaming Subscription	f	\N	\N	16	2025-05-02 00:00:00
1711	24	39	\N	6	1805.32	expense	2025-04-15 00:00:00	Grocery Store Purchase	f	\N	\N	26	2025-04-15 00:00:00
1712	24	24	\N	\N	4188.93	withdrawal	2025-05-20 00:00:00	ATM Cash Withdrawal	f	\N	\N	26	2025-05-20 00:00:00
1713	24	44	\N	\N	3605.77	deposit	2025-04-30 00:00:00	Online Deposit	f	\N	\N	0	2025-04-30 00:00:00
1714	24	\N	8	3	723.46	income	2025-04-11 00:00:00	Refund Processed	f	\N	\N	23	2025-04-11 00:00:00
1715	24	1	\N	8	190.50	withdrawal	2025-06-13 00:00:00	Cash Removed from Account	f	\N	\N	36	2025-06-13 00:00:00
1716	24	22	\N	\N	137.86	income	2025-05-16 00:00:00	Bonus Received	f	\N	1	10	2025-05-16 00:00:00
1717	24	49	\N	1	1100.26	withdrawal	2025-03-04 00:00:00	ATM Cash Withdrawal	f	\N	\N	17	2025-03-04 00:00:00
1718	24	\N	7	5	1531.23	deposit	2025-03-26 00:00:00	Cheque Deposit	f	\N	\N	15	2025-03-26 00:00:00
1719	24	48	\N	1	4478.87	transfer	2025-02-03 00:00:00	Bank Internal Transfer	f	8	4	37	2025-02-03 00:00:00
1720	24	39	\N	8	560.57	deposit	2025-02-05 00:00:00	Online Deposit	f	\N	\N	31	2025-02-05 00:00:00
1721	24	\N	6	7	1563.12	fee	2025-05-11 00:00:00	ATM Withdrawal Fee	f	\N	1	9	2025-05-11 00:00:00
1722	24	\N	13	9	1897.98	deposit	2025-05-15 00:00:00	Cheque Deposit	f	\N	\N	6	2025-05-15 00:00:00
1723	24	\N	11	\N	1892.36	fee	2025-05-12 00:00:00	Service Charge	f	10	\N	19	2025-05-12 00:00:00
1724	24	42	\N	1	4576.52	income	2025-02-11 00:00:00	Freelance Project Payment	f	\N	\N	45	2025-02-11 00:00:00
1725	24	26	\N	2	4611.30	deposit	2025-05-30 00:00:00	Cash Deposit at Branch	f	\N	\N	17	2025-05-30 00:00:00
1726	24	\N	2	2	3508.32	expense	2025-01-22 00:00:00	Mobile Data Recharge	f	\N	\N	31	2025-01-22 00:00:00
1727	24	\N	8	7	1425.49	withdrawal	2025-03-17 00:00:00	Cash Removed from Account	f	6	\N	6	2025-03-17 00:00:00
1728	24	51	\N	5	4668.92	deposit	2025-05-31 00:00:00	Cash Deposit at Branch	t	\N	3	37	2025-05-31 00:00:00
1729	24	21	\N	\N	4382.28	deposit	2025-02-01 00:00:00	Online Deposit	f	\N	\N	20	2025-02-01 00:00:00
1730	24	27	\N	\N	2796.53	expense	2025-05-21 00:00:00	Coffee Shop	f	\N	\N	42	2025-05-21 00:00:00
1731	24	39	\N	1	741.73	withdrawal	2025-02-23 00:00:00	ATM Cash Withdrawal	f	2	\N	19	2025-02-23 00:00:00
1732	24	10	\N	8	2475.62	income	2025-06-20 00:00:00	Bonus Received	t	\N	5	36	2025-06-20 00:00:00
1733	24	20	\N	2	3740.87	expense	2025-03-08 00:00:00	Fuel Station	f	\N	\N	17	2025-03-08 00:00:00
1734	24	4	\N	7	4613.97	expense	2025-05-06 00:00:00	Utility Bill Payment	f	16	\N	37	2025-05-06 00:00:00
1735	24	4	\N	\N	675.71	expense	2025-02-04 00:00:00	Mobile Data Recharge	f	1	\N	23	2025-02-04 00:00:00
1736	24	\N	8	\N	3778.03	expense	2025-01-22 00:00:00	Utility Bill Payment	f	\N	\N	25	2025-01-22 00:00:00
1737	24	\N	13	5	2560.01	deposit	2025-03-15 00:00:00	Cash Deposit at Branch	f	\N	\N	21	2025-03-15 00:00:00
1738	24	39	\N	7	2398.79	fee	2025-04-20 00:00:00	ATM Withdrawal Fee	f	\N	\N	46	2025-04-20 00:00:00
1739	24	39	\N	\N	2397.77	fee	2025-01-21 00:00:00	Service Charge	f	\N	\N	35	2025-01-21 00:00:00
1740	24	13	\N	\N	1293.11	income	2025-06-08 00:00:00	Refund Processed	f	\N	\N	28	2025-06-08 00:00:00
1741	24	20	\N	\N	3069.36	income	2025-04-28 00:00:00	Interest Income	f	\N	\N	22	2025-04-28 00:00:00
1742	24	37	\N	\N	2415.21	withdrawal	2025-01-28 00:00:00	Cash Removed from Account	f	13	\N	14	2025-01-28 00:00:00
1743	24	14	\N	8	1155.63	income	2025-04-03 00:00:00	Bonus Received	t	\N	\N	4	2025-04-03 00:00:00
1744	24	31	\N	8	4048.03	transfer	2025-06-29 00:00:00	Transfer from Checking	f	6	\N	8	2025-06-29 00:00:00
1745	24	\N	6	7	262.19	deposit	2025-04-08 00:00:00	Online Deposit	f	\N	\N	26	2025-04-08 00:00:00
1746	24	\N	13	\N	2424.22	withdrawal	2025-02-12 00:00:00	Cash Removed from Account	f	\N	\N	24	2025-02-12 00:00:00
1747	24	6	\N	7	3632.09	expense	2025-04-16 00:00:00	Fuel Station	t	\N	\N	19	2025-04-16 00:00:00
1748	24	\N	4	\N	4671.11	expense	2025-05-16 00:00:00	Fuel Station	f	\N	\N	27	2025-05-16 00:00:00
1749	24	36	\N	7	3917.15	fee	2025-06-03 00:00:00	Monthly Account Fee	f	\N	3	11	2025-06-03 00:00:00
1750	24	45	\N	\N	4454.47	income	2025-04-22 00:00:00	Freelance Project Payment	f	\N	\N	1	2025-04-22 00:00:00
1751	23	30	\N	2	4683.36	fee	2025-06-10 00:00:00	Monthly Account Fee	t	\N	\N	11	2025-06-10 00:00:00
1752	23	45	\N	\N	2553.89	withdrawal	2025-04-17 00:00:00	ATM Cash Withdrawal	f	18	\N	23	2025-04-17 00:00:00
1753	23	7	\N	\N	871.20	income	2025-02-19 00:00:00	Freelance Project Payment	f	\N	\N	19	2025-02-19 00:00:00
1754	23	38	\N	\N	1874.82	withdrawal	2025-06-15 00:00:00	Cash Removed from Account	f	\N	\N	32	2025-06-15 00:00:00
1755	23	46	\N	5	2542.61	fee	2025-01-24 00:00:00	ATM Withdrawal Fee	f	\N	3	16	2025-01-24 00:00:00
1756	23	24	\N	\N	2022.35	transfer	2025-01-19 00:00:00	Transfer from Checking	t	\N	\N	25	2025-01-19 00:00:00
1757	23	\N	1	2	4980.48	fee	2025-04-01 00:00:00	ATM Withdrawal Fee	f	\N	4	30	2025-04-01 00:00:00
1758	23	3	\N	\N	4125.81	fee	2025-04-15 00:00:00	ATM Withdrawal Fee	f	18	\N	5	2025-04-15 00:00:00
1759	23	51	\N	9	2386.17	fee	2025-02-08 00:00:00	Service Charge	t	\N	\N	6	2025-02-08 00:00:00
1760	23	24	\N	\N	219.23	transfer	2025-01-14 00:00:00	Transfer from Checking	f	\N	2	15	2025-01-14 00:00:00
1761	23	36	\N	\N	2281.16	transfer	2025-01-10 00:00:00	Transfer to Savings	f	\N	\N	31	2025-01-10 00:00:00
1762	23	\N	2	\N	4490.73	withdrawal	2025-04-30 00:00:00	Cash Removed from Account	f	\N	\N	23	2025-04-30 00:00:00
1763	23	4	\N	5	3801.01	transfer	2025-05-13 00:00:00	Transfer to Savings	f	\N	\N	25	2025-05-13 00:00:00
1764	23	49	\N	\N	98.51	withdrawal	2025-05-30 00:00:00	ATM Cash Withdrawal	f	6	1	32	2025-05-30 00:00:00
1765	23	15	\N	5	1423.76	withdrawal	2025-01-06 00:00:00	Cash Removed from Account	f	18	\N	20	2025-01-06 00:00:00
1766	23	8	\N	6	4696.77	fee	2025-01-12 00:00:00	ATM Withdrawal Fee	f	\N	4	40	2025-01-12 00:00:00
1767	23	20	\N	\N	685.84	fee	2025-05-13 00:00:00	Service Charge	f	21	\N	35	2025-05-13 00:00:00
1768	23	6	\N	\N	2485.63	income	2025-06-07 00:00:00	Dividend Payment	f	\N	\N	50	2025-06-07 00:00:00
1769	23	45	\N	\N	820.05	transfer	2025-01-31 00:00:00	Bank Internal Transfer	f	19	\N	50	2025-01-31 00:00:00
1770	23	\N	1	4	2728.98	expense	2025-03-26 00:00:00	Streaming Subscription	f	\N	\N	20	2025-03-26 00:00:00
1771	23	42	\N	8	2643.12	withdrawal	2025-03-31 00:00:00	Cash Removed from Account	f	9	\N	45	2025-03-31 00:00:00
1772	23	\N	5	8	175.16	expense	2025-06-06 00:00:00	Public Transport Fare	f	\N	\N	27	2025-06-06 00:00:00
1773	23	38	\N	5	2449.56	fee	2025-05-31 00:00:00	Service Charge	f	\N	\N	35	2025-05-31 00:00:00
1774	23	\N	3	7	1751.13	transfer	2025-05-21 00:00:00	Transfer from Checking	f	1	\N	24	2025-05-21 00:00:00
1775	23	36	\N	4	1690.59	withdrawal	2025-01-21 00:00:00	ATM Cash Withdrawal	f	\N	\N	44	2025-01-21 00:00:00
1776	23	1	\N	\N	3879.99	expense	2025-05-14 00:00:00	Restaurant Dinner	f	17	\N	50	2025-05-14 00:00:00
1777	23	42	\N	\N	1098.87	expense	2025-04-24 00:00:00	Public Transport Fare	f	\N	\N	30	2025-04-24 00:00:00
1778	23	\N	7	9	2124.72	expense	2025-06-05 00:00:00	Monthly Rent Payment	f	\N	\N	15	2025-06-05 00:00:00
1779	23	38	\N	\N	3174.57	transfer	2025-05-07 00:00:00	Transfer from Checking	t	4	\N	42	2025-05-07 00:00:00
1780	23	\N	6	\N	1107.66	expense	2025-03-15 00:00:00	Public Transport Fare	f	\N	\N	5	2025-03-15 00:00:00
1781	23	50	\N	\N	3673.11	expense	2025-04-11 00:00:00	Clothing Store Purchase	f	\N	\N	25	2025-04-11 00:00:00
1782	23	24	\N	\N	1432.99	expense	2025-04-23 00:00:00	Streaming Subscription	f	\N	\N	22	2025-04-23 00:00:00
1783	23	4	\N	2	4936.52	income	2025-04-27 00:00:00	Refund Processed	f	14	\N	0	2025-04-27 00:00:00
1784	23	13	\N	\N	4469.79	deposit	2025-05-27 00:00:00	Cheque Deposit	f	\N	\N	50	2025-05-27 00:00:00
1785	23	38	\N	3	4872.99	withdrawal	2025-01-29 00:00:00	ATM Cash Withdrawal	f	13	\N	25	2025-01-29 00:00:00
1786	23	41	\N	4	1170.66	transfer	2025-01-14 00:00:00	Transfer from Checking	f	\N	\N	15	2025-01-14 00:00:00
1787	23	49	\N	\N	4756.75	fee	2025-01-07 00:00:00	ATM Withdrawal Fee	f	\N	\N	22	2025-01-07 00:00:00
1788	23	\N	8	\N	2666.04	deposit	2025-05-27 00:00:00	Cheque Deposit	f	11	\N	23	2025-05-27 00:00:00
1789	23	35	\N	4	3582.88	expense	2025-06-22 00:00:00	Monthly Rent Payment	f	\N	\N	23	2025-06-22 00:00:00
1790	23	44	\N	4	2304.28	withdrawal	2025-05-09 00:00:00	Cash Removed from Account	f	1	\N	44	2025-05-09 00:00:00
1791	23	50	\N	\N	4498.07	expense	2025-06-07 00:00:00	Public Transport Fare	f	\N	\N	38	2025-06-07 00:00:00
1792	23	15	\N	3	4010.99	fee	2025-06-17 00:00:00	Monthly Account Fee	f	\N	\N	21	2025-06-17 00:00:00
1793	23	11	\N	1	4795.72	transfer	2025-03-28 00:00:00	Transfer from Checking	f	\N	\N	14	2025-03-28 00:00:00
1794	23	25	\N	4	4721.40	income	2025-04-14 00:00:00	Refund Processed	f	\N	\N	41	2025-04-14 00:00:00
1795	23	3	\N	4	204.99	withdrawal	2025-04-24 00:00:00	Cash Removed from Account	f	\N	2	35	2025-04-24 00:00:00
1796	23	48	\N	1	2443.20	withdrawal	2025-06-15 00:00:00	Cash Removed from Account	f	\N	\N	13	2025-06-15 00:00:00
1797	23	17	\N	\N	2684.45	income	2025-03-17 00:00:00	Refund Processed	f	\N	\N	21	2025-03-17 00:00:00
1798	23	17	\N	\N	3245.86	transfer	2025-05-29 00:00:00	Transfer from Checking	f	\N	\N	31	2025-05-29 00:00:00
1799	23	\N	1	\N	1961.75	expense	2025-03-09 00:00:00	Mobile Data Recharge	f	\N	4	17	2025-03-09 00:00:00
1800	23	50	\N	8	29.97	expense	2025-03-20 00:00:00	Fuel Station	f	\N	\N	30	2025-03-20 00:00:00
1801	23	23	\N	6	616.26	transfer	2025-05-15 00:00:00	Transfer to Savings	f	\N	\N	29	2025-05-15 00:00:00
1802	22	\N	6	\N	2680.52	fee	2025-06-22 00:00:00	Monthly Account Fee	f	16	\N	16	2025-06-22 00:00:00
1803	22	26	\N	\N	3245.69	transfer	2025-06-25 00:00:00	Transfer to Savings	f	\N	\N	10	2025-06-25 00:00:00
1804	22	10	\N	\N	2777.21	income	2025-03-27 00:00:00	Refund Processed	t	\N	\N	47	2025-03-27 00:00:00
1805	22	22	\N	1	2839.13	transfer	2025-06-04 00:00:00	Bank Internal Transfer	f	\N	1	33	2025-06-04 00:00:00
1806	22	\N	2	6	262.33	transfer	2025-06-13 00:00:00	Bank Internal Transfer	f	\N	\N	40	2025-06-13 00:00:00
1807	22	10	\N	\N	4784.02	expense	2025-05-24 00:00:00	Utility Bill Payment	t	\N	\N	49	2025-05-24 00:00:00
1808	22	10	\N	2	4948.75	deposit	2025-05-02 00:00:00	Cheque Deposit	f	3	\N	4	2025-05-02 00:00:00
1809	22	30	\N	5	1068.53	expense	2025-05-24 00:00:00	Coffee Shop	f	\N	\N	46	2025-05-24 00:00:00
1810	22	\N	10	\N	1047.10	fee	2025-06-11 00:00:00	Monthly Account Fee	f	19	\N	15	2025-06-11 00:00:00
1811	22	11	\N	5	2363.04	fee	2025-01-23 00:00:00	Service Charge	f	\N	\N	16	2025-01-23 00:00:00
1812	22	6	\N	\N	4293.83	withdrawal	2025-04-18 00:00:00	Cash Removed from Account	f	\N	5	29	2025-04-18 00:00:00
1813	21	21	\N	2	550.57	transfer	2025-04-17 00:00:00	Bank Internal Transfer	f	10	\N	29	2025-04-17 00:00:00
1814	21	16	\N	\N	2830.38	deposit	2025-05-25 00:00:00	Cheque Deposit	f	\N	4	39	2025-05-25 00:00:00
1815	21	10	\N	2	2899.21	income	2025-05-13 00:00:00	Freelance Project Payment	f	\N	\N	44	2025-05-13 00:00:00
1816	21	\N	1	2	999.21	income	2025-01-26 00:00:00	Salary Payment	f	\N	\N	10	2025-01-26 00:00:00
1817	21	\N	11	\N	1142.63	fee	2025-04-25 00:00:00	Monthly Account Fee	f	\N	\N	8	2025-04-25 00:00:00
1818	21	20	\N	6	2411.29	transfer	2025-04-25 00:00:00	Transfer to Savings	t	\N	\N	45	2025-04-25 00:00:00
1819	21	\N	8	9	1183.72	transfer	2025-03-28 00:00:00	Transfer from Checking	f	\N	\N	33	2025-03-28 00:00:00
1820	21	11	\N	\N	1254.15	income	2025-06-06 00:00:00	Refund Processed	f	\N	\N	24	2025-06-06 00:00:00
1821	21	\N	9	8	4907.44	transfer	2025-04-09 00:00:00	Transfer from Checking	t	14	\N	49	2025-04-09 00:00:00
1822	21	40	\N	3	2157.43	income	2025-02-09 00:00:00	Freelance Project Payment	f	\N	3	28	2025-02-09 00:00:00
1823	21	\N	8	\N	3840.71	fee	2025-06-03 00:00:00	Monthly Account Fee	f	\N	\N	25	2025-06-03 00:00:00
1824	21	19	\N	7	377.77	expense	2025-01-26 00:00:00	Grocery Store Purchase	f	\N	1	4	2025-01-26 00:00:00
1825	21	15	\N	1	4982.32	income	2025-04-10 00:00:00	Interest Income	f	\N	\N	42	2025-04-10 00:00:00
1826	21	12	\N	1	2824.39	withdrawal	2025-05-19 00:00:00	ATM Cash Withdrawal	f	\N	\N	33	2025-05-19 00:00:00
1827	21	51	\N	8	333.52	income	2025-02-08 00:00:00	Dividend Payment	f	20	\N	21	2025-02-08 00:00:00
1828	21	\N	5	\N	3979.70	transfer	2025-01-25 00:00:00	Transfer to Savings	f	14	1	8	2025-01-25 00:00:00
1829	21	\N	5	\N	368.68	income	2025-05-05 00:00:00	Bonus Received	f	\N	\N	22	2025-05-05 00:00:00
1830	21	41	\N	\N	1780.55	expense	2025-04-13 00:00:00	Utility Bill Payment	f	\N	\N	45	2025-04-13 00:00:00
1831	21	\N	6	\N	4164.68	expense	2025-04-12 00:00:00	Restaurant Dinner	f	20	\N	20	2025-04-12 00:00:00
1832	21	\N	6	9	1977.91	withdrawal	2025-03-19 00:00:00	ATM Cash Withdrawal	f	\N	\N	46	2025-03-19 00:00:00
1833	21	\N	6	\N	3193.18	transfer	2025-01-13 00:00:00	Transfer from Checking	t	23	\N	36	2025-01-13 00:00:00
1834	21	29	\N	9	2831.52	income	2025-06-17 00:00:00	Interest Income	f	\N	\N	45	2025-06-17 00:00:00
1835	21	48	\N	\N	228.92	deposit	2025-05-23 00:00:00	Cheque Deposit	f	\N	\N	45	2025-05-23 00:00:00
1836	21	21	\N	\N	4109.89	income	2025-02-27 00:00:00	Refund Processed	t	18	\N	41	2025-02-27 00:00:00
1837	21	\N	7	1	3685.23	deposit	2025-03-14 00:00:00	Cash Deposit at Branch	f	14	\N	0	2025-03-14 00:00:00
1838	21	3	\N	4	2583.10	fee	2025-06-02 00:00:00	Service Charge	f	22	\N	37	2025-06-02 00:00:00
1839	21	49	\N	1	2575.00	income	2025-02-09 00:00:00	Dividend Payment	f	7	\N	5	2025-02-09 00:00:00
1840	21	\N	3	2	738.55	income	2025-04-23 00:00:00	Bonus Received	f	18	\N	27	2025-04-23 00:00:00
1841	21	45	\N	\N	1457.89	deposit	2025-03-25 00:00:00	Cash Deposit at Branch	f	\N	\N	47	2025-03-25 00:00:00
1842	21	25	\N	8	1211.08	fee	2025-06-21 00:00:00	Monthly Account Fee	t	\N	\N	39	2025-06-21 00:00:00
1843	21	29	\N	\N	1555.87	expense	2025-06-13 00:00:00	Grocery Store Purchase	f	7	\N	38	2025-06-13 00:00:00
1844	21	\N	12	9	4185.63	fee	2025-06-10 00:00:00	Service Charge	f	\N	\N	39	2025-06-10 00:00:00
1845	21	10	\N	\N	1792.76	transfer	2025-02-26 00:00:00	Transfer to Savings	t	\N	\N	11	2025-02-26 00:00:00
1846	21	\N	1	3	3664.14	fee	2025-04-03 00:00:00	ATM Withdrawal Fee	f	\N	\N	9	2025-04-03 00:00:00
1847	21	5	\N	8	2250.81	expense	2025-05-08 00:00:00	Clothing Store Purchase	f	\N	\N	47	2025-05-08 00:00:00
1848	21	25	\N	8	3909.79	withdrawal	2025-06-09 00:00:00	ATM Cash Withdrawal	f	\N	\N	45	2025-06-09 00:00:00
1849	21	\N	7	\N	2869.71	transfer	2025-03-14 00:00:00	Transfer from Checking	t	17	\N	21	2025-03-14 00:00:00
1850	21	23	\N	\N	1415.72	withdrawal	2025-05-07 00:00:00	ATM Cash Withdrawal	t	\N	\N	19	2025-05-07 00:00:00
1851	21	\N	1	6	1821.54	deposit	2025-04-26 00:00:00	Online Deposit	t	\N	\N	18	2025-04-26 00:00:00
1852	21	\N	8	\N	989.64	fee	2025-04-18 00:00:00	ATM Withdrawal Fee	f	14	\N	1	2025-04-18 00:00:00
1853	21	32	\N	9	387.80	expense	2025-05-01 00:00:00	Restaurant Dinner	f	\N	\N	32	2025-05-01 00:00:00
1854	21	43	\N	\N	873.46	transfer	2025-03-11 00:00:00	Transfer from Checking	f	\N	4	39	2025-03-11 00:00:00
1855	21	\N	12	\N	4062.86	deposit	2025-02-06 00:00:00	Cheque Deposit	f	7	\N	22	2025-02-06 00:00:00
1856	21	42	\N	5	1578.58	transfer	2025-06-22 00:00:00	Transfer to Savings	f	\N	\N	30	2025-06-22 00:00:00
1857	21	\N	1	7	4143.00	expense	2025-02-09 00:00:00	Grocery Store Purchase	f	18	\N	11	2025-02-09 00:00:00
1858	21	6	\N	9	2438.92	expense	2025-03-15 00:00:00	Monthly Rent Payment	t	\N	\N	13	2025-03-15 00:00:00
1859	21	4	\N	8	1607.75	withdrawal	2025-04-15 00:00:00	Cash Removed from Account	f	\N	\N	37	2025-04-15 00:00:00
1860	21	19	\N	\N	889.37	withdrawal	2025-01-08 00:00:00	ATM Cash Withdrawal	t	\N	\N	18	2025-01-08 00:00:00
1861	21	10	\N	8	2556.09	income	2025-01-29 00:00:00	Dividend Payment	f	\N	\N	1	2025-01-29 00:00:00
1862	21	3	\N	\N	4459.21	deposit	2025-01-16 00:00:00	Online Deposit	t	21	\N	17	2025-01-16 00:00:00
1863	21	\N	6	\N	159.74	withdrawal	2025-06-13 00:00:00	Cash Removed from Account	f	\N	\N	21	2025-06-13 00:00:00
1864	21	\N	2	7	2287.47	transfer	2025-02-19 00:00:00	Transfer from Checking	f	\N	\N	28	2025-02-19 00:00:00
1865	21	38	\N	\N	1303.77	withdrawal	2025-05-21 00:00:00	Cash Removed from Account	f	\N	2	42	2025-05-21 00:00:00
1867	18	17	\N	\N	29.99	expense	2025-03-25 00:00:00	DEBIT CARD PURCHASE FROM C*MRP HATFIEL 5196*8281 22 MAR	f	\N	\N	0	2025-08-20 01:21:00.302914
1869	18	4	\N	\N	100.00	income	2025-03-22 00:00:00	AUTOBANK CASH DEPOSIT HATFIELD P1 13H13 391748281	f	\N	\N	0	2025-08-20 01:21:00.435425
1868	18	14	\N	\N	34.99	expense	2025-03-25 00:00:00	DEBIT CARD PURCHASE FROM SPOTIFYZA 5196*8281 23 MAR	f	\N	\N	0	2025-08-20 01:21:00.43483
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_achievements (user_id, achievement_id, awarded_at, achievement_status, progress_value) FROM stdin;
1	47	2025-04-25 17:46:51	complete	100
1	49	2025-01-06 17:46:51	complete	100
1	39	2025-02-11 17:46:51	complete	100
1	38	2025-06-11 17:46:51	complete	100
1	19	2025-03-10 17:46:51	complete	100
1	23	2025-02-06 17:46:51	complete	100
1	25	2025-04-29 17:46:51	complete	100
1	15	2025-02-18 17:46:51	complete	100
1	12	2025-06-08 17:46:51	complete	100
1	2	2025-05-29 17:46:51	complete	100
1	9	2025-04-22 17:46:51	complete	100
1	30	2025-02-02 17:46:51	complete	100
1	34	2025-05-05 17:46:51	complete	100
1	46	2025-01-11 17:46:51	complete	100
1	50	2025-01-01 17:46:51	complete	100
1	42	2025-02-26 17:46:51	complete	100
1	22	2025-04-14 17:46:51	complete	100
1	41	2025-05-13 17:46:51	complete	100
1	31	2025-04-24 17:46:51	complete	100
1	24	2025-05-18 17:46:51	complete	100
1	37	2025-04-22 17:46:51	complete	100
1	1	2025-06-03 17:46:51	incomplete	83
1	18	2025-06-10 17:46:51	incomplete	66
1	8	2025-06-05 17:46:51	incomplete	88
1	35	2025-06-08 17:46:51	incomplete	43
1	40	2025-05-25 17:46:51	incomplete	32
1	11	2025-05-28 17:46:51	incomplete	70
2	11	2025-03-20 17:46:51	complete	100
2	10	2025-01-28 17:46:51	complete	100
2	8	2025-02-17 17:46:51	complete	100
2	7	2025-04-25 17:46:51	complete	100
2	20	2025-01-30 17:46:51	complete	100
2	35	2025-02-14 17:46:51	complete	100
2	12	2025-05-05 17:46:51	complete	100
2	26	2025-01-26 17:46:51	complete	100
2	16	2025-04-13 17:46:51	complete	100
2	30	2025-05-12 17:46:51	complete	100
2	39	2025-03-04 17:46:51	complete	100
2	45	2025-02-27 17:46:51	complete	100
2	9	2024-12-22 17:46:51	complete	100
2	4	2025-03-28 17:46:51	complete	100
2	47	2025-06-10 17:46:51	incomplete	34
2	36	2025-05-27 17:46:51	incomplete	67
2	23	2025-06-08 17:46:51	incomplete	29
2	1	2025-06-09 17:46:51	incomplete	13
2	18	2025-05-25 17:46:51	incomplete	51
2	28	2025-05-24 17:46:51	incomplete	10
2	46	2025-06-02 17:46:51	incomplete	16
2	40	2025-06-16 17:46:51	incomplete	63
2	27	2025-05-25 17:46:51	incomplete	74
3	27	2025-01-07 17:46:51	complete	100
3	41	2025-03-03 17:46:51	complete	100
3	29	2025-05-18 17:46:51	complete	100
3	20	2025-06-01 17:46:51	complete	100
3	24	2025-05-29 17:46:51	complete	100
3	6	2025-02-09 17:46:51	complete	100
3	2	2025-05-10 17:46:51	complete	100
3	31	2025-04-16 17:46:51	complete	100
3	18	2025-01-06 17:46:51	complete	100
3	48	2025-01-16 17:46:51	complete	100
3	10	2025-03-16 17:46:51	complete	100
3	38	2025-04-19 17:46:51	complete	100
3	23	2025-04-28 17:46:51	complete	100
3	33	2025-05-06 17:46:51	complete	100
3	13	2025-06-14 17:46:51	incomplete	39
3	47	2025-06-07 17:46:51	incomplete	27
3	7	2025-06-13 17:46:51	incomplete	87
3	40	2025-06-06 17:46:51	incomplete	13
3	42	2025-05-25 17:46:51	incomplete	53
3	19	2025-05-24 17:46:51	incomplete	74
3	34	2025-06-12 17:46:51	incomplete	80
3	3	2025-05-22 17:46:51	incomplete	24
4	6	2025-04-02 17:46:51	complete	100
4	38	2025-01-13 17:46:51	complete	100
4	37	2025-04-02 17:46:51	complete	100
4	40	2025-05-09 17:46:51	complete	100
4	13	2025-03-26 17:46:51	complete	100
4	4	2025-01-03 17:46:51	complete	100
4	30	2025-04-02 17:46:51	complete	100
4	49	2025-01-17 17:46:51	complete	100
4	10	2025-03-11 17:46:51	complete	100
4	47	2025-01-19 17:46:51	complete	100
4	28	2025-02-25 17:46:51	complete	100
4	8	2025-05-10 17:46:51	complete	100
4	27	2025-04-05 17:46:51	complete	100
4	7	2025-03-26 17:46:51	complete	100
4	46	2025-05-15 17:46:51	complete	100
4	14	2025-04-12 17:46:51	complete	100
4	1	2025-06-04 17:46:51	incomplete	49
4	3	2025-06-04 17:46:51	incomplete	69
4	12	2025-06-07 17:46:51	incomplete	50
4	33	2025-05-25 17:46:51	incomplete	30
4	35	2025-06-08 17:46:51	incomplete	40
4	42	2025-05-24 17:46:51	incomplete	52
4	16	2025-05-22 17:46:51	incomplete	34
4	26	2025-06-02 17:46:51	incomplete	66
4	25	2025-06-12 17:46:51	incomplete	63
5	9	2025-03-17 17:46:51	complete	100
5	45	2025-01-10 17:46:51	complete	100
5	21	2025-03-28 17:46:51	complete	100
5	10	2025-03-01 17:46:51	complete	100
5	48	2025-01-07 17:46:51	complete	100
5	47	2025-03-01 17:46:51	complete	100
5	4	2025-02-08 17:46:51	complete	100
5	42	2025-06-04 17:46:51	complete	100
5	33	2025-05-22 17:46:51	complete	100
5	29	2025-02-08 17:46:51	complete	100
5	46	2025-03-31 17:46:51	complete	100
5	24	2025-03-29 17:46:51	complete	100
5	11	2025-03-30 17:46:51	complete	100
5	22	2025-03-16 17:46:51	complete	100
5	18	2025-01-02 17:46:51	complete	100
5	27	2025-02-12 17:46:51	complete	100
5	6	2024-12-30 17:46:51	complete	100
5	7	2025-06-18 17:46:51	complete	100
5	39	2025-01-12 17:46:51	complete	100
5	40	2025-02-24 17:46:51	complete	100
5	17	2025-05-24 17:46:51	incomplete	14
5	50	2025-05-31 17:46:51	incomplete	22
5	19	2025-06-16 17:46:51	incomplete	41
5	2	2025-06-14 17:46:51	incomplete	13
5	3	2025-06-17 17:46:51	incomplete	58
5	1	2025-06-18 17:46:51	incomplete	40
5	36	2025-06-04 17:46:51	incomplete	68
6	51	2025-01-28 17:46:51	complete	100
6	40	2025-05-18 17:46:51	complete	100
6	23	2025-03-07 17:46:51	complete	100
6	44	2025-06-02 17:46:51	complete	100
6	24	2025-05-20 17:46:51	complete	100
6	1	2025-02-02 17:46:51	complete	100
6	4	2025-06-18 17:46:51	complete	100
6	2	2025-05-06 17:46:51	complete	100
6	9	2025-01-07 17:46:51	complete	100
6	37	2025-02-27 17:46:51	complete	100
6	29	2025-06-06 17:46:51	incomplete	18
6	35	2025-05-31 17:46:51	incomplete	66
6	46	2025-05-26 17:46:51	incomplete	20
6	42	2025-05-31 17:46:51	incomplete	61
6	32	2025-05-23 17:46:51	incomplete	87
7	3	2025-04-20 17:46:51	complete	100
7	33	2025-02-24 17:46:51	complete	100
7	36	2025-03-15 17:46:51	complete	100
7	47	2025-02-24 17:46:51	complete	100
7	37	2024-12-30 17:46:51	complete	100
7	31	2025-06-10 17:46:51	complete	100
7	6	2025-02-10 17:46:51	complete	100
7	22	2025-06-18 17:46:51	complete	100
7	4	2025-04-20 17:46:51	complete	100
7	34	2025-05-15 17:46:51	complete	100
7	29	2025-02-12 17:46:51	complete	100
7	35	2025-06-12 17:46:51	complete	100
7	2	2025-02-09 17:46:51	complete	100
7	27	2025-02-11 17:46:51	complete	100
7	32	2025-02-09 17:46:51	complete	100
7	51	2025-06-05 17:46:51	complete	100
7	39	2025-03-02 17:46:51	complete	100
7	48	2025-06-07 17:46:51	complete	100
7	24	2025-04-25 17:46:51	complete	100
7	16	2025-06-16 17:46:51	incomplete	21
7	12	2025-06-01 17:46:51	incomplete	68
7	5	2025-05-30 17:46:51	incomplete	70
7	46	2025-05-28 17:46:51	incomplete	54
7	7	2025-06-10 17:46:51	incomplete	14
8	44	2025-02-25 17:46:51	complete	100
8	5	2025-04-07 17:46:51	complete	100
8	31	2025-04-17 17:46:51	complete	100
8	29	2025-02-04 17:46:51	complete	100
8	47	2025-05-06 17:46:51	complete	100
8	12	2025-02-05 17:46:51	complete	100
8	1	2025-05-23 17:46:51	complete	100
8	6	2025-05-30 17:46:51	complete	100
8	14	2025-05-17 17:46:51	complete	100
8	15	2025-01-21 17:46:51	complete	100
8	8	2025-06-13 17:46:51	complete	100
8	21	2025-06-08 17:46:51	incomplete	51
8	37	2025-05-31 17:46:51	incomplete	58
8	2	2025-06-18 17:46:51	incomplete	85
8	38	2025-05-29 17:46:51	incomplete	63
8	27	2025-05-31 17:46:51	incomplete	47
8	39	2025-06-15 17:46:51	incomplete	13
8	7	2025-05-22 17:46:51	incomplete	77
9	45	2025-06-12 17:46:51	complete	100
9	31	2025-02-06 17:46:51	complete	100
9	43	2025-02-03 17:46:51	complete	100
9	2	2025-05-04 17:46:51	complete	100
9	27	2025-02-24 17:46:51	complete	100
9	3	2025-02-04 17:46:51	complete	100
9	1	2025-06-16 17:46:51	complete	100
9	12	2025-05-05 17:46:51	complete	100
9	40	2024-12-25 17:46:51	complete	100
9	19	2025-05-19 17:46:51	complete	100
9	47	2025-05-16 17:46:51	complete	100
9	46	2025-04-06 17:46:51	complete	100
9	18	2025-05-28 17:46:51	complete	100
9	39	2025-05-09 17:46:51	complete	100
9	32	2025-06-04 17:46:51	incomplete	58
9	10	2025-06-18 17:46:51	incomplete	49
9	16	2025-06-03 17:46:51	incomplete	76
10	29	2025-05-12 17:46:51	complete	100
10	42	2024-12-24 17:46:51	complete	100
10	51	2025-03-14 17:46:51	complete	100
10	39	2025-02-09 17:46:51	complete	100
10	45	2025-05-19 17:46:51	complete	100
10	30	2025-05-10 17:46:51	complete	100
10	34	2025-06-12 17:46:51	complete	100
10	22	2025-01-30 17:46:51	complete	100
10	36	2025-04-03 17:46:51	complete	100
10	8	2025-03-02 17:46:51	complete	100
10	31	2025-06-15 17:46:51	complete	100
10	5	2025-02-23 17:46:51	complete	100
10	11	2025-01-22 17:46:51	complete	100
10	32	2025-01-12 17:46:51	complete	100
10	25	2025-06-01 17:46:51	complete	100
10	13	2025-04-01 17:46:51	complete	100
10	14	2025-05-13 17:46:51	complete	100
10	2	2025-06-12 17:46:51	complete	100
10	17	2025-03-10 17:46:51	complete	100
10	15	2025-01-24 17:46:51	complete	100
10	50	2025-06-15 17:46:51	complete	100
10	24	2025-02-08 17:46:51	complete	100
10	28	2025-01-15 17:46:51	complete	100
10	3	2025-06-13 17:46:51	incomplete	39
10	16	2025-05-26 17:46:51	incomplete	76
10	26	2025-06-10 17:46:51	incomplete	10
10	6	2025-06-03 17:46:51	incomplete	82
10	37	2025-06-09 17:46:51	incomplete	79
1	3	2025-08-19 14:45:12.728894	incomplete	0
1	4	2025-08-19 14:45:12.728894	incomplete	0
1	5	2025-08-19 14:45:12.728894	incomplete	0
1	6	2025-08-19 14:45:12.728894	incomplete	0
1	7	2025-08-19 14:45:12.728894	incomplete	0
1	10	2025-08-19 14:45:12.728894	incomplete	0
1	13	2025-08-19 14:45:12.728894	incomplete	0
1	14	2025-08-19 14:45:12.728894	incomplete	0
1	16	2025-08-19 14:45:12.728894	incomplete	0
1	17	2025-08-19 14:45:12.728894	incomplete	0
1	20	2025-08-19 14:45:12.728894	incomplete	0
1	21	2025-08-19 14:45:12.728894	incomplete	0
1	26	2025-08-19 14:45:12.728894	incomplete	0
1	27	2025-08-19 14:45:12.728894	incomplete	0
1	28	2025-08-19 14:45:12.728894	incomplete	0
1	29	2025-08-19 14:45:12.728894	incomplete	0
1	32	2025-08-19 14:45:12.728894	incomplete	0
1	33	2025-08-19 14:45:12.728894	incomplete	0
1	36	2025-08-19 14:45:12.728894	incomplete	0
1	43	2025-08-19 14:45:12.728894	incomplete	0
1	44	2025-08-19 14:45:12.728894	incomplete	0
1	45	2025-08-19 14:45:12.728894	incomplete	0
1	48	2025-08-19 14:45:12.728894	incomplete	0
1	51	2025-08-19 14:45:12.728894	incomplete	0
1	52	2025-08-19 14:45:12.728894	incomplete	0
1	53	2025-08-19 14:45:12.728894	incomplete	0
1	54	2025-08-19 14:45:12.728894	incomplete	0
1	55	2025-08-19 14:45:12.728894	incomplete	0
1	56	2025-08-19 14:45:12.728894	incomplete	0
1	57	2025-08-19 14:45:12.728894	incomplete	0
1	58	2025-08-19 14:45:12.728894	incomplete	0
1	59	2025-08-19 14:45:12.728894	incomplete	0
1	60	2025-08-19 14:45:12.728894	incomplete	0
1	61	2025-08-19 14:45:12.728894	incomplete	0
1	62	2025-08-19 14:45:12.728894	incomplete	0
1	63	2025-08-19 14:45:12.728894	incomplete	0
1	64	2025-08-19 14:45:12.728894	incomplete	0
1	65	2025-08-19 14:45:12.728894	incomplete	0
1	66	2025-08-19 14:45:12.728894	incomplete	0
1	67	2025-08-19 14:45:12.728894	incomplete	0
1	68	2025-08-19 14:45:12.728894	incomplete	0
1	69	2025-08-19 14:45:12.728894	incomplete	0
1	70	2025-08-19 14:45:12.728894	incomplete	0
1	71	2025-08-19 14:45:12.728894	incomplete	0
1	72	2025-08-19 14:45:12.728894	incomplete	0
1	73	2025-08-19 14:45:12.728894	incomplete	0
1	74	2025-08-19 14:45:12.728894	incomplete	0
1	75	2025-08-19 14:45:12.728894	incomplete	0
1	76	2025-08-19 14:45:12.728894	incomplete	0
1	77	2025-08-19 14:45:12.728894	incomplete	0
1	78	2025-08-19 14:45:12.728894	incomplete	0
1	79	2025-08-19 14:45:12.728894	incomplete	0
1	80	2025-08-19 14:45:12.728894	incomplete	0
1	81	2025-08-19 14:45:12.728894	incomplete	0
1	82	2025-08-19 14:45:12.728894	incomplete	0
1	83	2025-08-19 14:45:12.728894	incomplete	0
1	84	2025-08-19 14:45:12.728894	incomplete	0
1	85	2025-08-19 14:45:12.728894	incomplete	0
1	86	2025-08-19 14:45:12.728894	incomplete	0
1	87	2025-08-19 14:45:12.728894	incomplete	0
1	88	2025-08-19 14:45:12.728894	incomplete	0
1	89	2025-08-19 14:45:12.728894	incomplete	0
1	90	2025-08-19 14:45:12.728894	incomplete	0
1	91	2025-08-19 14:45:12.728894	incomplete	0
1	92	2025-08-19 14:45:12.728894	incomplete	0
1	93	2025-08-19 14:45:12.728894	incomplete	0
1	94	2025-08-19 14:45:12.728894	incomplete	0
1	95	2025-08-19 14:45:12.728894	incomplete	0
1	96	2025-08-19 14:45:12.728894	incomplete	0
1	97	2025-08-19 14:45:12.728894	incomplete	0
1	98	2025-08-19 14:45:12.728894	incomplete	0
1	99	2025-08-19 14:45:12.728894	incomplete	0
1	100	2025-08-19 14:45:12.728894	incomplete	0
1	101	2025-08-19 14:45:12.728894	incomplete	0
1	102	2025-08-19 14:45:12.728894	incomplete	0
1	103	2025-08-19 14:45:12.728894	incomplete	0
1	104	2025-08-19 14:45:12.728894	incomplete	0
1	105	2025-08-19 14:45:12.728894	incomplete	0
1	106	2025-08-19 14:45:12.728894	incomplete	0
1	107	2025-08-19 14:45:12.728894	incomplete	0
1	108	2025-08-19 14:45:12.728894	incomplete	0
1	109	2025-08-19 14:45:12.728894	incomplete	0
1	110	2025-08-19 14:45:12.728894	incomplete	0
1	111	2025-08-19 14:45:12.728894	incomplete	0
1	112	2025-08-19 14:45:12.728894	incomplete	0
1	113	2025-08-19 14:45:12.728894	incomplete	0
1	114	2025-08-19 14:45:12.728894	incomplete	0
1	115	2025-08-19 14:45:12.728894	incomplete	0
1	116	2025-08-19 14:45:12.728894	incomplete	0
1	117	2025-08-19 14:45:12.728894	incomplete	0
1	118	2025-08-19 14:45:12.728894	incomplete	0
1	119	2025-08-19 14:45:12.728894	incomplete	0
1	120	2025-08-19 14:45:12.728894	incomplete	0
1	121	2025-08-19 14:45:12.728894	incomplete	0
1	122	2025-08-19 14:45:12.728894	incomplete	0
1	123	2025-08-19 14:45:12.728894	incomplete	0
1	124	2025-08-19 14:45:12.728894	incomplete	0
1	125	2025-08-19 14:45:12.728894	incomplete	0
2	2	2025-08-19 19:47:43.447907	incomplete	0
2	3	2025-08-19 19:47:43.447907	incomplete	0
2	5	2025-08-19 19:47:43.447907	incomplete	0
2	6	2025-08-19 19:47:43.447907	incomplete	0
2	13	2025-08-19 19:47:43.447907	incomplete	0
2	14	2025-08-19 19:47:43.447907	incomplete	0
2	15	2025-08-19 19:47:43.447907	incomplete	0
2	17	2025-08-19 19:47:43.447907	incomplete	0
2	19	2025-08-19 19:47:43.447907	incomplete	0
2	21	2025-08-19 19:47:43.447907	incomplete	0
2	22	2025-08-19 19:47:43.447907	incomplete	0
2	24	2025-08-19 19:47:43.447907	incomplete	0
2	25	2025-08-19 19:47:43.447907	incomplete	0
2	29	2025-08-19 19:47:43.447907	incomplete	0
2	31	2025-08-19 19:47:43.447907	incomplete	0
2	32	2025-08-19 19:47:43.447907	incomplete	0
2	33	2025-08-19 19:47:43.447907	incomplete	0
2	34	2025-08-19 19:47:43.447907	incomplete	0
2	37	2025-08-19 19:47:43.447907	incomplete	0
2	38	2025-08-19 19:47:43.447907	incomplete	0
2	41	2025-08-19 19:47:43.447907	incomplete	0
2	42	2025-08-19 19:47:43.447907	incomplete	0
2	43	2025-08-19 19:47:43.447907	incomplete	0
2	44	2025-08-19 19:47:43.447907	incomplete	0
2	48	2025-08-19 19:47:43.447907	incomplete	0
2	49	2025-08-19 19:47:43.447907	incomplete	0
2	50	2025-08-19 19:47:43.447907	incomplete	0
2	51	2025-08-19 19:47:43.447907	incomplete	0
2	52	2025-08-19 19:47:43.447907	incomplete	0
2	53	2025-08-19 19:47:43.447907	incomplete	0
2	54	2025-08-19 19:47:43.447907	incomplete	0
2	55	2025-08-19 19:47:43.447907	incomplete	0
2	56	2025-08-19 19:47:43.447907	incomplete	0
2	57	2025-08-19 19:47:43.447907	incomplete	0
2	58	2025-08-19 19:47:43.447907	incomplete	0
2	59	2025-08-19 19:47:43.447907	incomplete	0
2	60	2025-08-19 19:47:43.447907	incomplete	0
2	61	2025-08-19 19:47:43.447907	incomplete	0
2	62	2025-08-19 19:47:43.447907	incomplete	0
2	63	2025-08-19 19:47:43.447907	incomplete	0
2	64	2025-08-19 19:47:43.447907	incomplete	0
2	65	2025-08-19 19:47:43.447907	incomplete	0
2	66	2025-08-19 19:47:43.447907	incomplete	0
2	67	2025-08-19 19:47:43.447907	incomplete	0
2	68	2025-08-19 19:47:43.447907	incomplete	0
2	69	2025-08-19 19:47:43.447907	incomplete	0
2	70	2025-08-19 19:47:43.447907	incomplete	0
2	71	2025-08-19 19:47:43.447907	incomplete	0
2	72	2025-08-19 19:47:43.447907	incomplete	0
2	73	2025-08-19 19:47:43.447907	incomplete	0
2	74	2025-08-19 19:47:43.447907	incomplete	0
2	75	2025-08-19 19:47:43.447907	incomplete	0
2	76	2025-08-19 19:47:43.447907	incomplete	0
2	77	2025-08-19 19:47:43.447907	incomplete	0
2	78	2025-08-19 19:47:43.447907	incomplete	0
2	79	2025-08-19 19:47:43.447907	incomplete	0
2	80	2025-08-19 19:47:43.447907	incomplete	0
2	81	2025-08-19 19:47:43.447907	incomplete	0
2	82	2025-08-19 19:47:43.447907	incomplete	0
2	83	2025-08-19 19:47:43.447907	incomplete	0
2	84	2025-08-19 19:47:43.447907	incomplete	0
2	85	2025-08-19 19:47:43.447907	incomplete	0
2	86	2025-08-19 19:47:43.447907	incomplete	0
2	87	2025-08-19 19:47:43.447907	incomplete	0
2	88	2025-08-19 19:47:43.447907	incomplete	0
2	89	2025-08-19 19:47:43.447907	incomplete	0
2	90	2025-08-19 19:47:43.447907	incomplete	0
2	91	2025-08-19 19:47:43.447907	incomplete	0
2	92	2025-08-19 19:47:43.447907	incomplete	0
2	93	2025-08-19 19:47:43.447907	incomplete	0
2	94	2025-08-19 19:47:43.447907	incomplete	0
2	95	2025-08-19 19:47:43.447907	incomplete	0
2	96	2025-08-19 19:47:43.447907	incomplete	0
2	97	2025-08-19 19:47:43.447907	incomplete	0
2	98	2025-08-19 19:47:43.447907	incomplete	0
2	99	2025-08-19 19:47:43.447907	incomplete	0
2	100	2025-08-19 19:47:43.447907	incomplete	0
2	101	2025-08-19 19:47:43.447907	incomplete	0
2	102	2025-08-19 19:47:43.447907	incomplete	0
2	103	2025-08-19 19:47:43.447907	incomplete	0
2	104	2025-08-19 19:47:43.447907	incomplete	0
2	105	2025-08-19 19:47:43.447907	incomplete	0
2	106	2025-08-19 19:47:43.447907	incomplete	0
2	107	2025-08-19 19:47:43.447907	incomplete	0
2	108	2025-08-19 19:47:43.447907	incomplete	0
2	109	2025-08-19 19:47:43.447907	incomplete	0
2	110	2025-08-19 19:47:43.447907	incomplete	0
2	111	2025-08-19 19:47:43.447907	incomplete	0
2	112	2025-08-19 19:47:43.447907	incomplete	0
2	113	2025-08-19 19:47:43.447907	incomplete	0
2	114	2025-08-19 19:47:43.447907	incomplete	0
2	115	2025-08-19 19:47:43.447907	incomplete	0
2	116	2025-08-19 19:47:43.447907	incomplete	0
2	117	2025-08-19 19:47:43.447907	incomplete	0
2	118	2025-08-19 19:47:43.447907	incomplete	0
2	119	2025-08-19 19:47:43.447907	incomplete	0
2	120	2025-08-19 19:47:43.447907	incomplete	0
2	121	2025-08-19 19:47:43.447907	incomplete	0
2	122	2025-08-19 19:47:43.447907	incomplete	0
2	123	2025-08-19 19:47:43.447907	incomplete	0
2	124	2025-08-19 19:47:43.447907	incomplete	0
2	125	2025-08-19 19:47:43.447907	incomplete	0
7	1	2025-08-19 21:08:38.388189	incomplete	0
7	8	2025-08-19 21:08:38.388189	incomplete	0
7	9	2025-08-19 21:08:38.388189	incomplete	0
7	10	2025-08-19 21:08:38.388189	incomplete	0
7	11	2025-08-19 21:08:38.388189	incomplete	0
7	13	2025-08-19 21:08:38.388189	incomplete	0
7	14	2025-08-19 21:08:38.388189	incomplete	0
7	15	2025-08-19 21:08:38.388189	incomplete	0
7	17	2025-08-19 21:08:38.388189	incomplete	0
7	18	2025-08-19 21:08:38.388189	incomplete	0
7	19	2025-08-19 21:08:38.388189	incomplete	0
7	20	2025-08-19 21:08:38.388189	incomplete	0
7	21	2025-08-19 21:08:38.388189	incomplete	0
7	23	2025-08-19 21:08:38.388189	incomplete	0
7	25	2025-08-19 21:08:38.388189	incomplete	0
7	26	2025-08-19 21:08:38.388189	incomplete	0
7	28	2025-08-19 21:08:38.388189	incomplete	0
7	30	2025-08-19 21:08:38.388189	incomplete	0
7	38	2025-08-19 21:08:38.388189	incomplete	0
7	40	2025-08-19 21:08:38.388189	incomplete	0
7	41	2025-08-19 21:08:38.388189	incomplete	0
7	42	2025-08-19 21:08:38.388189	incomplete	0
7	43	2025-08-19 21:08:38.388189	incomplete	0
7	44	2025-08-19 21:08:38.388189	incomplete	0
7	45	2025-08-19 21:08:38.388189	incomplete	0
7	49	2025-08-19 21:08:38.388189	incomplete	0
7	50	2025-08-19 21:08:38.388189	incomplete	0
7	52	2025-08-19 21:08:38.388189	incomplete	0
7	53	2025-08-19 21:08:38.388189	incomplete	0
7	54	2025-08-19 21:08:38.388189	incomplete	0
7	55	2025-08-19 21:08:38.388189	incomplete	0
7	56	2025-08-19 21:08:38.388189	incomplete	0
7	57	2025-08-19 21:08:38.388189	incomplete	0
7	58	2025-08-19 21:08:38.388189	incomplete	0
7	59	2025-08-19 21:08:38.388189	incomplete	0
7	60	2025-08-19 21:08:38.388189	incomplete	0
7	61	2025-08-19 21:08:38.388189	incomplete	0
7	62	2025-08-19 21:08:38.388189	incomplete	0
7	63	2025-08-19 21:08:38.388189	incomplete	0
7	64	2025-08-19 21:08:38.388189	incomplete	0
7	65	2025-08-19 21:08:38.388189	incomplete	0
7	66	2025-08-19 21:08:38.388189	incomplete	0
7	67	2025-08-19 21:08:38.388189	incomplete	0
7	68	2025-08-19 21:08:38.388189	incomplete	0
7	69	2025-08-19 21:08:38.388189	incomplete	0
7	70	2025-08-19 21:08:38.388189	incomplete	0
7	71	2025-08-19 21:08:38.388189	incomplete	0
7	72	2025-08-19 21:08:38.388189	incomplete	0
7	73	2025-08-19 21:08:38.388189	incomplete	0
7	74	2025-08-19 21:08:38.388189	incomplete	0
7	75	2025-08-19 21:08:38.388189	incomplete	0
7	76	2025-08-19 21:08:38.388189	incomplete	0
7	77	2025-08-19 21:08:38.388189	incomplete	0
7	78	2025-08-19 21:08:38.388189	incomplete	0
7	79	2025-08-19 21:08:38.388189	incomplete	0
7	80	2025-08-19 21:08:38.388189	incomplete	0
7	81	2025-08-19 21:08:38.388189	incomplete	0
7	82	2025-08-19 21:08:38.388189	incomplete	0
7	83	2025-08-19 21:08:38.388189	incomplete	0
7	84	2025-08-19 21:08:38.388189	incomplete	0
7	85	2025-08-19 21:08:38.388189	incomplete	0
7	86	2025-08-19 21:08:38.388189	incomplete	0
7	87	2025-08-19 21:08:38.388189	incomplete	0
7	88	2025-08-19 21:08:38.388189	incomplete	0
7	89	2025-08-19 21:08:38.388189	incomplete	0
7	90	2025-08-19 21:08:38.388189	incomplete	0
7	91	2025-08-19 21:08:38.388189	incomplete	0
7	92	2025-08-19 21:08:38.388189	incomplete	0
7	93	2025-08-19 21:08:38.388189	incomplete	0
7	94	2025-08-19 21:08:38.388189	incomplete	0
7	95	2025-08-19 21:08:38.388189	incomplete	0
7	96	2025-08-19 21:08:38.388189	incomplete	0
7	97	2025-08-19 21:08:38.388189	incomplete	0
7	98	2025-08-19 21:08:38.388189	incomplete	0
7	99	2025-08-19 21:08:38.388189	incomplete	0
7	100	2025-08-19 21:08:38.388189	incomplete	0
7	101	2025-08-19 21:08:38.388189	incomplete	0
7	102	2025-08-19 21:08:38.388189	incomplete	0
7	103	2025-08-19 21:08:38.388189	incomplete	0
7	104	2025-08-19 21:08:38.388189	incomplete	0
7	105	2025-08-19 21:08:38.388189	incomplete	0
7	106	2025-08-19 21:08:38.388189	incomplete	0
7	107	2025-08-19 21:08:38.388189	incomplete	0
7	108	2025-08-19 21:08:38.388189	incomplete	0
7	109	2025-08-19 21:08:38.388189	incomplete	0
7	110	2025-08-19 21:08:38.388189	incomplete	0
7	111	2025-08-19 21:08:38.388189	incomplete	0
7	112	2025-08-19 21:08:38.388189	incomplete	0
7	113	2025-08-19 21:08:38.388189	incomplete	0
7	114	2025-08-19 21:08:38.388189	incomplete	0
7	115	2025-08-19 21:08:38.388189	incomplete	0
7	116	2025-08-19 21:08:38.388189	incomplete	0
7	117	2025-08-19 21:08:38.388189	incomplete	0
7	118	2025-08-19 21:08:38.388189	incomplete	0
7	119	2025-08-19 21:08:38.388189	incomplete	0
7	120	2025-08-19 21:08:38.388189	incomplete	0
7	121	2025-08-19 21:08:38.388189	incomplete	0
7	122	2025-08-19 21:08:38.388189	incomplete	0
7	123	2025-08-19 21:08:38.388189	incomplete	0
7	124	2025-08-19 21:08:38.388189	incomplete	0
7	125	2025-08-19 21:08:38.388189	incomplete	0
3	1	2025-08-19 22:38:26.432152	incomplete	0
3	4	2025-08-19 22:38:26.432152	incomplete	0
3	5	2025-08-19 22:38:26.432152	incomplete	0
3	8	2025-08-19 22:38:26.432152	incomplete	0
3	9	2025-08-19 22:38:26.432152	incomplete	0
3	11	2025-08-19 22:38:26.432152	incomplete	0
3	12	2025-08-19 22:38:26.432152	incomplete	0
3	14	2025-08-19 22:38:26.432152	incomplete	0
3	15	2025-08-19 22:38:26.432152	incomplete	0
3	16	2025-08-19 22:38:26.432152	incomplete	0
3	17	2025-08-19 22:38:26.432152	incomplete	0
3	21	2025-08-19 22:38:26.432152	incomplete	0
3	22	2025-08-19 22:38:26.432152	incomplete	0
3	25	2025-08-19 22:38:26.432152	incomplete	0
3	26	2025-08-19 22:38:26.432152	incomplete	0
3	28	2025-08-19 22:38:26.432152	incomplete	0
3	30	2025-08-19 22:38:26.432152	incomplete	0
3	32	2025-08-19 22:38:26.432152	incomplete	0
3	35	2025-08-19 22:38:26.432152	incomplete	0
3	36	2025-08-19 22:38:26.432152	incomplete	0
3	37	2025-08-19 22:38:26.432152	incomplete	0
3	39	2025-08-19 22:38:26.432152	incomplete	0
3	43	2025-08-19 22:38:26.432152	incomplete	0
3	44	2025-08-19 22:38:26.432152	incomplete	0
3	45	2025-08-19 22:38:26.432152	incomplete	0
3	46	2025-08-19 22:38:26.432152	incomplete	0
3	49	2025-08-19 22:38:26.432152	incomplete	0
3	50	2025-08-19 22:38:26.432152	incomplete	0
3	51	2025-08-19 22:38:26.432152	incomplete	0
3	52	2025-08-19 22:38:26.432152	incomplete	0
3	53	2025-08-19 22:38:26.432152	incomplete	0
3	54	2025-08-19 22:38:26.432152	incomplete	0
3	55	2025-08-19 22:38:26.432152	incomplete	0
3	56	2025-08-19 22:38:26.432152	incomplete	0
3	57	2025-08-19 22:38:26.432152	incomplete	0
3	58	2025-08-19 22:38:26.432152	incomplete	0
3	59	2025-08-19 22:38:26.432152	incomplete	0
3	60	2025-08-19 22:38:26.432152	incomplete	0
3	61	2025-08-19 22:38:26.432152	incomplete	0
3	62	2025-08-19 22:38:26.432152	incomplete	0
3	63	2025-08-19 22:38:26.432152	incomplete	0
3	64	2025-08-19 22:38:26.432152	incomplete	0
3	65	2025-08-19 22:38:26.432152	incomplete	0
3	66	2025-08-19 22:38:26.432152	incomplete	0
3	67	2025-08-19 22:38:26.432152	incomplete	0
3	68	2025-08-19 22:38:26.432152	incomplete	0
3	69	2025-08-19 22:38:26.432152	incomplete	0
3	70	2025-08-19 22:38:26.432152	incomplete	0
3	71	2025-08-19 22:38:26.432152	incomplete	0
3	72	2025-08-19 22:38:26.432152	incomplete	0
3	73	2025-08-19 22:38:26.432152	incomplete	0
3	74	2025-08-19 22:38:26.432152	incomplete	0
3	75	2025-08-19 22:38:26.432152	incomplete	0
3	76	2025-08-19 22:38:26.432152	incomplete	0
3	77	2025-08-19 22:38:26.432152	incomplete	0
3	78	2025-08-19 22:38:26.432152	incomplete	0
3	79	2025-08-19 22:38:26.432152	incomplete	0
3	80	2025-08-19 22:38:26.432152	incomplete	0
3	81	2025-08-19 22:38:26.432152	incomplete	0
3	82	2025-08-19 22:38:26.432152	incomplete	0
3	83	2025-08-19 22:38:26.432152	incomplete	0
3	84	2025-08-19 22:38:26.432152	incomplete	0
3	85	2025-08-19 22:38:26.432152	incomplete	0
3	86	2025-08-19 22:38:26.432152	incomplete	0
3	87	2025-08-19 22:38:26.432152	incomplete	0
3	88	2025-08-19 22:38:26.432152	incomplete	0
3	89	2025-08-19 22:38:26.432152	incomplete	0
3	90	2025-08-19 22:38:26.432152	incomplete	0
3	91	2025-08-19 22:38:26.432152	incomplete	0
3	92	2025-08-19 22:38:26.432152	incomplete	0
3	93	2025-08-19 22:38:26.432152	incomplete	0
3	94	2025-08-19 22:38:26.432152	incomplete	0
3	95	2025-08-19 22:38:26.432152	incomplete	0
3	96	2025-08-19 22:38:26.432152	incomplete	0
3	97	2025-08-19 22:38:26.432152	incomplete	0
3	98	2025-08-19 22:38:26.432152	incomplete	0
3	99	2025-08-19 22:38:26.432152	incomplete	0
3	100	2025-08-19 22:38:26.432152	incomplete	0
3	101	2025-08-19 22:38:26.432152	incomplete	0
3	102	2025-08-19 22:38:26.432152	incomplete	0
3	103	2025-08-19 22:38:26.432152	incomplete	0
3	104	2025-08-19 22:38:26.432152	incomplete	0
3	105	2025-08-19 22:38:26.432152	incomplete	0
3	106	2025-08-19 22:38:26.432152	incomplete	0
3	107	2025-08-19 22:38:26.432152	incomplete	0
3	108	2025-08-19 22:38:26.432152	incomplete	0
3	109	2025-08-19 22:38:26.432152	incomplete	0
3	110	2025-08-19 22:38:26.432152	incomplete	0
3	111	2025-08-19 22:38:26.432152	incomplete	0
3	112	2025-08-19 22:38:26.432152	incomplete	0
3	113	2025-08-19 22:38:26.432152	incomplete	0
3	114	2025-08-19 22:38:26.432152	incomplete	0
3	115	2025-08-19 22:38:26.432152	incomplete	0
3	116	2025-08-19 22:38:26.432152	incomplete	0
3	117	2025-08-19 22:38:26.432152	incomplete	0
3	118	2025-08-19 22:38:26.432152	incomplete	0
3	119	2025-08-19 22:38:26.432152	incomplete	0
3	120	2025-08-19 22:38:26.432152	incomplete	0
3	121	2025-08-19 22:38:26.432152	incomplete	0
3	122	2025-08-19 22:38:26.432152	incomplete	0
3	123	2025-08-19 22:38:26.432152	incomplete	0
3	124	2025-08-19 22:38:26.432152	incomplete	0
3	125	2025-08-19 22:38:26.432152	incomplete	0
9	4	2025-09-06 21:42:25.894685	incomplete	0
9	5	2025-09-06 21:42:25.894685	incomplete	0
9	6	2025-09-06 21:42:25.894685	incomplete	0
9	7	2025-09-06 21:42:25.894685	incomplete	0
9	8	2025-09-06 21:42:25.894685	incomplete	0
9	9	2025-09-06 21:42:25.894685	incomplete	0
9	11	2025-09-06 21:42:25.894685	incomplete	0
9	13	2025-09-06 21:42:25.894685	incomplete	0
9	14	2025-09-06 21:42:25.894685	incomplete	0
9	15	2025-09-06 21:42:25.894685	incomplete	0
9	17	2025-09-06 21:42:25.894685	incomplete	0
9	20	2025-09-06 21:42:25.894685	incomplete	0
9	21	2025-09-06 21:42:25.894685	incomplete	0
9	22	2025-09-06 21:42:25.894685	incomplete	0
9	23	2025-09-06 21:42:25.894685	incomplete	0
9	24	2025-09-06 21:42:25.894685	incomplete	0
9	25	2025-09-06 21:42:25.894685	incomplete	0
9	26	2025-09-06 21:42:25.894685	incomplete	0
9	28	2025-09-06 21:42:25.894685	incomplete	0
9	29	2025-09-06 21:42:25.894685	incomplete	0
9	30	2025-09-06 21:42:25.894685	incomplete	0
9	33	2025-09-06 21:42:25.894685	incomplete	0
9	34	2025-09-06 21:42:25.894685	incomplete	0
9	35	2025-09-06 21:42:25.894685	incomplete	0
9	36	2025-09-06 21:42:25.894685	incomplete	0
9	37	2025-09-06 21:42:25.894685	incomplete	0
9	38	2025-09-06 21:42:25.894685	incomplete	0
9	41	2025-09-06 21:42:25.894685	incomplete	0
9	42	2025-09-06 21:42:25.894685	incomplete	0
9	44	2025-09-06 21:42:25.894685	incomplete	0
9	48	2025-09-06 21:42:25.894685	incomplete	0
9	49	2025-09-06 21:42:25.894685	incomplete	0
9	50	2025-09-06 21:42:25.894685	incomplete	0
9	51	2025-09-06 21:42:25.894685	incomplete	0
9	52	2025-09-06 21:42:25.894685	incomplete	0
9	53	2025-09-06 21:42:25.894685	incomplete	0
9	54	2025-09-06 21:42:25.894685	incomplete	0
9	55	2025-09-06 21:42:25.894685	incomplete	0
9	56	2025-09-06 21:42:25.894685	incomplete	0
9	57	2025-09-06 21:42:25.894685	incomplete	0
9	58	2025-09-06 21:42:25.894685	incomplete	0
9	59	2025-09-06 21:42:25.894685	incomplete	0
9	60	2025-09-06 21:42:25.894685	incomplete	0
9	61	2025-09-06 21:42:25.894685	incomplete	0
9	62	2025-09-06 21:42:25.894685	incomplete	0
9	63	2025-09-06 21:42:25.894685	incomplete	0
9	64	2025-09-06 21:42:25.894685	incomplete	0
9	65	2025-09-06 21:42:25.894685	incomplete	0
9	66	2025-09-06 21:42:25.894685	incomplete	0
9	67	2025-09-06 21:42:25.894685	incomplete	0
9	68	2025-09-06 21:42:25.894685	incomplete	0
9	69	2025-09-06 21:42:25.894685	incomplete	0
9	70	2025-09-06 21:42:25.894685	incomplete	0
9	71	2025-09-06 21:42:25.894685	incomplete	0
9	72	2025-09-06 21:42:25.894685	incomplete	0
9	73	2025-09-06 21:42:25.894685	incomplete	0
9	74	2025-09-06 21:42:25.894685	incomplete	0
9	75	2025-09-06 21:42:25.894685	incomplete	0
9	76	2025-09-06 21:42:25.894685	incomplete	0
9	77	2025-09-06 21:42:25.894685	incomplete	0
9	78	2025-09-06 21:42:25.894685	incomplete	0
9	79	2025-09-06 21:42:25.894685	incomplete	0
9	80	2025-09-06 21:42:25.894685	incomplete	0
9	81	2025-09-06 21:42:25.894685	incomplete	0
9	82	2025-09-06 21:42:25.894685	incomplete	0
9	83	2025-09-06 21:42:25.894685	incomplete	0
9	84	2025-09-06 21:42:25.894685	incomplete	0
9	85	2025-09-06 21:42:25.894685	incomplete	0
9	86	2025-09-06 21:42:25.894685	incomplete	0
9	87	2025-09-06 21:42:25.894685	incomplete	0
9	88	2025-09-06 21:42:25.894685	incomplete	0
9	89	2025-09-06 21:42:25.894685	incomplete	0
9	90	2025-09-06 21:42:25.894685	incomplete	0
9	91	2025-09-06 21:42:25.894685	incomplete	0
9	92	2025-09-06 21:42:25.894685	incomplete	0
9	93	2025-09-06 21:42:25.894685	incomplete	0
9	94	2025-09-06 21:42:25.894685	incomplete	0
9	95	2025-09-06 21:42:25.894685	incomplete	0
9	96	2025-09-06 21:42:25.894685	incomplete	0
9	97	2025-09-06 21:42:25.894685	incomplete	0
9	98	2025-09-06 21:42:25.894685	incomplete	0
9	99	2025-09-06 21:42:25.894685	incomplete	0
9	100	2025-09-06 21:42:25.894685	incomplete	0
9	101	2025-09-06 21:42:25.894685	incomplete	0
9	102	2025-09-06 21:42:25.894685	incomplete	0
9	103	2025-09-06 21:42:25.894685	incomplete	0
9	104	2025-09-06 21:42:25.894685	incomplete	0
9	105	2025-09-06 21:42:25.894685	incomplete	0
9	106	2025-09-06 21:42:25.894685	incomplete	0
9	107	2025-09-06 21:42:25.894685	incomplete	0
9	108	2025-09-06 21:42:25.894685	incomplete	0
9	109	2025-09-06 21:42:25.894685	incomplete	0
9	110	2025-09-06 21:42:25.894685	incomplete	0
9	111	2025-09-06 21:42:25.894685	incomplete	0
9	112	2025-09-06 21:42:25.894685	incomplete	0
9	113	2025-09-06 21:42:25.894685	incomplete	0
9	114	2025-09-06 21:42:25.894685	incomplete	0
9	115	2025-09-06 21:42:25.894685	incomplete	0
9	116	2025-09-06 21:42:25.894685	incomplete	0
9	117	2025-09-06 21:42:25.894685	incomplete	0
9	118	2025-09-06 21:42:25.894685	incomplete	0
9	119	2025-09-06 21:42:25.894685	incomplete	0
9	120	2025-09-06 21:42:25.894685	incomplete	0
9	121	2025-09-06 21:42:25.894685	incomplete	0
9	122	2025-09-06 21:42:25.894685	incomplete	0
9	123	2025-09-06 21:42:25.894685	incomplete	0
9	124	2025-09-06 21:42:25.894685	incomplete	0
9	125	2025-09-06 21:42:25.894685	incomplete	0
10	1	2025-09-12 20:00:14.505016	incomplete	0
10	4	2025-09-12 20:00:14.505016	incomplete	0
10	7	2025-09-12 20:00:14.505016	incomplete	0
10	9	2025-09-12 20:00:14.505016	incomplete	0
10	10	2025-09-12 20:00:14.505016	incomplete	0
10	12	2025-09-12 20:00:14.505016	incomplete	0
10	18	2025-09-12 20:00:14.505016	incomplete	0
10	19	2025-09-12 20:00:14.505016	incomplete	0
10	20	2025-09-12 20:00:14.505016	incomplete	0
10	21	2025-09-12 20:00:14.505016	incomplete	0
10	23	2025-09-12 20:00:14.505016	incomplete	0
10	27	2025-09-12 20:00:14.505016	incomplete	0
10	33	2025-09-12 20:00:14.505016	incomplete	0
10	35	2025-09-12 20:00:14.505016	incomplete	0
10	38	2025-09-12 20:00:14.505016	incomplete	0
10	40	2025-09-12 20:00:14.505016	incomplete	0
10	41	2025-09-12 20:00:14.505016	incomplete	0
10	43	2025-09-12 20:00:14.505016	incomplete	0
10	44	2025-09-12 20:00:14.505016	incomplete	0
10	46	2025-09-12 20:00:14.505016	incomplete	0
10	47	2025-09-12 20:00:14.505016	incomplete	0
10	48	2025-09-12 20:00:14.505016	incomplete	0
10	49	2025-09-12 20:00:14.505016	incomplete	0
10	52	2025-09-12 20:00:14.505016	incomplete	0
10	53	2025-09-12 20:00:14.505016	incomplete	0
10	54	2025-09-12 20:00:14.505016	incomplete	0
10	55	2025-09-12 20:00:14.505016	incomplete	0
10	56	2025-09-12 20:00:14.505016	incomplete	0
10	57	2025-09-12 20:00:14.505016	incomplete	0
10	58	2025-09-12 20:00:14.505016	incomplete	0
10	59	2025-09-12 20:00:14.505016	incomplete	0
10	60	2025-09-12 20:00:14.505016	incomplete	0
10	61	2025-09-12 20:00:14.505016	incomplete	0
10	62	2025-09-12 20:00:14.505016	incomplete	0
10	63	2025-09-12 20:00:14.505016	incomplete	0
10	64	2025-09-12 20:00:14.505016	incomplete	0
10	65	2025-09-12 20:00:14.505016	incomplete	0
10	66	2025-09-12 20:00:14.505016	incomplete	0
10	67	2025-09-12 20:00:14.505016	incomplete	0
10	68	2025-09-12 20:00:14.505016	incomplete	0
10	69	2025-09-12 20:00:14.505016	incomplete	0
10	70	2025-09-12 20:00:14.505016	incomplete	0
10	71	2025-09-12 20:00:14.505016	incomplete	0
10	72	2025-09-12 20:00:14.505016	incomplete	0
10	73	2025-09-12 20:00:14.505016	incomplete	0
10	74	2025-09-12 20:00:14.505016	incomplete	0
10	75	2025-09-12 20:00:14.505016	incomplete	0
10	76	2025-09-12 20:00:14.505016	incomplete	0
10	77	2025-09-12 20:00:14.505016	incomplete	0
10	78	2025-09-12 20:00:14.505016	incomplete	0
10	79	2025-09-12 20:00:14.505016	incomplete	0
10	80	2025-09-12 20:00:14.505016	incomplete	0
10	81	2025-09-12 20:00:14.505016	incomplete	0
10	82	2025-09-12 20:00:14.505016	incomplete	0
10	83	2025-09-12 20:00:14.505016	incomplete	0
10	84	2025-09-12 20:00:14.505016	incomplete	0
10	85	2025-09-12 20:00:14.505016	incomplete	0
10	86	2025-09-12 20:00:14.505016	incomplete	0
10	87	2025-09-12 20:00:14.505016	incomplete	0
10	88	2025-09-12 20:00:14.505016	incomplete	0
10	89	2025-09-12 20:00:14.505016	incomplete	0
10	90	2025-09-12 20:00:14.505016	incomplete	0
10	91	2025-09-12 20:00:14.505016	incomplete	0
10	92	2025-09-12 20:00:14.505016	incomplete	0
10	93	2025-09-12 20:00:14.505016	incomplete	0
10	94	2025-09-12 20:00:14.505016	incomplete	0
10	95	2025-09-12 20:00:14.505016	incomplete	0
10	96	2025-09-12 20:00:14.505016	incomplete	0
10	97	2025-09-12 20:00:14.505016	incomplete	0
10	98	2025-09-12 20:00:14.505016	incomplete	0
10	99	2025-09-12 20:00:14.505016	incomplete	0
10	100	2025-09-12 20:00:14.505016	incomplete	0
10	101	2025-09-12 20:00:14.505016	incomplete	0
10	102	2025-09-12 20:00:14.505016	incomplete	0
10	103	2025-09-12 20:00:14.505016	incomplete	0
10	104	2025-09-12 20:00:14.505016	incomplete	0
10	105	2025-09-12 20:00:14.505016	incomplete	0
10	106	2025-09-12 20:00:14.505016	incomplete	0
10	107	2025-09-12 20:00:14.505016	incomplete	0
10	108	2025-09-12 20:00:14.505016	incomplete	0
10	109	2025-09-12 20:00:14.505016	incomplete	0
10	110	2025-09-12 20:00:14.505016	incomplete	0
10	111	2025-09-12 20:00:14.505016	incomplete	0
10	112	2025-09-12 20:00:14.505016	incomplete	0
10	113	2025-09-12 20:00:14.505016	incomplete	0
10	114	2025-09-12 20:00:14.505016	incomplete	0
10	115	2025-09-12 20:00:14.505016	incomplete	0
10	116	2025-09-12 20:00:14.505016	incomplete	0
10	117	2025-09-12 20:00:14.505016	incomplete	0
10	118	2025-09-12 20:00:14.505016	incomplete	0
10	119	2025-09-12 20:00:14.505016	incomplete	0
10	120	2025-09-12 20:00:14.505016	incomplete	0
10	121	2025-09-12 20:00:14.505016	incomplete	0
10	122	2025-09-12 20:00:14.505016	incomplete	0
10	123	2025-09-12 20:00:14.505016	incomplete	0
10	124	2025-09-12 20:00:14.505016	incomplete	0
10	125	2025-09-12 20:00:14.505016	incomplete	0
\.


--
-- Data for Name: user_lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_lessons (user_id, lesson_id, completed_at) FROM stdin;
1	5	2025-06-12 14:30:00
1	3	2025-06-12 14:30:00
1	8	2025-06-15 14:30:00
1	21	2025-06-03 14:30:00
1	12	2025-06-19 14:30:00
1	22	2025-06-05 14:30:00
1	13	2025-06-17 14:30:00
1	2	2025-06-12 14:30:00
1	25	2025-06-13 14:30:00
1	15	2025-06-11 14:30:00
2	9	2025-06-05 14:30:00
2	8	2025-06-03 14:30:00
2	4	2025-06-15 14:30:00
2	1	2025-06-06 14:30:00
2	6	2025-06-15 14:30:00
2	16	2025-06-03 14:30:00
2	17	2025-06-11 14:30:00
2	13	2025-06-12 14:30:00
2	23	2025-06-03 14:30:00
2	25	2025-06-18 14:30:00
2	18	2025-06-18 14:30:00
2	5	2025-06-10 14:30:00
2	12	2025-06-10 14:30:00
2	24	2025-06-06 14:30:00
2	19	2025-06-06 14:30:00
2	10	2025-06-12 14:30:00
2	14	2025-06-17 14:30:00
2	15	2025-06-08 14:30:00
2	2	2025-06-04 14:30:00
2	22	2025-06-07 14:30:00
3	8	2025-06-13 14:30:00
3	16	2025-06-16 14:30:00
3	1	2025-06-17 14:30:00
3	12	2025-06-14 14:30:00
3	18	2025-06-14 14:30:00
3	19	2025-06-19 14:30:00
3	22	2025-06-03 14:30:00
3	15	2025-06-05 14:30:00
3	5	2025-06-11 14:30:00
3	3	2025-06-03 14:30:00
3	2	2025-06-15 14:30:00
3	17	2025-06-15 14:30:00
4	1	2025-06-10 09:00:00
4	2	2025-06-11 10:00:00
4	3	2025-06-11 11:00:00
4	4	2025-06-12 12:00:00
4	5	2025-06-13 13:00:00
5	6	2025-06-14 08:30:00
5	7	2025-06-14 09:30:00
5	8	2025-06-15 10:30:00
5	9	2025-06-15 11:30:00
5	10	2025-06-16 12:30:00
5	11	2025-06-17 13:30:00
6	1	2025-06-12 07:00:00
6	12	2025-06-13 08:00:00
6	13	2025-06-13 09:00:00
6	14	2025-06-14 10:00:00
6	15	2025-06-15 11:00:00
7	16	2025-06-10 14:00:00
7	17	2025-06-11 15:00:00
7	18	2025-06-12 16:00:00
7	19	2025-06-13 17:00:00
7	20	2025-06-14 18:00:00
8	1	2025-06-18 10:00:00
8	6	2025-06-19 11:00:00
8	11	2025-06-20 12:00:00
9	21	2025-06-08 09:45:00
9	22	2025-06-08 10:45:00
9	23	2025-06-09 11:45:00
9	24	2025-06-10 12:45:00
9	25	2025-06-11 13:45:00
10	5	2025-06-14 16:00:00
10	10	2025-06-14 17:00:00
10	15	2025-06-15 18:00:00
10	20	2025-06-16 19:00:00
10	25	2025-06-17 20:00:00
\.


--
-- Data for Name: user_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_points (user_id, total_points, last_updated, tier_status) FROM stdin;
1	780	2025-08-19 14:32:54.840928	Wood
3	1020	2025-08-19 14:32:54.840928	Bronze
4	265	2025-08-19 14:32:54.840928	Wood
5	1350	2025-08-19 14:32:54.840928	Bronze
6	120	2025-08-19 14:32:54.840928	Wood
8	880	2025-08-19 14:32:54.840928	Wood
9	190	2025-08-19 14:32:54.840928	Wood
10	970	2025-08-19 14:32:54.840928	Wood
7	560	2025-08-19 14:32:54.840928	Wood
2	1675	2025-09-11 11:24:08.535714	Bronze
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preferences (user_id, theme, in_app_notifications_enabled, avatar_id, banner_id, ar_customizations_jsonb, created_at, updated_at) FROM stdin;
1	light	t	1	1	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
3	light	t	3	3	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
4	dark	t	4	1	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
5	light	t	5	2	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
6	dark	t	6	3	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
8	dark	t	8	5	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
10	dark	t	2	2	{}	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
9	light	t	9	1	{}	2025-08-19 14:32:54.840928	2025-09-06 20:18:08.625964
2	dark	t	3	2	{}	2025-08-19 14:32:54.840928	2025-09-11 11:05:09.933918
7	light	t	7	4	{}	2025-08-19 14:32:54.840928	2025-09-11 19:56:15.47413
\.


--
-- Data for Name: user_push_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_push_subscriptions (push_id, user_id, endpoint, p256dh, auth, created_at, enabled) FROM stdin;
2	9	placeholder-endpoint	placeholder-p256dh	placeholder-auth	2025-09-06 20:18:08.625964	f
3	2	placeholder-endpoint	placeholder-p256dh	placeholder-auth	2025-09-11 11:05:07.122875	f
1	7	placeholder-endpoint	placeholder-p256dh	placeholder-auth	2025-08-20 15:54:49.6113	f
\.


--
-- Data for Name: user_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tokens (token_id, user_id, token, created_at, expires_at) FROM stdin;
146	9	v3.local.fPjz3S1snLbcyYTYp6gplA1BtgEAjjfJ5kanxNM-J3_DlE416-jlACtxy4lWUdebfuf3gbb3BvpkmXNZTHr-KVnfjRCFfPo5heFOZGau5FNhO0IFRIfsThPOG6JNejIEgRLHTIXkXyhW7hmn6fuhCtC-51-h6qeE5tEhZ83eDV0645uGCUiFwkm6K0hrctK4F6vGd5AYhpRD_swdPHC1	2025-09-13 23:47:43.856365	2025-09-15 01:47:44.516
114	10	v3.local._pN-_B0AXWljgzEcai5JITwuuU3aQGp3xzPx-phQyvsdJbVquBtoQgl4WpB6Ikh_OhHanwVkfzCdwvhjIpfNcOYkjFaokhSQvPIU7JuVIupJtOVSKLTgyIChNRoVeiNmLoYhiiu8MGlEYgd8WbbwOSTHsru4SLKMTbwLHgnH2QwQNLwBqQQCFAUjHm4c8HELPCiyqEcGoEm5WVKctKr0Ug	2025-09-12 21:00:21.402789	2025-09-13 23:00:18.689
165	1	v3.local.6N7Lle4Gr-W24S8W0KTIeEE6917bv8opASUnxz7RaOH5J-m4Cpilv064z02afrYTEQxMyhHQOdoq6ht80-WZwQM__tnxmQduUywlvGRpkk0oA_s4uSdiQnpVhkVtYtxVpXI6Tt_xXM2dsC-af_5HS1VJAXOptK_N5dIGdrNjhp_DrCyg0JiVT3pUTGq9IwxIIhrKUnajWZLIPOx-YZPp	2025-09-14 02:13:12.724083	2025-09-15 04:13:13.533
171	2	v3.local.tpNIhpiCChkL2caiggXPgUGQmEPa_tMUizVWGq6wm2zjJ1aLjxM9Tmq58MeXbB_GN_bfhI3aGMfaieTnS3DWRhExKwNJk8k-TwG_cWAmgq4C3_Pzsg65vHaiDAu2eOU1q55hcwAa8U-jWwCNpsSXAehF7xoFOsmp42RQAr35OoPRsiTbefkw5rsCnXvZfx6G_g9mVVMwY8EjFmBAlsSJ	2025-09-14 19:24:24.105025	2025-09-15 21:24:23.356
172	7	v3.local.vr1losnr0Cewvn41eB0IQxR56Tv3XaEHKowa8tYVJpwPUA2OnR_BSwOj8dB2gVPPlgdmGcaUHk7bsyK5bv0i-aUFh4NVevz7dTKzAq_POMsymQSCh3Z78-0C1rx6s6cPdLfQpeIZQxI2UbV91bmjeRj2Hw3Tk2kAbVDmwnHl7Sn5aJveARuWQIDx44XrHPacMCyz2bDUDhlbwD8MhWsU	2025-09-14 19:47:39.686472	2025-09-15 21:47:38.937
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, username, full_name, hashed_password, two_factor_enabled, two_factor_mandatory, created_at, updated_at) FROM stdin;
1	mikethompson@gmail.com	mike.thompson	Michael Thompson	$argon2id$v=19$m=65536,t=3,p=4$CtXtSdWUEbpFeEzHD2TSkw$fwHgGq5BzJIZQvRTFdfBSHw62hKLyDh6Vv34lunC/mQ	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
3	davidchen@yahoo.com	david.chen	David Chen	$argon2id$v=19$m=65536,t=3,p=4$xxMkyn26SrCK++WRU/SeLw$U3RHMiAfkrvOs7F+qpomQqV36xBxvDEcH92t9vV3lzA	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
4	emily.rodriguez@hotmail.com	emily_rod	Emily Rodriguez	$argon2id$v=19$m=65536,t=3,p=4$WgZJKyPrpTPxXXBKa104yQ$HvpwekYgfpGy2wnek3YUwNCD8Phnl28Q0N1NuTPOT3I	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
5	james.anderson@company.com	j.anderson	James Anderson	$argon2id$v=19$m=65536,t=3,p=4$rPqc8COSJhD5+f2dM/eYeQ$3fc1MCiVw6rC6cT2YqNDmgqK09vqKij3rPOMdXSIdjg	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
6	lisamartinez@email.com	lisa.martinez	Lisa Martinez	$argon2id$v=19$m=65536,t=3,p=4$2ngtiB7Je8zceklXwEYtcQ$TJHV2D1Eb6cCoWYZhY5LKkihbHggIDpwV+hDVFBhJt0	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
8	a.foster@university.edu	amanda.foster	Amanda Foster	$argon2id$v=19$m=65536,t=3,p=4$1KRFczX/t7jm3L7XacvTzA$x4EluNWLkLb9+h+pKmnlLHdBT+Jir8dNYp+8Dj3bfW4	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
10	jessica.brown@tuks.co.za	jess_b.rown	Jessica Brown	$argon2id$v=19$m=65536,t=3,p=4$OUq2YI1E+4WutYW0QX35DQ$UZGHXicgj4kaBnM0ycOULiaHq11qg21ZQJizraggq/4	f	t	2025-08-19 14:32:54.840928	2025-08-19 14:32:54.840928
9	kevin.park@service.net	kevin_park	Kevin Park	$argon2id$v=19$m=65536,t=3,p=4$iC0NIxLTs8SkFB5w/aAowQ$BYgkLX7Cd+nPtKY3pkuqt0+SPEfOl1t21fmP6XHvM/M	f	t	2025-08-19 14:32:54.840928	2025-09-06 20:18:08.625964
2	s.williams@outlook.com	sarah_williams	Sarah Williams	$argon2id$v=19$m=65536,t=3,p=4$L3/zftunkHQ3X8a3JyjiOw$P5ecE1RSBIeU97/m9WQafHlGQDPRcyV6R9byhy/gECc	f	t	2025-08-19 14:32:54.840928	2025-09-11 11:05:09.933918
7	robert.j@domain.org	rob_johnson	Robert Johnson	$argon2id$v=19$m=65536,t=3,p=4$xvGB7oegERa5hGgFWqr0ZQ$mYgXYe3uIaUw4FSmeZS5Mwb6bWfOHCok58Ux9Icw0Do	f	t	2025-08-19 14:32:54.840928	2025-09-11 19:56:15.47413
\.


--
-- Data for Name: visual_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visual_assets (asset_id, user_id, asset_type, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-06-25 11:39:00
20211116045059	2025-06-25 11:39:02
20211116050929	2025-06-25 11:39:04
20211116051442	2025-06-25 11:39:06
20211116212300	2025-06-25 11:39:07
20211116213355	2025-06-25 11:39:09
20211116213934	2025-06-25 11:39:11
20211116214523	2025-06-25 11:39:13
20211122062447	2025-06-25 11:39:14
20211124070109	2025-06-25 11:39:16
20211202204204	2025-06-25 11:39:18
20211202204605	2025-06-25 11:39:19
20211210212804	2025-06-25 11:39:24
20211228014915	2025-06-25 11:39:26
20220107221237	2025-06-25 11:39:27
20220228202821	2025-06-25 11:39:29
20220312004840	2025-06-25 11:39:31
20220603231003	2025-06-25 11:39:33
20220603232444	2025-06-25 11:39:35
20220615214548	2025-06-25 11:39:37
20220712093339	2025-06-25 11:39:38
20220908172859	2025-06-25 11:39:40
20220916233421	2025-06-25 11:39:41
20230119133233	2025-06-25 11:39:43
20230128025114	2025-06-25 11:39:45
20230128025212	2025-06-25 11:39:47
20230227211149	2025-06-25 11:39:48
20230228184745	2025-06-25 11:39:50
20230308225145	2025-06-25 11:39:51
20230328144023	2025-06-25 11:39:53
20231018144023	2025-06-25 11:39:55
20231204144023	2025-06-25 11:39:57
20231204144024	2025-06-25 11:39:59
20231204144025	2025-06-25 11:40:01
20240108234812	2025-06-25 11:40:02
20240109165339	2025-06-25 11:40:04
20240227174441	2025-06-25 11:40:07
20240311171622	2025-06-25 11:40:09
20240321100241	2025-06-25 11:40:12
20240401105812	2025-06-25 11:40:17
20240418121054	2025-06-25 11:40:19
20240523004032	2025-06-25 11:40:25
20240618124746	2025-06-25 11:40:26
20240801235015	2025-06-25 11:40:28
20240805133720	2025-06-25 11:40:29
20240827160934	2025-06-25 11:40:31
20240919163303	2025-06-25 11:40:33
20240919163305	2025-06-25 11:40:35
20241019105805	2025-06-25 11:40:36
20241030150047	2025-06-25 11:40:42
20241108114728	2025-06-25 11:40:45
20241121104152	2025-06-25 11:40:46
20241130184212	2025-06-25 11:40:48
20241220035512	2025-06-25 11:40:50
20241220123912	2025-06-25 11:40:51
20241224161212	2025-06-25 11:40:53
20250107150512	2025-06-25 11:40:54
20250110162412	2025-06-25 11:40:56
20250123174212	2025-06-25 11:40:57
20250128220012	2025-06-25 11:40:59
20250506224012	2025-06-25 11:41:00
20250523164012	2025-06-25 11:41:02
20250714121412	2025-07-21 13:14:14
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-06-25 11:38:58.462062
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-06-25 11:38:58.472699
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-06-25 11:38:58.477606
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-06-25 11:38:58.498061
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-06-25 11:38:58.52229
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-06-25 11:38:58.527224
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-06-25 11:38:58.532555
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-06-25 11:38:58.538245
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-06-25 11:38:58.544108
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-06-25 11:38:58.54974
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-06-25 11:38:58.555117
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-06-25 11:38:58.56219
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-06-25 11:38:58.571248
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-06-25 11:38:58.581888
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-06-25 11:38:58.592281
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-06-25 11:38:58.624594
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-06-25 11:38:58.629924
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-06-25 11:38:58.635155
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-06-25 11:38:58.64107
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-06-25 11:38:58.64799
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-06-25 11:38:58.653459
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-06-25 11:38:58.665155
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-06-25 11:38:58.696249
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-06-25 11:38:58.725245
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-06-25 11:38:58.730689
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-06-25 11:38:58.737443
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-08-25 16:22:06.414694
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-08-25 16:22:06.925382
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-08-25 16:22:07.11321
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-08-25 16:22:07.31714
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-08-25 16:22:07.611724
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-08-25 16:22:08.809673
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-08-25 16:22:09.314046
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-08-25 16:22:09.724288
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-08-25 16:22:10.1213
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-08-25 16:22:10.826902
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-08-25 16:22:11.111894
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-25 16:22:11.41183
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-08-25 16:22:12.056287
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_account_id_seq', 26, true);


--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.achievements_achievement_id_seq', 1, false);


--
-- Name: ai_scores_score_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ai_scores_score_id_seq', 1, false);


--
-- Name: ar_scene_state_scene_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ar_scene_state_scene_id_seq', 1, false);


--
-- Name: avatar_images_avatar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avatar_images_avatar_id_seq', 12, true);


--
-- Name: badges_badge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.badges_badge_id_seq', 27, true);


--
-- Name: banner_images_banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.banner_images_banner_id_seq', 16, true);


--
-- Name: budget_categories_budget_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_categories_budget_category_id_seq', 25, true);


--
-- Name: budgets_budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budgets_budget_id_seq', 17, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 51, true);


--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challenges_challenge_id_seq', 11, true);


--
-- Name: communities_community_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.communities_community_id_seq', 6, true);


--
-- Name: custom_categories_custom_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.custom_categories_custom_category_id_seq', 13, true);


--
-- Name: goal_progress_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.goal_progress_progress_id_seq', 39, true);


--
-- Name: goals_goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.goals_goal_id_seq', 24, true);


--
-- Name: leaderboard_entries_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leaderboard_entries_entry_id_seq', 10, true);


--
-- Name: learning_modules_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.learning_modules_module_id_seq', 5, true);


--
-- Name: lessons_lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_lesson_id_seq', 25, true);


--
-- Name: module_banners_module_banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.module_banners_module_banner_id_seq', 5, true);


--
-- Name: point_rules_rule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.point_rules_rule_id_seq', 6, true);


--
-- Name: points_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.points_log_log_id_seq', 125, true);


--
-- Name: post_comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_comments_comment_id_seq', 24, true);


--
-- Name: quiz_attempts_attempt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_attempts_attempt_id_seq', 44, true);


--
-- Name: quizzes_quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quizzes_quiz_id_seq', 5, true);


--
-- Name: recurring_transactions_recurring_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recurring_transactions_recurring_id_seq', 201, true);


--
-- Name: social_posts_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_posts_post_id_seq', 15, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 1872, true);


--
-- Name: user_push_subscriptions_push_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_push_subscriptions_push_id_seq', 3, true);


--
-- Name: user_tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tokens_token_id_seq', 172, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 10, true);


--
-- Name: visual_assets_asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visual_assets_asset_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- Name: accounts accounts_user_id_account_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_account_name_key UNIQUE (user_id, account_name);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (achievement_id);


--
-- Name: ai_scores ai_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_scores
    ADD CONSTRAINT ai_scores_pkey PRIMARY KEY (score_id);


--
-- Name: ar_scene_state ar_scene_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ar_scene_state
    ADD CONSTRAINT ar_scene_state_pkey PRIMARY KEY (scene_id);


--
-- Name: ar_scene_state ar_scene_state_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ar_scene_state
    ADD CONSTRAINT ar_scene_state_user_id_key UNIQUE (user_id);


--
-- Name: avatar_images avatar_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_images
    ADD CONSTRAINT avatar_images_pkey PRIMARY KEY (avatar_id);


--
-- Name: badges badges_badge_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_badge_title_key UNIQUE (badge_title);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (badge_id);


--
-- Name: banner_images banner_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banner_images
    ADD CONSTRAINT banner_images_pkey PRIMARY KEY (banner_id);


--
-- Name: budget_categories budget_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_categories
    ADD CONSTRAINT budget_categories_pkey PRIMARY KEY (budget_category_id);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (budget_id);


--
-- Name: budgets budgets_user_id_budget_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_user_id_budget_name_key UNIQUE (user_id, budget_name);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: challenge_progress challenge_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_progress
    ADD CONSTRAINT challenge_progress_pkey PRIMARY KEY (challenge_id, user_id);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (challenge_id);


--
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (community_id);


--
-- Name: community_members community_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_pkey PRIMARY KEY (community_id, user_id);


--
-- Name: custom_categories custom_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_categories
    ADD CONSTRAINT custom_categories_pkey PRIMARY KEY (custom_category_id);


--
-- Name: custom_categories custom_categories_user_id_custom_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_categories
    ADD CONSTRAINT custom_categories_user_id_custom_category_name_key UNIQUE (user_id, custom_category_name);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (user_id, friend_id);


--
-- Name: goal_progress goal_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_progress
    ADD CONSTRAINT goal_progress_pkey PRIMARY KEY (progress_id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (goal_id);


--
-- Name: goals goals_user_id_goal_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_user_id_goal_name_key UNIQUE (user_id, goal_name);


--
-- Name: leaderboard_entries leaderboard_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaderboard_entries
    ADD CONSTRAINT leaderboard_entries_pkey PRIMARY KEY (entry_id);


--
-- Name: learning_modules learning_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learning_modules
    ADD CONSTRAINT learning_modules_pkey PRIMARY KEY (module_id);


--
-- Name: lessons lessons_module_id_lesson_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_lesson_number_key UNIQUE (module_id, lesson_number);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (lesson_id);


--
-- Name: module_banners module_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_banners
    ADD CONSTRAINT module_banners_pkey PRIMARY KEY (module_banner_id);


--
-- Name: point_rules point_rules_action_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_rules
    ADD CONSTRAINT point_rules_action_type_key UNIQUE (action_type);


--
-- Name: point_rules point_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_rules
    ADD CONSTRAINT point_rules_pkey PRIMARY KEY (rule_id);


--
-- Name: points_log points_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_log
    ADD CONSTRAINT points_log_pkey PRIMARY KEY (log_id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (comment_id);


--
-- Name: post_community_tags post_community_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_community_tags
    ADD CONSTRAINT post_community_tags_pkey PRIMARY KEY (post_id, community_id);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (post_id, user_id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (attempt_id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (quiz_id);


--
-- Name: recurring_transactions recurring_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_pkey PRIMARY KEY (recurring_id);


--
-- Name: recurring_transactions recurring_transactions_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_transaction_id_key UNIQUE (transaction_id);


--
-- Name: social_posts social_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts
    ADD CONSTRAINT social_posts_pkey PRIMARY KEY (post_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (user_id, achievement_id);


--
-- Name: user_lessons user_lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_lessons
    ADD CONSTRAINT user_lessons_pkey PRIMARY KEY (user_id, lesson_id);


--
-- Name: user_points user_points_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_points
    ADD CONSTRAINT user_points_pkey PRIMARY KEY (user_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id);


--
-- Name: user_push_subscriptions user_push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_push_subscriptions
    ADD CONSTRAINT user_push_subscriptions_pkey PRIMARY KEY (push_id);


--
-- Name: user_tokens user_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT user_tokens_pkey PRIMARY KEY (token_id);


--
-- Name: user_tokens user_tokens_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT user_tokens_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: visual_assets visual_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visual_assets
    ADD CONSTRAINT visual_assets_pkey PRIMARY KEY (asset_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_accounts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_accounts_user_id ON public.accounts USING btree (user_id);


--
-- Name: idx_accounts_user_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_accounts_user_type ON public.accounts USING btree (user_id, account_type);


--
-- Name: idx_achievements_trigger_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_achievements_trigger_condition ON public.achievements USING gin (trigger_condition_json);


--
-- Name: idx_budget_categories_budget_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budget_categories_budget_id ON public.budget_categories USING btree (budget_id);


--
-- Name: idx_budgets_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_user_id ON public.budgets USING btree (user_id);


--
-- Name: idx_challenge_progress_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_challenge_progress_status ON public.challenge_progress USING btree (challenge_id, participation_status);


--
-- Name: idx_challenges_community_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_challenges_community_status ON public.challenges USING btree (community_id, challenge_status);


--
-- Name: idx_custom_categories_user_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_custom_categories_user_name ON public.custom_categories USING btree (user_id, custom_category_name);


--
-- Name: idx_goal_progress_contributor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goal_progress_contributor_id ON public.goal_progress USING btree (contributor_id);


--
-- Name: idx_goal_progress_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goal_progress_date ON public.goal_progress USING btree (goal_id, progress_date DESC);


--
-- Name: idx_goal_progress_goal_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goal_progress_goal_id ON public.goal_progress USING btree (goal_id);


--
-- Name: idx_goals_goal_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goals_goal_status ON public.goals USING btree (goal_status);


--
-- Name: idx_goals_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goals_user_id ON public.goals USING btree (user_id);


--
-- Name: idx_goals_user_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goals_user_status ON public.goals USING btree (user_id, goal_status);


--
-- Name: idx_points_log_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_points_log_user_date ON public.points_log USING btree (user_id, created_at DESC);


--
-- Name: idx_quiz_attempts_quiz_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts USING btree (quiz_id);


--
-- Name: idx_quiz_attempts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts USING btree (user_id);


--
-- Name: idx_quiz_attempts_user_passed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_attempts_user_passed ON public.quiz_attempts USING btree (user_id, passed);


--
-- Name: idx_transactions_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_account_id ON public.transactions USING btree (account_id);


--
-- Name: idx_transactions_budget_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_budget_id ON public.transactions USING btree (budget_id);


--
-- Name: idx_transactions_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_category_id ON public.transactions USING btree (category_id);


--
-- Name: idx_transactions_custom_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_custom_category_id ON public.transactions USING btree (custom_category_id);


--
-- Name: idx_transactions_user_type_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_user_type_date ON public.transactions USING btree (transaction_type, transaction_date);


--
-- Name: idx_user_achievements_achievement_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements USING btree (achievement_id);


--
-- Name: idx_user_achievements_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_achievements_status ON public.user_achievements USING btree (user_id, achievement_status);


--
-- Name: idx_user_achievements_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);


--
-- Name: idx_user_points_tier_points; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_points_tier_points ON public.user_points USING btree (tier_status, total_points DESC);


--
-- Name: idx_user_preferences_ar_customizations; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_preferences_ar_customizations ON public.user_preferences USING gin (ar_customizations_jsonb);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: custom_categories check_duplicate_global_category; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_duplicate_global_category BEFORE INSERT OR UPDATE ON public.custom_categories FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_category();


--
-- Name: users set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_preferences set_user_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: goal_progress trg_adjust_goal_amount; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_adjust_goal_amount AFTER UPDATE ON public.goal_progress FOR EACH ROW EXECUTE FUNCTION public.adjust_goal_on_progress_update();


--
-- Name: challenges trg_auto_complete_challenge; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auto_complete_challenge AFTER UPDATE OF current_amount ON public.challenges FOR EACH ROW WHEN (((new.current_amount >= new.target_amount) AND ((new.challenge_status)::text = 'active'::text))) EXECUTE FUNCTION public.complete_challenge_if_met();


--
-- Name: challenges trg_auto_expire_challenge; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auto_expire_challenge AFTER UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.expire_challenge_if_overdue();


--
-- Name: goals trg_set_goal_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_set_goal_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_goal_updated_at_column();


--
-- Name: goal_progress trg_subtract_goal_amount; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_subtract_goal_amount AFTER DELETE ON public.goal_progress FOR EACH ROW EXECUTE FUNCTION public.subtract_goal_on_progress_delete();


--
-- Name: challenge_progress trg_update_challenge_progress_after_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_challenge_progress_after_change AFTER INSERT OR UPDATE ON public.challenge_progress FOR EACH ROW EXECUTE FUNCTION public.update_challenge_progress();


--
-- Name: challenge_progress trg_update_challenge_progress_after_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_challenge_progress_after_delete AFTER DELETE ON public.challenge_progress FOR EACH ROW EXECUTE FUNCTION public.update_challenge_progress();


--
-- Name: goal_progress trg_update_goal_amount; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_goal_amount AFTER INSERT ON public.goal_progress FOR EACH ROW EXECUTE FUNCTION public.update_goal_current_amount();


--
-- Name: user_points trg_update_tier_status; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_tier_status BEFORE INSERT OR UPDATE ON public.user_points FOR EACH ROW EXECUTE FUNCTION public.update_tier_status();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: achievements achievements_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(badge_id) ON DELETE RESTRICT;


--
-- Name: achievements achievements_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.achievements(achievement_id) ON DELETE CASCADE;


--
-- Name: ai_scores ai_scores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_scores
    ADD CONSTRAINT ai_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: ar_scene_state ar_scene_state_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ar_scene_state
    ADD CONSTRAINT ar_scene_state_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: budget_categories budget_categories_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_categories
    ADD CONSTRAINT budget_categories_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(budget_id) ON DELETE CASCADE;


--
-- Name: budget_categories budget_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_categories
    ADD CONSTRAINT budget_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: budget_categories budget_categories_custom_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_categories
    ADD CONSTRAINT budget_categories_custom_category_id_fkey FOREIGN KEY (custom_category_id) REFERENCES public.custom_categories(custom_category_id);


--
-- Name: budgets budgets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: challenge_progress challenge_progress_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_progress
    ADD CONSTRAINT challenge_progress_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(challenge_id) ON DELETE CASCADE;


--
-- Name: challenge_progress challenge_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_progress
    ADD CONSTRAINT challenge_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: challenges challenges_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.banner_images(banner_id) ON UPDATE CASCADE;


--
-- Name: challenges challenges_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: challenges challenges_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(community_id) ON DELETE CASCADE;


--
-- Name: challenges challenges_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: challenges challenges_custom_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_custom_category_id_fkey FOREIGN KEY (custom_category_id) REFERENCES public.custom_categories(custom_category_id);


--
-- Name: communities communities_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.banner_images(banner_id) ON UPDATE CASCADE;


--
-- Name: communities communities_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: community_members community_members_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(community_id) ON DELETE CASCADE;


--
-- Name: community_members community_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: custom_categories custom_categories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_categories
    ADD CONSTRAINT custom_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: friendships friendships_friend_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: friendships friendships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: goal_progress goal_progress_contributor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_progress
    ADD CONSTRAINT goal_progress_contributor_id_fkey FOREIGN KEY (contributor_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: goal_progress goal_progress_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_progress
    ADD CONSTRAINT goal_progress_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(goal_id) ON DELETE CASCADE;


--
-- Name: goals goals_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.banner_images(banner_id) ON UPDATE CASCADE;


--
-- Name: goals goals_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: goals goals_custom_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_custom_category_id_fkey FOREIGN KEY (custom_category_id) REFERENCES public.custom_categories(custom_category_id);


--
-- Name: goals goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: leaderboard_entries leaderboard_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaderboard_entries
    ADD CONSTRAINT leaderboard_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: learning_modules learning_modules_module_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learning_modules
    ADD CONSTRAINT learning_modules_module_banner_id_fkey FOREIGN KEY (module_banner_id) REFERENCES public.module_banners(module_banner_id) ON UPDATE CASCADE;


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.learning_modules(module_id) ON DELETE CASCADE;


--
-- Name: points_log points_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_log
    ADD CONSTRAINT points_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.social_posts(post_id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: post_community_tags post_community_tags_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_community_tags
    ADD CONSTRAINT post_community_tags_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(community_id) ON DELETE CASCADE;


--
-- Name: post_community_tags post_community_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_community_tags
    ADD CONSTRAINT post_community_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.social_posts(post_id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.social_posts(post_id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.learning_modules(module_id) ON DELETE CASCADE;


--
-- Name: recurring_transactions recurring_transactions_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id) ON DELETE CASCADE;


--
-- Name: social_posts social_posts_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts
    ADD CONSTRAINT social_posts_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(achievement_id) ON DELETE CASCADE;


--
-- Name: social_posts social_posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts
    ADD CONSTRAINT social_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(budget_id) ON DELETE SET NULL;


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: transactions transactions_custom_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_custom_category_id_fkey FOREIGN KEY (custom_category_id) REFERENCES public.custom_categories(custom_category_id) ON DELETE SET NULL;


--
-- Name: transactions transactions_linked_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_linked_challenge_id_fkey FOREIGN KEY (linked_challenge_id) REFERENCES public.challenges(challenge_id) ON DELETE SET NULL;


--
-- Name: transactions transactions_linked_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_linked_goal_id_fkey FOREIGN KEY (linked_goal_id) REFERENCES public.goals(goal_id) ON DELETE SET NULL;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(achievement_id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_lessons user_lessons_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_lessons
    ADD CONSTRAINT user_lessons_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(lesson_id) ON DELETE CASCADE;


--
-- Name: user_lessons user_lessons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_lessons
    ADD CONSTRAINT user_lessons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_points user_points_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_points
    ADD CONSTRAINT user_points_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_avatar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_avatar_id_fkey FOREIGN KEY (avatar_id) REFERENCES public.avatar_images(avatar_id) ON DELETE SET DEFAULT;


--
-- Name: user_preferences user_preferences_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.banner_images(banner_id) ON DELETE SET DEFAULT;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_push_subscriptions user_push_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_push_subscriptions
    ADD CONSTRAINT user_push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_tokens user_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT user_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: visual_assets visual_assets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visual_assets
    ADD CONSTRAINT visual_assets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
GRANT ALL ON FUNCTION auth.email() TO postgres;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
GRANT ALL ON FUNCTION auth.role() TO postgres;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
GRANT ALL ON FUNCTION auth.uid() TO postgres;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION adjust_goal_on_progress_update(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.adjust_goal_on_progress_update() TO anon;
GRANT ALL ON FUNCTION public.adjust_goal_on_progress_update() TO authenticated;
GRANT ALL ON FUNCTION public.adjust_goal_on_progress_update() TO service_role;


--
-- Name: FUNCTION calculate_goal_xp(goal_type text, target numeric, current numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_goal_xp(goal_type text, target numeric, current numeric) TO anon;
GRANT ALL ON FUNCTION public.calculate_goal_xp(goal_type text, target numeric, current numeric) TO authenticated;
GRANT ALL ON FUNCTION public.calculate_goal_xp(goal_type text, target numeric, current numeric) TO service_role;


--
-- Name: FUNCTION complete_challenge_if_met(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.complete_challenge_if_met() TO anon;
GRANT ALL ON FUNCTION public.complete_challenge_if_met() TO authenticated;
GRANT ALL ON FUNCTION public.complete_challenge_if_met() TO service_role;


--
-- Name: FUNCTION expire_challenge_if_overdue(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.expire_challenge_if_overdue() TO anon;
GRANT ALL ON FUNCTION public.expire_challenge_if_overdue() TO authenticated;
GRANT ALL ON FUNCTION public.expire_challenge_if_overdue() TO service_role;


--
-- Name: FUNCTION prevent_duplicate_category(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.prevent_duplicate_category() TO anon;
GRANT ALL ON FUNCTION public.prevent_duplicate_category() TO authenticated;
GRANT ALL ON FUNCTION public.prevent_duplicate_category() TO service_role;


--
-- Name: FUNCTION subtract_goal_on_progress_delete(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.subtract_goal_on_progress_delete() TO anon;
GRANT ALL ON FUNCTION public.subtract_goal_on_progress_delete() TO authenticated;
GRANT ALL ON FUNCTION public.subtract_goal_on_progress_delete() TO service_role;


--
-- Name: FUNCTION update_challenge_progress(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_challenge_progress() TO anon;
GRANT ALL ON FUNCTION public.update_challenge_progress() TO authenticated;
GRANT ALL ON FUNCTION public.update_challenge_progress() TO service_role;


--
-- Name: FUNCTION update_goal_current_amount(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_goal_current_amount() TO anon;
GRANT ALL ON FUNCTION public.update_goal_current_amount() TO authenticated;
GRANT ALL ON FUNCTION public.update_goal_current_amount() TO service_role;


--
-- Name: FUNCTION update_goal_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_goal_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_goal_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_goal_updated_at_column() TO service_role;


--
-- Name: FUNCTION update_tier_status(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_tier_status() TO anon;
GRANT ALL ON FUNCTION public.update_tier_status() TO authenticated;
GRANT ALL ON FUNCTION public.update_tier_status() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION can_insert_object(bucketid text, name text, owner uuid, metadata jsonb); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) TO postgres;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;


--
-- Name: FUNCTION list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) TO postgres;


--
-- Name: FUNCTION list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) TO postgres;


--
-- Name: FUNCTION operation(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.operation() TO postgres;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) TO postgres;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.update_updated_at_column() TO postgres;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accounts TO anon;
GRANT ALL ON TABLE public.accounts TO authenticated;
GRANT ALL ON TABLE public.accounts TO service_role;


--
-- Name: SEQUENCE accounts_account_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.accounts_account_id_seq TO anon;
GRANT ALL ON SEQUENCE public.accounts_account_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.accounts_account_id_seq TO service_role;


--
-- Name: TABLE achievements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.achievements TO anon;
GRANT ALL ON TABLE public.achievements TO authenticated;
GRANT ALL ON TABLE public.achievements TO service_role;


--
-- Name: SEQUENCE achievements_achievement_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.achievements_achievement_id_seq TO anon;
GRANT ALL ON SEQUENCE public.achievements_achievement_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.achievements_achievement_id_seq TO service_role;


--
-- Name: TABLE ai_scores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_scores TO anon;
GRANT ALL ON TABLE public.ai_scores TO authenticated;
GRANT ALL ON TABLE public.ai_scores TO service_role;


--
-- Name: SEQUENCE ai_scores_score_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.ai_scores_score_id_seq TO anon;
GRANT ALL ON SEQUENCE public.ai_scores_score_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.ai_scores_score_id_seq TO service_role;


--
-- Name: TABLE ar_scene_state; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ar_scene_state TO anon;
GRANT ALL ON TABLE public.ar_scene_state TO authenticated;
GRANT ALL ON TABLE public.ar_scene_state TO service_role;


--
-- Name: SEQUENCE ar_scene_state_scene_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.ar_scene_state_scene_id_seq TO anon;
GRANT ALL ON SEQUENCE public.ar_scene_state_scene_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.ar_scene_state_scene_id_seq TO service_role;


--
-- Name: TABLE avatar_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.avatar_images TO anon;
GRANT ALL ON TABLE public.avatar_images TO authenticated;
GRANT ALL ON TABLE public.avatar_images TO service_role;


--
-- Name: SEQUENCE avatar_images_avatar_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.avatar_images_avatar_id_seq TO anon;
GRANT ALL ON SEQUENCE public.avatar_images_avatar_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.avatar_images_avatar_id_seq TO service_role;


--
-- Name: TABLE badges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.badges TO anon;
GRANT ALL ON TABLE public.badges TO authenticated;
GRANT ALL ON TABLE public.badges TO service_role;


--
-- Name: SEQUENCE badges_badge_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.badges_badge_id_seq TO anon;
GRANT ALL ON SEQUENCE public.badges_badge_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.badges_badge_id_seq TO service_role;


--
-- Name: TABLE banner_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.banner_images TO anon;
GRANT ALL ON TABLE public.banner_images TO authenticated;
GRANT ALL ON TABLE public.banner_images TO service_role;


--
-- Name: SEQUENCE banner_images_banner_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.banner_images_banner_id_seq TO anon;
GRANT ALL ON SEQUENCE public.banner_images_banner_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.banner_images_banner_id_seq TO service_role;


--
-- Name: TABLE budget_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.budget_categories TO anon;
GRANT ALL ON TABLE public.budget_categories TO authenticated;
GRANT ALL ON TABLE public.budget_categories TO service_role;


--
-- Name: SEQUENCE budget_categories_budget_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.budget_categories_budget_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.budget_categories_budget_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.budget_categories_budget_category_id_seq TO service_role;


--
-- Name: TABLE budgets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.budgets TO anon;
GRANT ALL ON TABLE public.budgets TO authenticated;
GRANT ALL ON TABLE public.budgets TO service_role;


--
-- Name: SEQUENCE budgets_budget_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.budgets_budget_id_seq TO anon;
GRANT ALL ON SEQUENCE public.budgets_budget_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.budgets_budget_id_seq TO service_role;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categories TO anon;
GRANT ALL ON TABLE public.categories TO authenticated;
GRANT ALL ON TABLE public.categories TO service_role;


--
-- Name: SEQUENCE categories_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categories_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.categories_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.categories_category_id_seq TO service_role;


--
-- Name: TABLE challenge_progress; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.challenge_progress TO anon;
GRANT ALL ON TABLE public.challenge_progress TO authenticated;
GRANT ALL ON TABLE public.challenge_progress TO service_role;


--
-- Name: TABLE challenges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.challenges TO anon;
GRANT ALL ON TABLE public.challenges TO authenticated;
GRANT ALL ON TABLE public.challenges TO service_role;


--
-- Name: SEQUENCE challenges_challenge_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.challenges_challenge_id_seq TO anon;
GRANT ALL ON SEQUENCE public.challenges_challenge_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.challenges_challenge_id_seq TO service_role;


--
-- Name: TABLE communities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.communities TO anon;
GRANT ALL ON TABLE public.communities TO authenticated;
GRANT ALL ON TABLE public.communities TO service_role;


--
-- Name: SEQUENCE communities_community_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.communities_community_id_seq TO anon;
GRANT ALL ON SEQUENCE public.communities_community_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.communities_community_id_seq TO service_role;


--
-- Name: TABLE community_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.community_members TO anon;
GRANT ALL ON TABLE public.community_members TO authenticated;
GRANT ALL ON TABLE public.community_members TO service_role;


--
-- Name: TABLE custom_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.custom_categories TO anon;
GRANT ALL ON TABLE public.custom_categories TO authenticated;
GRANT ALL ON TABLE public.custom_categories TO service_role;


--
-- Name: SEQUENCE custom_categories_custom_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.custom_categories_custom_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.custom_categories_custom_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.custom_categories_custom_category_id_seq TO service_role;


--
-- Name: TABLE friendships; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.friendships TO anon;
GRANT ALL ON TABLE public.friendships TO authenticated;
GRANT ALL ON TABLE public.friendships TO service_role;


--
-- Name: TABLE goal_progress; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.goal_progress TO anon;
GRANT ALL ON TABLE public.goal_progress TO authenticated;
GRANT ALL ON TABLE public.goal_progress TO service_role;


--
-- Name: SEQUENCE goal_progress_progress_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.goal_progress_progress_id_seq TO anon;
GRANT ALL ON SEQUENCE public.goal_progress_progress_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.goal_progress_progress_id_seq TO service_role;


--
-- Name: TABLE goals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.goals TO anon;
GRANT ALL ON TABLE public.goals TO authenticated;
GRANT ALL ON TABLE public.goals TO service_role;


--
-- Name: SEQUENCE goals_goal_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.goals_goal_id_seq TO anon;
GRANT ALL ON SEQUENCE public.goals_goal_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.goals_goal_id_seq TO service_role;


--
-- Name: TABLE leaderboard_entries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leaderboard_entries TO anon;
GRANT ALL ON TABLE public.leaderboard_entries TO authenticated;
GRANT ALL ON TABLE public.leaderboard_entries TO service_role;


--
-- Name: SEQUENCE leaderboard_entries_entry_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.leaderboard_entries_entry_id_seq TO anon;
GRANT ALL ON SEQUENCE public.leaderboard_entries_entry_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.leaderboard_entries_entry_id_seq TO service_role;


--
-- Name: TABLE learning_modules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.learning_modules TO anon;
GRANT ALL ON TABLE public.learning_modules TO authenticated;
GRANT ALL ON TABLE public.learning_modules TO service_role;


--
-- Name: SEQUENCE learning_modules_module_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.learning_modules_module_id_seq TO anon;
GRANT ALL ON SEQUENCE public.learning_modules_module_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.learning_modules_module_id_seq TO service_role;


--
-- Name: TABLE lessons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lessons TO anon;
GRANT ALL ON TABLE public.lessons TO authenticated;
GRANT ALL ON TABLE public.lessons TO service_role;


--
-- Name: SEQUENCE lessons_lesson_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lessons_lesson_id_seq TO anon;
GRANT ALL ON SEQUENCE public.lessons_lesson_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.lessons_lesson_id_seq TO service_role;


--
-- Name: TABLE module_banners; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.module_banners TO anon;
GRANT ALL ON TABLE public.module_banners TO authenticated;
GRANT ALL ON TABLE public.module_banners TO service_role;


--
-- Name: SEQUENCE module_banners_module_banner_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.module_banners_module_banner_id_seq TO anon;
GRANT ALL ON SEQUENCE public.module_banners_module_banner_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.module_banners_module_banner_id_seq TO service_role;


--
-- Name: TABLE point_rules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.point_rules TO anon;
GRANT ALL ON TABLE public.point_rules TO authenticated;
GRANT ALL ON TABLE public.point_rules TO service_role;


--
-- Name: SEQUENCE point_rules_rule_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.point_rules_rule_id_seq TO anon;
GRANT ALL ON SEQUENCE public.point_rules_rule_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.point_rules_rule_id_seq TO service_role;


--
-- Name: TABLE points_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.points_log TO anon;
GRANT ALL ON TABLE public.points_log TO authenticated;
GRANT ALL ON TABLE public.points_log TO service_role;


--
-- Name: SEQUENCE points_log_log_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.points_log_log_id_seq TO anon;
GRANT ALL ON SEQUENCE public.points_log_log_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.points_log_log_id_seq TO service_role;


--
-- Name: TABLE post_comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_comments TO anon;
GRANT ALL ON TABLE public.post_comments TO authenticated;
GRANT ALL ON TABLE public.post_comments TO service_role;


--
-- Name: SEQUENCE post_comments_comment_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.post_comments_comment_id_seq TO anon;
GRANT ALL ON SEQUENCE public.post_comments_comment_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.post_comments_comment_id_seq TO service_role;


--
-- Name: TABLE post_community_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_community_tags TO anon;
GRANT ALL ON TABLE public.post_community_tags TO authenticated;
GRANT ALL ON TABLE public.post_community_tags TO service_role;


--
-- Name: TABLE post_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_likes TO anon;
GRANT ALL ON TABLE public.post_likes TO authenticated;
GRANT ALL ON TABLE public.post_likes TO service_role;


--
-- Name: TABLE quiz_attempts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quiz_attempts TO anon;
GRANT ALL ON TABLE public.quiz_attempts TO authenticated;
GRANT ALL ON TABLE public.quiz_attempts TO service_role;


--
-- Name: SEQUENCE quiz_attempts_attempt_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.quiz_attempts_attempt_id_seq TO anon;
GRANT ALL ON SEQUENCE public.quiz_attempts_attempt_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.quiz_attempts_attempt_id_seq TO service_role;


--
-- Name: TABLE quizzes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quizzes TO anon;
GRANT ALL ON TABLE public.quizzes TO authenticated;
GRANT ALL ON TABLE public.quizzes TO service_role;


--
-- Name: SEQUENCE quizzes_quiz_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.quizzes_quiz_id_seq TO anon;
GRANT ALL ON SEQUENCE public.quizzes_quiz_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.quizzes_quiz_id_seq TO service_role;


--
-- Name: TABLE recurring_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recurring_transactions TO anon;
GRANT ALL ON TABLE public.recurring_transactions TO authenticated;
GRANT ALL ON TABLE public.recurring_transactions TO service_role;


--
-- Name: SEQUENCE recurring_transactions_recurring_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.recurring_transactions_recurring_id_seq TO anon;
GRANT ALL ON SEQUENCE public.recurring_transactions_recurring_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.recurring_transactions_recurring_id_seq TO service_role;


--
-- Name: TABLE social_posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.social_posts TO anon;
GRANT ALL ON TABLE public.social_posts TO authenticated;
GRANT ALL ON TABLE public.social_posts TO service_role;


--
-- Name: SEQUENCE social_posts_post_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.social_posts_post_id_seq TO anon;
GRANT ALL ON SEQUENCE public.social_posts_post_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.social_posts_post_id_seq TO service_role;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO anon;
GRANT ALL ON TABLE public.transactions TO authenticated;
GRANT ALL ON TABLE public.transactions TO service_role;


--
-- Name: SEQUENCE transactions_transaction_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transactions_transaction_id_seq TO anon;
GRANT ALL ON SEQUENCE public.transactions_transaction_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.transactions_transaction_id_seq TO service_role;


--
-- Name: TABLE user_achievements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_achievements TO anon;
GRANT ALL ON TABLE public.user_achievements TO authenticated;
GRANT ALL ON TABLE public.user_achievements TO service_role;


--
-- Name: TABLE user_lessons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_lessons TO anon;
GRANT ALL ON TABLE public.user_lessons TO authenticated;
GRANT ALL ON TABLE public.user_lessons TO service_role;


--
-- Name: TABLE user_points; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_points TO anon;
GRANT ALL ON TABLE public.user_points TO authenticated;
GRANT ALL ON TABLE public.user_points TO service_role;


--
-- Name: TABLE user_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_preferences TO anon;
GRANT ALL ON TABLE public.user_preferences TO authenticated;
GRANT ALL ON TABLE public.user_preferences TO service_role;


--
-- Name: TABLE user_push_subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_push_subscriptions TO anon;
GRANT ALL ON TABLE public.user_push_subscriptions TO authenticated;
GRANT ALL ON TABLE public.user_push_subscriptions TO service_role;


--
-- Name: SEQUENCE user_push_subscriptions_push_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_push_subscriptions_push_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_push_subscriptions_push_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_push_subscriptions_push_id_seq TO service_role;


--
-- Name: TABLE user_tokens; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_tokens TO anon;
GRANT ALL ON TABLE public.user_tokens TO authenticated;
GRANT ALL ON TABLE public.user_tokens TO service_role;


--
-- Name: SEQUENCE user_tokens_token_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_tokens_token_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_tokens_token_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_tokens_token_id_seq TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: SEQUENCE users_user_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_user_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_user_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_user_id_seq TO service_role;


--
-- Name: TABLE visual_assets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visual_assets TO anon;
GRANT ALL ON TABLE public.visual_assets TO authenticated;
GRANT ALL ON TABLE public.visual_assets TO service_role;


--
-- Name: SEQUENCE visual_assets_asset_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.visual_assets_asset_id_seq TO anon;
GRANT ALL ON SEQUENCE public.visual_assets_asset_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.visual_assets_asset_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;
GRANT ALL ON TABLE storage.s3_multipart_uploads TO postgres;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;
GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO postgres;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

