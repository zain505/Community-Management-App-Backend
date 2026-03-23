# Auth Module

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `PATCH /auth/users/:id/image`

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

### Update user image

- Requires bearer access token
- JSON body with an `image` field containing a base64-encoded image string
- Allowed file types: `image/jpeg`, `image/png`
- Maximum file size: `5 MB`

## Behavior summary

- Register and login both return user data plus access/refresh tokens.
- Refresh validates and rotates refresh tokens.
- Logout revokes the provided refresh token when valid.
- User responses include a `profile` object.
- Public auth responses return managed user images as base64 data URLs.
- User image uploads are stored locally after the base64 payload is decoded.
- Login uses a rate limiter.
