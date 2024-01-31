# Notes Frontend

Prerequisites:
- be sure you have nodejs installed

## Install

First, create an `.env.local` file with the following variables:

```
# For both dev, stage and prod
VITE_BASE_URL="http://127.0.0.1:5173";
VITE_BACKEND_URL="http://127.0.0.1:8000/v1";
VITE_JWT_MAX_AGE="10000";
# For dev only (this is temporary)
USERNAME="berenger";
PASSWORD="berenger";
```

Run `npm i` to install the packages.

## Run

`npm run dev` will launch a dev server available at [http://127.0.0.1:3000](http://127.0.0.1:3000).