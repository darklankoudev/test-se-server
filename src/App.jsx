import "./Css/App.css";
import "./Css/themes/echo.css";
import Dashboard from "./components/overview/overview";
import Transactions from "./pages/transactions/transactions";
import Banner from "./components/banner/banner";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
