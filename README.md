# DooDoop

The best music quiz.

## Build & Run locally (via Docker)

### Download Docker

You can find docker in various flavours here:

```
https://docs.docker.com/install/
```

Download the one for you and then follow the instructions.

### Create a local environment file

In order to run locally you will need a file named:

```
.env
```

in the root of the application directory. You may copy the file located at:

```
.env.example
```

and fill in the values.

### Build the containers

Using the following command:

```
docker-compose build
```

## Create, Recreate and Seed the database

On initial run, you're likely to need to create the database first. You can use recreate for this:

```
docker-compose run app sequelize db:create
docker-compose run app sequelize db:migrate
```

You may then want to seed a database with example data. To see the development database with base data, use:

```
docker-compose run app sequelize db:seed:all
```

### Run the containers

Using the following command:

```
docker-compose up
```

From there, follow the frontend instructions and you should be able to access the site.