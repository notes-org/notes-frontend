# Notes Frontend

Prerequisites:
- be sure you have nodejs installed

## Install

First, create an `.env.local` file with the following variables:

```
# For both dev, stage and prod
VITE_BACKEND_URL=http://127.0.0.1:8000/v1
VITE_JWT_MAX_AGE=10000
```

Run `npm i` to install the packages.

## Run

`npm run dev` will launch a dev server available at [http://localhost:5173](http://localhost:5173).