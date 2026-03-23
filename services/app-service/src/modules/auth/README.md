# Auth Module

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

## Request body rules

### Register

- `mobileNumber`: international format (for example `+923001234567`)
- `password`: 8 to 128 characters
- `name`: 2 to 80 characters, trimmed

### Login

- `mobileNumber`: international format (for example `+923001234567`)
- `password`: 8 to 128 characters

### Refresh

- `refreshToken`: minimum 10 characters

### Logout

- `refreshToken`: minimum 10 characters

## Behavior summary

- Register and login both return user data plus access/refresh tokens.
- Refresh validates and rotates refresh tokens.
- Logout revokes the provided refresh token when valid.
- Login uses a rate limiter.
