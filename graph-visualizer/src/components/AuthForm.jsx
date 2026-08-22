export default function AuthForm({ auth }) {
  const {
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    setAuthError,
    handleSignUp,
    handleLogin,
  } = auth;

  return (
    <form
      className="auth-form"
      onSubmit={isSignUp ? handleSignUp : handleLogin}
    >
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

      <button type="submit">{isSignUp ? "Sign up" : "Log in"}</button>

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
