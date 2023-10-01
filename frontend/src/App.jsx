import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import axios from "axios";
import { ChatState } from "./Context/ChatProvider";

function App() {
  axios.defaults.baseURL = "https://chatty-hd.onrender.com";
  const { user } = ChatState();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/chats"
          element={user ? <ChatPage /> : <Navigate to={"/"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
