const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const listSchema = new Schema({
  user_id: { type: String, required: true },
  list: { type: Array, required: true },
});

const todosSchema = new Schema({
  user_id: { type: String, required: true },
  todos: { type: Array, required: true },
});

const User = mongoose.model("User", userSchema);
const List = mongoose.model("List", listSchema);
const Todo = mongoose.model("Todo", todosSchema);

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({
        message: "Email already exists",
      });
    } else {
      const newUser = await User.create({ username, email, password });
      if (newUser) {
        return res.status(200).json({
          name: username,
          id: newUser._id,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error at /register" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (!exists || exists.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return res.status(200).json({
      name: exists.username,
      id: exists._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at /login",
    });
  }
});

app.post("/create-list", async (req, res) => {
  try {
    const { id, list, list_id } = req.body;
    const listExists = await List.findOne({ user_id: id });
    if (listExists) {
      await List.findOneAndUpdate(
        { user_id: id },
        {
          $push: {
            list: {
              id: list_id,
              title: list,
              status: 0,
              todos: [],
            },
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "New List created",
        data: {
          id: list_id,
          title: list,
          status: 0,
          todos: [],
        },
      });
    } else {
      await List.create({
        user_id: id,
        list: {
          id: list_id,
          title: list,
          status: 0,
          todos: [],
        },
      });
      return res.status(200).json({
        message: "New todos field created",
        data: {
          id: list_id,
          title: list,
          status: 0,
          todos: [],
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error at /create-list" });
  }
});

app.post("/get-list", async (req, res) => {
  try {
    const { id } = req.body;
    const listExists = await List.findOne({ user_id: id });
    if (listExists) {
      return res.status(200).json({
        message: "List found",
        list: listExists.list,
      });
    }
    return res.status(200).json({
      message: "User has not created any lists",
      list: [],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error at /get-list" });
  }
});

app.delete("/delete-list/:id/:list_id", async (req, res) => {
  try {
    const { id, list_id } = req.params;
    const deleteList = await List.findOneAndUpdate(
      {
        user_id: id,
        "list.id": list_id,
      },
      {
        $pull: { list: { id: list_id } },
      },
      { new: true }
    );
    if (deleteList) {
      res.status(200).json({ message: "list deleted", data: deleteList.list });
      return;
    }
    res.status(404).json({ message: "Failed to delete list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error at /delete-list" });
  }
});

app.post("/add-todo", async (req, res) => {
  try {
    const { id, list_id, todo, todo_id } = req.body;
    const listExists = await List.findOne({ user_id: id });
    if (listExists) {
      await List.findOneAndUpdate(
        { "list.id": list_id },
        {
          $push: {
            "list.$.todos": {
              id: todo_id,
              todo,
              status: 0,
            },
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "New todo added",
        data: {
          id: todo_id,
          todo,
          status: 0,
        },
      });
    } else {
      return res.status(404).json({
        message: "Failed to add",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error at /add-todo" });
  }
});

app.post("/get-todos", async (req, res) => {
  try {
    const { id } = req.body;
    const fetchTodos = await List.findOne({ "list.id": id });
    if (fetchTodos) {
      const todos =
        fetchTodos.list.find((listItem) => listItem.id === id)?.todos || [];
      return res.status(200).json({
        todos,
        message: "Fetched todos",
      });
    } else {
      return res.status(404).json({
        todos: [],
        message: "List not found",
      });
    }
  } catch (error) {
    res.status(500);
    res.json({
      message: "Internal server error in get-todos",
    });
  }
});

//Not working

app.put("/mark-completed", async (req, res) => {
  try {
    const { id, todo_id } = req.body;
    const updateStatus = await List.findOneAndUpdate(
      { "list.id": id, "list.todos": { $elemMatch: { id: todo_id } } },
      {
        $set: {
          "list.$[outer].todos.$[inner].status": 1,
        },
      },
      {
        arrayFilters: [{ "outer.id": id }, { "inner.id": todo_id }],
        new: true,
      }
    );
    console.log(updateStatus);
    if (updateStatus) {
      return res.status(200).json({
        message: "todo status updated",
        data: updateStatus.todos,
      });
    }
    return res.status(404).json({
      message: "Failed to update todo status",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error at /mark-completed" });
  }
});

app.delete("/delete-todo/:id/:todo_id", async (req, res) => {
  try {
    const { id, todo_id } = req.params;
    const deleteTodo = await Todo.findOneAndUpdate(
      { user_id: id, "todos.id": todo_id },
      { $pull: { todos: { id: todo_id } } },
      { new: true }
    );
    if (deleteTodo) {
      return res.status(200).json({
        message: "todo deleted",
        data: deleteTodo.todos,
      });
    }
    return res.status(404).json({ message: "Failed to delete todo" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error at /delete-todo" });
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
