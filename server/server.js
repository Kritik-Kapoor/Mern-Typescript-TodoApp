const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const todosSchema = new Schema({
  email: { type: String, required: true },
  todo: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todosSchema);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    res.status(500);
    res.json({
      message: "Email already exists",
    });
    return;
  } else {
    await User.create({ username, email, password });
    res.json({
      message: "new user registered",
    });
    res.status(200);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (!exists || exists.password !== password) {
    res.status(500);
    res.json({
      message: "Invalid credentials",
    });
    return;
  }
  res.status(200);
  res.json({
    message: "Valid credentials",
  });
});

app.post("/addTodo", async (req, res) => {
  const { email, todo } = req.body;
  const newTodo = await Todo.create({ email, todo });
  if (newTodo) {
    res.status(200);
    res.json({
      message: "New todo added",
      data: {
        todo: newTodo.todo,
        id: newTodo._id,
      },
    });
  } else {
    res.status(500);
    res.json({
      message: "Failed to add todo",
    });
    return;
  }
});

app.listen(port, () => {
  console.log("listening on port 5173");
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todoTypescript");
  if (mongoose.connection.readyState) console.log("DB connected");
}

main().catch((err) => console.log(err));
