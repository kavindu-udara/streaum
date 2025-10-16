#!/bin/bash
# wait-for-db.sh

set -e

host="database"
port="3306"

until nc -z $host $port; do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is ready - starting application"
exec "$@"