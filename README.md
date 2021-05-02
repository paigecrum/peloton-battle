# Peloton Battle App

This is a React/Express App that authenticates you to the Peloton API using your Peloton login credentials (which are not stored). It lists the rides you have taken in common with the people that you follow on Peloton, and you can select a ride and choose a friend to battle. Whoever has a higher output for that ride will be displayed as the winner of that battle.

## Development

Pull the repo and run `npm install` to install the dependencies. Please note the below configuration files needed to run the app.

To run the local dev server:
- For the Express app, cd into `/api` and run `npm run devStart` 
- For the React app, cd into `/ui` and run `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### Configuration

You will need the following config files in place to run the app.

For the React app (`/ui`), create a `.env` file:
```
REACT_APP_API_URL='/api'
```

For the Express app (`/api`), create a `.env` file:
```
SESSION_SECRET='yourDesiredSecret'
SESSION_MAX_AGE=1800000
```
