#!/bin/bash

# Load environment variables (e.g., DB_NAME from .env)
set -a
source "$(dirname "$0")/../.env"
set +a

# Drop custom functions first to avoid dependency errors
echo "🧹 Dropping existing functions..."
sudo -u postgres psql -d "$DB_NAME" <<EOF
DROP FUNCTION IF EXISTS adjust_goal_on_progress_update() CASCADE;
DROP FUNCTION IF EXISTS complete_challenge_if_met() CASCADE;
DROP FUNCTION IF EXISTS expire_challenge_if_overdue() CASCADE;
DROP FUNCTION IF EXISTS prevent_duplicate_category() CASCADE;
DROP FUNCTION IF EXISTS subtract_goal_on_progress_delete() CASCADE;
DROP FUNCTION IF EXISTS update_challenge_progress() CASCADE;
DROP FUNCTION IF EXISTS update_goal_current_amount() CASCADE;
DROP FUNCTION IF EXISTS update_goal_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS calculate_goal_xp() CASCADE;
DROP FUNCTION IF EXISTS update_tier_status() CASCADE;
EOF

# Drop all tables in the public schema
echo "🗑️ Dropping all existing tables..."
sudo -u postgres psql -d "$DB_NAME" <<EOF
DO \$\$
DECLARE
    r RECORD;
BEGIN
    EXECUTE 'SET session_replication_role = replica';
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    EXECUTE 'SET session_replication_role = DEFAULT';
END
\$\$;
EOF

# Apply schema
echo "📥 Loading new schema from schema_dump_v2.sql..."
sudo -u postgres psql -d "$DB_NAME" -1 -f "$(dirname "$0")/../db/schema_dump_v2.sql"

# Grant permissions to devuser
echo "🔐 Setting permissions for devuser..."
sudo -u postgres psql -d "$DB_NAME" <<EOF
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO devuser;

-- Grant access to all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO devuser;

-- Grant access to all sequences
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO devuser;

-- Automatically grant on future tables/sequences/functions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO devuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO devuser;
EOF

echo "✅ Database reset complete with schema and permissions loaded."
