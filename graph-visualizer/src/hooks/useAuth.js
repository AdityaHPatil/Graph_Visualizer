import { useState, useEffect } from "react";
import { API_URL } from "../constants/config"; // Imported from your config file

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    async function checkUserSession() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        }); // Sends browser cookies to the server

        if (res.ok === true) {
          const userData = await res.json();
          setUser(userData);
        }
        //if the server says "no active session found"
        else {
          setUser(null); //clear any user data
        }
      } catch (error) {
        //if teh server is offline or the network drops completely
        setUser(null); // Clear data so they must log in again
        console.error(error);
      } finally {
        setLoading(false); //stop showing the loading screen
      }
    }

    checkUserSession();
  }, []);

  async function handleSignUp(event) {
    event.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email, password: password }),
      });

      let serverData = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        serverData = await res.json();
      }

      if (!res.ok) {
        // Check if serverData exists and has a message that isn't empty
        if (serverData?.message && serverData.message.trim() !== "") {
          setAuthError(serverData.message);
        } else {
          // Fallback for 500 errors or empty server responses
          console.log("Server failed with status:", res.status);
          setAuthError("Server error. Please try again later.");
        }
        return;
      }

      setUser(serverData); // Log the user into the app
      setPassword("");
      setEmail("");
    } catch (error) {
      // if server is offline
      setAuthError("Could not connect to the server");
      console.error(error);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email, password: password }),
      });

      // translate json text to JS object
      const serverData = await res.json();

      if (res.ok === false) {
        if (serverData.message) {
          setAuthError(serverData.message);
        } else {
          setAuthError("Login failed");
        }
        return;
      }

      setUser(serverData); // Log the user into the app
      setPassword("");
    } catch (error) {
      //if the server is offline or the network drops completely
      setAuthError("Could not connect to the server. Please try again.");
      console.error(error);
    }
  }

  async function handleLogout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return {
    user,
    loading,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    setAuthError,
    isSignUp,
    setIsSignUp,
    handleSignUp,
    handleLogin,
    handleLogout,
  };
}
