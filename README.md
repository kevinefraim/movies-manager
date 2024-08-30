### Swagger
Swagger Docs: http://localhost:3001/api/docs 

### Installation

```bash
# With SSH
$ git clone git@github.com:kevinefraim/movies-manager.git

# With HTTPS
$ git clone https://github.com/kevinefraim/movies-manager.git

$ cd movies-manager

$ npm install

# Rename .env.example to .env and configure your environment variables
$ mv .env.example .env

```

### Setting up database

```bash
# You must have Docker and Docker Compose installed

# Start the PostgreSQL database with Docker Compose
$ npm run db:up

# For development (also, do this every time a change on the schema is made)
$ npm run migrate
$ npm run generate
```

### Seeding the database

```bash
# To create the initial admin user, run the following seed command:
$ npm run seed:user
```

### Running the app

```bash
# Development
$ npm run dev

# Production
$ npm run build
$ npm run start:prod

# Prisma studio
$ npm run studio
```

### After login

- Get token from response
- Send it in Authorization header like: Bearer {{token}}
