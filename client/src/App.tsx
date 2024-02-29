import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Todos from "./pages/todos/Todos";
import Lists from "./pages/todos/Lists";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="absolute top-3 right-3">
        <ModeToggle />
      </div>
      <div className="h-screen w-full">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/todos/:id" element={<Todos />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
