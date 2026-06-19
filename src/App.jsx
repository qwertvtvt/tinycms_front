import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ManagerPage from "./pages/manager";

function App() {
  return (
    <>
      <title>TinyCMS</title>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/manage" element={<ManagerPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

// https://qiita.com/minimumskills/items/da37eaf8f188095e1feb#contacjs