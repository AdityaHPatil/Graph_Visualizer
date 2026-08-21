import "./App.css";
import GraphControls from "./components/GraphControls";
import useGraph from "./hooks/useGraph";
import Graph from "./components/Graph";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function App() {
  const graph = useGraph();

  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSignUp,setIsSignUp]=useState(false);

  useEffect(() => {

      async function checkUserSession(){
        try{
          const res=await fetch(`${API_URL}/api/auth/me`,{credentials:"include"});    // Sends browser cookies to the server

          if (res.ok===true){
            const userData=await res.json();
            setUser(userData);
          }
          //if the server says "no active session found"
          else{
            setUser(null);           //clear any user data
          }
        }
        //if teh server is offline or the network drops completely
        catch(error){
          setUser(null);            // Clear data so they must log in again
          console.error(error);
        }
        finally{
          setLoading(false);          //stop showing the loading screen
        }
      }

      checkUserSession();
  }, []);

  async function handleSignUp(event){
      event.preventDefault();
      setAuthError("");

      try{
        const res=await fetch(`${API_URL}/api/auth/signup`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
          body:JSON.stringify({email:email,password:password}),
        });


        const serverData=await res.json();

        if (res.ok===false){
          if (serverData.message){
            setAuthError(serverData.message);
          }else{
            setAuthError("SignUp failed");
          }
          return;
        }

         setUser(serverData); // Log the user into the app
        setPassword("");
        setEmail("");
      }
      // if server is offline 
      catch(error){
        setAuthError("Could not connect to the server");
        console.error(error);
      }

    }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");

    try{
      const res=await fetch(`${API_URL}/api/auth/login`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({email:email,password:password}),
      });

      // translate json text to JS object
      const serverData=await res.json();

      if (res.ok===false){
        if (serverData.message){
          setAuthError(serverData.message);
        }else{
          setAuthError("Login failed");
        }
        return;
      }

      setUser(serverData); // Log the user into the app
      setPassword("");  

    }
    //if the server is offline or the network drops completely
    catch(error){
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

  if (loading) return <p>Checking authentication...</p>;

  if (!user) {
    return (
      <form className="auth-form" onSubmit={isSignUp? handleSignUp:handleLogin}>
        <h1>Graph Visualizer</h1>
        <h2>{isSignUp? "Create Account":"Log in"}</h2>
        <input
          type="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {authError && <p>{authError}</p>}

        <button type="submit">{isSignUp ? "Sign up":"Log in"}</button>

        <button type="button" onClick={() => {
          setIsSignUp(!isSignUp);
          setAuthError("");
        }}>{isSignUp
          ? "Already have an account? Log in"
          : "Need an account? Sign up"}
        </button>
      </form>
    );
  }

  const { nodes, edges, ...controls } = graph;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="header">
        <h1>Graph Visualizer</h1>
        <span>Signed in as {user.email}</span>

        <button onClick={handleLogout}>Log out</button>

        <button
          onClick={() => {
            setDarkMode(!darkMode);
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <GraphControls {...controls} />

      <Graph
        nodes={nodes}
        edges={edges}
        directed={graph.directed}
        bfsResult={graph.bfsResult}
        dfsResult={graph.dfsResult}
        dijkstraResult={graph.dijkstraResult}
        mstResult={graph.mstResult}
      />
    </div>
  );
}
