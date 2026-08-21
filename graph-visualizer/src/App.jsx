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

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setAuthError(data.message || "Login failed");
      return;
    }

    setUser(data);
    setPassword("");
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
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Graph Visualizer</h1>
        <h2>Log in</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {authError && <p>{authError}</p>}
        <button type="submit">Log in</button>
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
