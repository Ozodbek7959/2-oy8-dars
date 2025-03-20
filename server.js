const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());

// Ma'lumotlarni vaqtincha saqlash uchun massivlar
let users = [];
let posts = [];
let comments = [];

//1. User Registration 
app.post("/register", (req, res) => {
  const { email, password, confirmPassword, name, birthday, gender, phone } =
    req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match!" });
  }

  const newUser = {
    id: uuidv4(),
    email,
    password,
    name,
    birthday,
    gender,
    phone,
  };
  users.push(newUser);
  res
    .status(201)
    .json({ message: "User registered successfully!", user: newUser });
});

//2. User Login 
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password!" });
  }

  res.json({ message: "Login successful!", user });
});

// 3. Create a Post
app.post("/posts", (req, res) => {
  const { title, content, user_id } = req.body;
  const post = {
    id: uuidv4(),
    title,
    content,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    user_id,
  };
  posts.push(post);
  res.status(201).json({ message: "Post created successfully!", post });
});

//4. Get All Posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

//5. Create a Comment 
app.post("/comments", (req, res) => {
  const { content, post_id, user_id } = req.body;
  const comment = {
    id: uuidv4(),
    content,
    post_id,
    user_id,
    created_at: new Date().toISOString(),
  };
  comments.push(comment);
  res.status(201).json({ message: "Comment added!", comment });
});

//6. Get All Comments
app.get("/comments", (req, res) => {
  res.json(comments);
});

// 7. Get Users 
app.get("/users", (req, res) => {
  res.json(users);
});

// 8. Delete a Post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((post) => post.id !== id);
  res.json({ message: "Post deleted successfully!" });
});

//9. Delete a Comment
app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter((comment) => comment.id !== id);
  res.json({ message: "Comment deleted!" });
});

//10. Delete a User
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter((user) => user.id !== id);
  res.json({ message: "User deleted!" });
});

// Serverni ishga tushirish
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
