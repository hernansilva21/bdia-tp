FROM postgres:15

# Set environment variables
ENV POSTGRES_USER=docker
ENV POSTGRES_PASSWORD=docker
ENV POSTGRES_DB=chinook

# Copy the SQL script to initialize the database
COPY 2.chinook_pg_serial_pk_proper_naming.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# The database will be initialized when the container starts