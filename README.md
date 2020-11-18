<img src="/pictures/icon.png?raw=true" align="right" title="Snacraft Logo" width="120">

# Snacraft Client
[![License: MIT](https://img.shields.io/badge/license-Apache%202-blue.svg?style=flat)](https://opensource.org/licenses/Apache-2.0) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dhiogoboza/snacraft-client/issues)

This project is the client side source from Snacraft game. This game is a classical snake multiplayer game. It is available in the [web](http://snacraft.appspot.com/) and [Google Play](https://play.google.com/store/apps/details?id=io.snacraft.game).

## Dependencies

- npm
- python
- google-cloud-sdk [optional]

### Install NPM dependencies

After installing `npm`, install dependencies:

`npm install`

## Running locally

### Using google-cloud-sdk

```
dev_appserver.py dev-app.yaml --admin_port 9090
```

This command starts development server at [localhost:8080](localhost:8080).

### Using python 

It is also possible to use any other http server.

`python3 -m http.server`

Open the localhost URL with parameter `server`, for example:

```
http://localhost:8000?server=secret-reaches-61045.herokuapp.com
```

## Deployment

### Generate distribution files

`npm run build`

This command generates distribution files at `dist` folder.

### Deploy to App Engine

`gcloud app deploy app.yaml --project <PROJECT_ID>`

## Pictures

<img src="/pictures/screenshot01.png?raw=true">
<img src="/pictures/screenshot02.png?raw=true">
<img src="/pictures/screenshot03.png?raw=true">
