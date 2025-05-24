#!/bin/bash

# Load environment variables from .env
set -a
source .env
set +a

# WSL PostgreSQL Setup Script for Ubuntu + pgAdmin Access

echo "🔧 Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "📦 Installing PostgreSQL and client tools..."
sudo apt install -y postgresql postgresql-contrib postgresql-client

echo "🚀 Enabling PostgreSQL service to start automatically..."
sudo service postgresql enable

echo "▶️ Starting PostgreSQL service..."
sudo service postgresql start

echo "👤 Creating default PostgreSQL user and database..."
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")
if [ "$DB_EXISTS" != "1" ]; then
  echo "📦 Creating database ${DB_NAME}..."
  sudo -u postgres createdb "${DB_NAME}"
else
  echo "Database ${DB_NAME} already exists."
fi
sudo -u postgres psql <<EOF

DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
      CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   END IF;
END
\$do\$;

GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" TO ${DB_USER};
EOF

echo "🛡️ Configuring PostgreSQL for external access (for pgAdmin use)..."
PG_CONF_PATH=$(find /etc/postgresql -name postgresql.conf | head -n 1)
HBA_CONF_PATH=$(find /etc/postgresql -name pg_hba.conf | head -n 1)

if [ -f "$PG_CONF_PATH" ]; then
  sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONF_PATH"
fi

if [ -f "$HBA_CONF_PATH" ]; then
  echo "host all all 0.0.0.0/0 md5" | sudo tee -a "$HBA_CONF_PATH"
fi

echo "🔁 Restarting PostgreSQL with updated config..."
sudo service postgresql restart

echo "📥 Loading schema into the database..."
sudo -u postgres psql -d "${DB_NAME}" -f schema_dump_v1.sql

echo ""
echo "✅ SETUP COMPLETE:"
echo "   - CLI Tool: psql"
echo "   - GUI Tool: pgAdmin (use from Windows)"
echo "   - Superuser: postgres (default)"
echo "   - Created DB: ${DB_NAME}"
echo "   - Developer user: ${DB_USER} / [hidden]"
echo "   - Port: 5432 (ensure WSL is accessible)"
echo ""
echo "💡 Tip: Open pgAdmin on Windows and connect to localhost:5432"
