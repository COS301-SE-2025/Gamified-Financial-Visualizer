#!/bin/bash
set -e

# Load environment variables from .env in the same folder
set -a
source "$(dirname "$0")/.env"
set +a

# Build connection string for Supabase (with SSL)
DB_URI="host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD sslmode=require"

echo "🚨 WARNING: This will DROP all tables and functions in your Supabase database!"
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "❌ Cancelled."
  exit 1
fi

# 1️⃣ Backup before dropping
BACKUP_FILE="$(dirname "$0")/backup_$(date +%Y%m%d_%H%M%S).sql"
echo "💾 Backing up current database to $BACKUP_FILE..."
pg_dump "$DB_URI" > "$BACKUP_FILE"

# 2️⃣ Drop functions
echo "🧹 Dropping existing functions..."
psql "$DB_URI" -v ON_ERROR_STOP=1 <<EOF
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

# 3️⃣ Drop all tables
echo "🗑️ Dropping all existing tables..."
psql "$DB_URI" -v ON_ERROR_STOP=1 <<EOF
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

# 4️⃣ Load schema
echo "📥 Loading new schema from schema_dump.sql..."
psql "$DB_URI" -v ON_ERROR_STOP=1 -1 -f "$(dirname "$0")/schema_dump.sql"

# 5️⃣ Load seed data
echo "📥 Loading seed data from seed.sql..."
psql "$DB_URI" -v ON_ERROR_STOP=1 -1 -f "$(dirname "$0")/seed.sql"

echo "✅ Database reset complete."
