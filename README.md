### Installation

```bash
# With SSH
$ git clone https://github.com/kevinefraim/movies-manager.git

# With HTTPS
$ git clone https://github.com/kevinefraim/movies-manager.git

$ cd movies-manager

$ npm install

$ Rename .env.example to .env

```

### Setting up database

```bash
# Must have docker-compose
$ npm run db:up

# For development (also, do this every time a change on the schema is made)
$ npm run migrate
$ npm run generate
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

### Api endpoints

Replace localhost by app url

```bash
POST http://localhost:3001/api/auth/login
```

- Login
- Payload (use this credentials for logging in with admin user):

```
{
    "username": "kevinadmin",
    "password": "kevin1234"
}
```

```bash
POST http://localhost:3001/api/auth/register
```

- Register
- Payload (regular user by default)

```
{
    "name": "Kevin",
    "username": "kevinefraim",
    "password": "kevin1234"
}
```

```bash
GET http://localhost:3001/api/auth/movies/:id
```

- Get movie by ud
- Regular user only

```bash
GET http://localhost:3001/api/auth/movies
```

- Get all movies

```bash
Post http://localhost:3001/api/auth/movies
```

- Create movie with eposide id, based in the star wars API
- Admin user only
- Payload (1 to 6 episodeId)

```
{
    "episodeId": 5
}
```

```bash
Post http://localhost:3001/api/auth/movies/new
```

- Create a new movie
- Admin user only
- Can't send an existing episode id (from star wars api and from this app)
- Paylaod

```
{
    "episodeId": 11,
    "title": "new movie",
    "director": "director",
    "producer": "producer",
    "releaseDate": "1998-10-02",
    "openingCrawl": "dummy text for crawl"
}
```

```bash
Put http://localhost:3001/api/auth/movies/:id
```

- Update a movie by id
- Admin user only
- Can't send an existing episode id (from star wars api and from this app)
- Paylaod

```
{
    "episodeId": 22,
    "title": "updated movie",
    "director": "updated director",
}
```

```bash
Delete http://localhost:3001/api/auth/movies/:id
```

- Delete a movie by id
- Admin user only
