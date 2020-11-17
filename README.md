<img src="/pictures/icon.png?raw=true" align="right" title="Snacraft Logo" width="120">

# Snacraft Client
[![License: MIT](https://img.shields.io/badge/license-Apache%202-blue.svg?style=flat)](https://opensource.org/licenses/Apache-2.0) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dhiogoboza/snacraft-client/issues)

This project is the client side source from Snacraft game. This game is a classical snake multiplayer game. It is available in the [web](http://classic-snakeio.appspot.com/) and [Google Play](https://play.google.com/store/apps/details?id=io.snacraft.game).

## Development

### Dependencies

- npm
- python
- google-cloud-sdk

#### Install NPM dependencies

After installing `npm`, install dependencies:

`npm install`

### Running locally

`dev_appserver.py dev-app.yaml --admin_port 9090`

This command starts development server at [localhost:8080](localhost:8080).

## Deployment

### Generate distribution files

`npm run build`

This command generates distribution files at `dist` folder.

### Deploy

`gcloud app deploy app.yaml --project <PROJECT_ID>`
