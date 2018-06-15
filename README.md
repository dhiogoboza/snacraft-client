# snacraft

Snacraft is an IO game inspired on classic snake and Minecraft.

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
