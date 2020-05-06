# ![Bazar App](logo.png) (***An online shoping platform***)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# Overview
Bazar is an applicaton that allows users to buy from, sell to and chat with others locally.\
With Bazar, you snap a picture of the item to sell and list it quickly.
Buyers, on the other hand, can view your listing on the app and request it for purchase.

Find the best offers online on secondhand items that you actually need, and make the best offers to sell your used items and earn money!


# App features
* View all the products in one place.
* Quickly search the exact item wihout wasting any time.
* Know already how far is the listed item.
* Contact the seller via chat if intersted.
* List items you want to sell.
* Manage your sales and track listing.


# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [graphql](https://github.com/graphql/graphql-js) - To load data from a server to a client with a single call. Includes [express-graphql](https://github.com/graphql/express-graphql) a graphql HTTP server midleware and [graphql-upload](https://github.com/graphql/graphql-js) middleware and an Upload scalar to add support for GraphQL multipart requests (file uploads via queries and mutations)
- [socket.io](https://socket.io/) - For real time communication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication
- [sharp](https://github.com/lovell/sharp) - For convert large images in common formats to smaller, web-friendly JPEG, PNG and WebP images of varying dimensions



## Application Structure

- `server.js` - The entry point to the application. This file also defines our express server.
- `schema/` - This folder contains graphql queries for the API and data types.
- `db/database.js` - File deals with Connecting the app to MongoDB using mongoose. 
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `controllers/`- This folder Handling authentication and asign JWT.
- `utils/pass.js` - This file contains configuration for passport.


# Requirements

For development and production, you will need Node.js and npm, installed in your environement. Additionally, setup MongoDB database for databse storage.

### Node
- #### Node installation

  Just go on [official Node.js website](https://nodejs.org/) and download the installer or use your linux distro specific package manager to download it.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version
    

###


### MongoDB
- #### MongoDB installation
 [Install](https://docs.mongodb.com/manual/administration/install-community/)

# Getting started

### Clone

To get the Node server running locally.

```sh
git clone git@gitlab.com:utsabk/bazar.git
cd Bazar
```

### Set up the local environment
Create a new file named `.env` with this environment variables.

   For example:
```
DB_URL= this is a URL to connect to mariadb databse 
e.g mongodb://<username>:<password>@localhost/<database-name>
SECRET_KEY= your secret JWT key
HTTP_PORT= set up which port the server need to listen e.g 3000
```

After that run this command on project path

```sh
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/) or which ever port you set on .env file.
###
---

