#!/bin/bash

# WSL PostgreSQL Setup Script for Ubuntu + pgAdmin Access

echo "🔧 Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "📦 Installing PostgreSQL and client tools..."
sudo apt install -y postgresql postgresql-contrib postgresql-client

echo "🚀 Enabling PostgreSQL service to start automatically..."
sudo systemctl enable postgresql

echo "▶️ Starting PostgreSQL service..."
sudo systemctl start postgresql

echo "👤 Creating default PostgreSQL user and database..."
sudo -u postgres psql <<EOF
CREATE DATABASE "GamifiedFinanceDB";
CREATE USER devuser WITH PASSWORD 'devpassword';
GRANT ALL PRIVILEGES ON DATABASE "GamifiedFinanceDB" TO devuser;
EOF

echo "🛡️ Configuring PostgreSQL for external access (for pgAdmin use)..."
PG_VERSION=$(psql -V | awk '{print $3}' | cut -d. -f1,2)
PG_CONF_DIR="/etc/postgresql/$PG_VERSION/main"

sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" $PG_CONF_DIR/postgresql.conf
echo "host all all 0.0.0.0/0 md5" | sudo tee -a $PG_CONF_DIR/pg_hba.conf

echo "🔁 Restarting PostgreSQL with updated config..."
sudo systemctl restart postgresql

echo ""
echo "✅ SETUP COMPLETE:"
echo "   - CLI Tool: psql"
echo "   - GUI Tool: pgAdmin (use from Windows)"
echo "   - Superuser: postgres (default)"
echo "   - Created DB: GamifiedFinanceDB"
echo "   - Developer user: devuser / devpassword"
echo "   - Port: 5432 (ensure WSL is accessible)"
echo ""
echo "💡 Tip: Open pgAdmin on Windows and connect to localhost:5432"
