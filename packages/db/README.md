# @tt/db

This package using Prisma ORM and PostgreSQL hosted in Supabase. The model types
and a Prisma client are exported.

## Database

The database used in this project is PostgreSQL and hosted on Supabase. You can find the database schema and manage migrations using Prisma.

### Initial Setup

1. Create a custom user for Prisma in Supabase.

In a Supabase [SQL Editor](https://supabase.com/dashboard/project/_/sql/new), run the following SQL command, creating a Prisma DB user with full privillages on the public schema.

```sql
-- Create custom user
create user "prisma" with password 'custom_password' bypassrls createdb;

-- extend prisma's privileges to postgres (necessary to view changes in Dashboard)
grant "prisma" to "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant delete on all tables in schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

```sql
-- alter prisma password if needed
alter user "prisma" with password 'new_password';
```
