import { useState, createContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Import pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RFPQuestions from "./pages/RFPQuestions";
import RFPResponse from "./pages/RFPResponse";
import RFPComparison from "./pages/RFPComparison";

// Setup auth context
export const authContext = createContext();

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <authContext.Provider
      value={{ isAuth, setIsAuth, isLoading, setIsLoading }}
    >
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions/:rfpId"
            element={
              <PrivateRoute>
                <RFPQuestions />
              </PrivateRoute>
            }
          />
          <Route
            path="/detail/:rfpId"
            element={
              <PrivateRoute>
                <RFPResponse />
              </PrivateRoute>
            }
          />
          <Route
            path="/compare/:rfpId"
            element={
              <PrivateRoute>
                <RFPComparison />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </authContext.Provider>
  );
}

export default App;
