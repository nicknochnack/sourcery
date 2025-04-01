import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authContext } from "../App";
import { useContext, useEffect } from "react";
import { checkAuthStatus, logout, setAuthToken } from "../utilities/auth";
import { Spinner } from "../ui/spinner";

function PrivateRoute({ children }) {
  const location = useLocation();
  const { isAuth, setIsAuth, isLoading, setIsLoading } =
    useContext(authContext);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      console.log("Setting loading to true");
      try {
        const token = localStorage.getItem("token");
        console.log("Getting token");
        if (token) {
          setAuthToken(token); // Set the token in axios headers
          console.log("Setting token");
          const authStatus = await checkAuthStatus();
          console.log("Checking auth status");
          setIsAuth(authStatus);
          console.log("Setting auth status");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuth(false);
        console.log("Setting auth to false");
      } finally {
        setIsLoading(false);
        console.log("Setting loading to false");
      }
    };
    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-zinc-50 text-2xl font-extrabold">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
