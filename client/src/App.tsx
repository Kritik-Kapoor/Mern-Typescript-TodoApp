import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Todos from "./pages/todos/Todos";
import Lists from "./pages/todos/Lists";

function App() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/todos/:id" element={<Todos />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
