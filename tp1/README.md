# Crear docker para Postgres

docker build -t chinook-postgres 

# Ejecutar docker para Postgres

docker run -d -p 5432:5432 --name chinook-db -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=chinook chinook-postgres