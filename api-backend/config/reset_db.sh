#!/bin/bash
set -a
source "$(dirname "$0")/../.env"
set +a

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

echo "📥 Loading new schema..."
sudo -u postgres psql -d "$DB_NAME" -1 -f "$(dirname "$0")/../db/schema_dump_v2.sql"

echo "✅ Schema loaded successfully."
