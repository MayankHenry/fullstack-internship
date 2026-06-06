# Day 14 Hands-on Mini Project

## User Database Integration with MongoDB

This mini project shows how to connect your existing Day 13 User Management API to MongoDB using Mongoose.

### What to build

- Connect Express to a MongoDB database.
- Replace the in-memory `users` array with a MongoDB `users` collection.
- Keep the same CRUD routes, but load/save data from the database.
- Add MongoDB-powered query routes for active users and age filters.

### Setup

1. Install dependencies:

```bash
npm install express mongoose
```

2. Create `models/User.js` with a Mongoose schema:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: Number,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", userSchema);
```

3. In `server.js`, connect to MongoDB and import the model:

```js
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
```

### Routes to implement

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /users/active`
- `GET /users/age/:min`
- `GET /users/search/by-name?name=<name>`

### Example response shape

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "647de4f2c6452a3f4c6a4b1d",
      "name": "Rahul",
      "email": "rahul@example.com",
      "age": 22,
      "isActive": true
    }
  ]
}
```

### Notes

- Use `mongoose.Types.ObjectId.isValid(id)` before using `findById()`.
- Validate required fields and age ranges.
- If you want, use MongoDB Atlas and set `MONGODB_URI` before running the server.

### Run the project

```bash
npm start
```

Then open Postman or curl to test your routes.
