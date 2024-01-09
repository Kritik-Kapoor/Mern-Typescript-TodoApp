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
const { ObjectId } = require("mongodb");

const { Schema, Types, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const listSchema = new Schema({
  user_id: { type: Types.ObjectId, required: true, unique: true },
  list: [
    {
      title: String,
      status: Number,
      todos: [{ todo: String, status: Number }],
    },
  ],
});

const User = model("User", userSchema);
const List = model("List", listSchema);

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
    const { user_id, list } = req.body;
    const listExists = await List.findOne({ user_id: new ObjectId(user_id) });
    if (listExists) {
      listExists.list.push({
        title: list,
        status: 0,
        todos: [],
      });

      const updatedList = await listExists.save();
      return res.status(200).json({
        message: "New list item added to existing document",
        data: updatedList.list.reverse(),
      });
    } else {
      const newList = new List({
        user_id,
        list: [
          {
            title: list,
            status: 0,
            todos: [],
          },
        ],
      });

      const savedList = await newList.save();
      return res.status(200).json({
        message: "New document and list item created",
        data: savedList.list.reverse(),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error at /create-list" });
  }
});

app.post("/get-list", async (req, res) => {
  try {
    const { id } = req.body;
    const listExists = await List.findOne({ user_id: new ObjectId(id) });
    if (listExists) {
      return res.status(200).json({
        message: "List found",
        list: listExists.list.reverse(),
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
    const { user_id, list_id, todo } = req.body;
    const listExists = await List.findOne({ user_id: new ObjectId(user_id) });
    if (listExists) {
      const newTodo = await List.findOneAndUpdate(
        { "list._id": new ObjectId(list_id) },
        {
          $set: {
            "list.$.status": 0,
          },
          $push: {
            "list.$.todos": {
              todo,
              status: 0,
            },
          },
        },
        {
          new: true,
        }
      );
      const addedTodo =
        newTodo.list
          .find((item) => item._id.equals(new ObjectId(list_id)))
          ?.todos.slice(-1)[0] || {};
      return res.status(200).json({
        message: "New todo added",
        data: addedTodo,
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
    const { user_id, id } = req.body;
    const fetchTodos = await List.findOne({
      user_id: new ObjectId(user_id),
      "list._id": new ObjectId(id),
    });
    if (fetchTodos) {
      const todos =
        fetchTodos.list.find((listItem) =>
          listItem._id.equals(new ObjectId(id))
        )?.todos || [];
      return res.status(200).json({
        todos: todos.reverse(),
        message: "Fetched todos",
      });
    } else {
      return res.status(404).json({
        todos: [],
        message: "List not found",
      });
    }
  } catch (error) {
    console.log(error), res.status(500);
    res.json({
      message: "Internal server error in get-todos",
    });
  }
});

app.put("/mark-completed", async (req, res) => {
  try {
    const { list_id, todo_id, user_id } = req.body;
    const updateStatus = await List.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        "list._id": new ObjectId(list_id),
        "list.todos._id": new ObjectId(todo_id),
      },
      {
        $set: {
          "list.$.todos.$[elem].status": 1,
        },
      },
      {
        arrayFilters: [{ "elem._id": new ObjectId(todo_id) }],
        new: true,
      }
    );
    if (updateStatus) {
      const updatedList = updateStatus.list.find((listItem) =>
        listItem._id.equals(new ObjectId(list_id))
      );
      const allStatusOne = updatedList.todos.every((todo) => todo.status === 1);
      if (allStatusOne) {
        await List.updateOne(
          {
            user_id: new ObjectId(user_id),
            "list._id": new ObjectId(list_id),
          },
          {
            $set: {
              "list.$.status": 1,
            },
          }
        );
      }
      const updatedTodos = updatedList.todos || [];
      return res.status(200).json({
        message: "todo status updated",
        data: updatedTodos.reverse(),
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

app.delete("/delete-todo/:id/:list_id/:todo_id", async (req, res) => {
  try {
    const { id, list_id, todo_id } = req.params;
    const deleteTodo = await List.findOneAndUpdate(
      {
        user_id: new ObjectId(id),
        "list._id": new ObjectId(list_id),
        "list.todos._id": new ObjectId(todo_id),
      },
      { $pull: { "list.$.todos": { _id: new ObjectId(todo_id) } } },
      { new: true }
    );

    if (deleteTodo) {
      const updatedTodos =
        deleteTodo.list.find((listItem) =>
          listItem._id.equals(new ObjectId(list_id))
        )?.todos || [];

      const updatedList = deleteTodo.list.find((listItem) =>
        listItem._id.equals(new ObjectId(list_id))
      );
      const allStatusOne = updatedList.todos.every((todo) => todo.status === 1);
      if (allStatusOne) {
        await List.updateOne(
          {
            user_id: new ObjectId(id),
            "list._id": new ObjectId(list_id),
          },
          {
            $set: {
              "list.$.status": 1,
            },
          }
        );
      }

      return res.status(200).json({
        message: "todo deleted",
        data: updatedTodos.reverse(),
      });
    }
    return res.status(404).json({ message: "Failed to delete todo" });
  } catch (error) {
    console.log(error);
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
