# Auth Module

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `DELETE /auth/users/:id`
- `PATCH /auth/users/:id/name`
- `PATCH /auth/users/:id/image`

## Request body rules

### Register

- `mobileNumber`: international format (for example `+923001234567`) or local format (for example `03074029959`)
- `password`: 8 to 128 characters
- `name`: 2 to 80 characters, trimmed

### Login

- `mobileNumber`: international format (for example `+923001234567`) or local format (for example `03074029959`)
- `password`: 4 to 128 characters

### Refresh

- `refreshToken`: minimum 10 characters

### Logout

- `refreshToken`: minimum 10 characters

### Update user image

- Requires bearer access token
- `multipart/form-data` body with an `image`, `file`, or `avatar` file field
- Allowed file types: `image/jpeg`, `image/png`
- Maximum file size: `5 MB`

### Update user name

- Requires bearer access token
- Users can only update their own name
- JSON body with a `name` field from 2 to 80 trimmed characters

### Delete user account

- Requires bearer access token
- Only active super admins can delete user accounts
- Super admins cannot delete their own account

## Behavior summary

- Register and login both return user data plus access/refresh tokens.
- Refresh validates and rotates refresh tokens.
- Logout revokes the provided refresh token when valid.
- Super admins can delete any other user account.
- User responses include a `profile` object.
- Public auth responses return managed user images as public upload URLs.
- User image uploads are stored locally from multipart file uploads.
- Login uses a rate limiter.
