# Customer API Integration Example

This repository demonstrates one way in which to interact with the NPM Customer API, showcasing authentication flow and API request handling using Node.js.

## Features

- OAuth2-based authentication flow with access and refresh tokens
- Automatic token refresh when expired
- Persistent token storage in local JSON file
- Example API call to fetch queue entities

## Authentication Flow

The application implements a complete authentication cycle:
1. Initial login with username/password to obtain tokens
2. Token storage in a local file
3. Automatic token refresh when expired
4. Bearer token authentication for API requests

## Example Usage

The code demonstrates querying the `/entities/queues` endpoint, filtering for queue applications with an "Operational" status. It handles all the authentication complexity automatically, including:

- Loading existing tokens from disk
- Refreshing expired tokens
- Obtaining new tokens when needed
- Making authenticated API requests

## Setup

1. Ensure you have Node.js installed (>=v14)
2. Install dependencies:
```bash
npm install
```
3. Set up your environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
```bash
API_USERNAME=<your_npm_api_username>
API_PASSWORD=<your_npm_api_password>
```

4. Run the example:
```bash
npm start
```