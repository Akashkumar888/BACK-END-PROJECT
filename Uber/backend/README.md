# User Registration & Login API Documentation

## Endpoints

- `POST /api/user/register` — Register a new user
- `POST /api/user/login` — Login an existing user
- `GET /api/user/profile` — Get the authenticated user's profile
- `GET /api/user/logout` — Logout the user (JWT blacklist)

---

## 1. Register User

### Endpoint

`POST /api/user/register`

### Description

This endpoint allows a new user to register by providing their first name, last name, email, and password. The password is securely hashed before storing in the database. On successful registration, a JWT authentication token is returned along with the user data.

### Request Body

```json
{
  "fullName": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `fullName.firstname` (string, required): Minimum 3 characters.
- `fullName.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address, minimum 5 characters.
- `password` (string, required): Minimum 6 characters.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "sucess": true,
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullName": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null,
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>",
      "__v": 0
    }
  }
  ```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "First name must be at least 3 characters long",
        "param": "fullName.firstname",
        "location": "body"
      }
    ]
  }
  ```

#### Other Errors

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

### Example Request

```bash
curl -X POST http://localhost:5000/api/user/register \
-H "Content-Type: application/json" \
-d '{
  "fullName": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}'
```

---

## 2. Login User

### Endpoint

`POST /api/user/login`

### Description

This endpoint allows an existing user to log in using their email and password. On successful authentication, a JWT token and user data are returned. The token is also set as a cookie.

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "message": "login Successfully.",
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullName": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null,
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>",
      "__v": 0
    }
  }
  ```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "success": false,
    "errors": [
      {
        "msg": "Invalid email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

#### Invalid Credentials

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Invalid credentials."
  }
  ```

#### Other Errors

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

### Example Request

```bash
curl -X POST http://localhost:5000/api/user/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}'
```

---

## 3. Get User Profile

### Endpoint

`GET /api/user/profile`

### Description

Returns the authenticated user's profile information. Requires a valid JWT token in the `Authorization` header (`Bearer <token>`) or as a cookie.

### Headers

- `Authorization: Bearer <jwt_token>` (or use the `token` cookie)

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "user": {
      "_id": "<user_id>",
      "fullName": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null,
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>",
      "__v": 0
    }
  }
  ```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "success": false,
    "message": "No token provided."
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Invalid or expired token."
  }
  ```

### Example Request

```bash
curl -X GET http://localhost:5000/api/user/profile \
-H "Authorization: Bearer <jwt_token>"
```

---

## 4. Logout User

### Endpoint

`GET /api/user/logout`

### Description

Logs out the authenticated user by blacklisting the current JWT token and clearing the cookie. Requires a valid JWT token in the `Authorization` header or as a cookie.

### Headers

- `Authorization: Bearer <jwt_token>` (or use the `token` cookie)

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "message": "Log out"
  }
  ```

#### Token Not Found

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Token not found"
  }
  ```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "success": false,
    "message": "No token provided."
  }
  ```

### Example Request

```bash
curl -X GET http://localhost:5000/api/user/logout \
-H "Authorization: Bearer <jwt_token>"
```