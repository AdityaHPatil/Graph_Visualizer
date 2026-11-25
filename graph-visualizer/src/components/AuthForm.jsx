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
    <main className="auth-page">
      <section className="auth-story">
        <a className="brand-lockup auth-brand" href="/" aria-label="Graph Visualizer home">
          <span className="brand-mark">G</span>
          <span>
            <strong>Graph Studio</strong>
            <small>Visualize. Explore. Understand.</small>
          </span>
        </a>
        <div className="auth-story-copy">
          <p className="eyebrow">A clearer view of connections</p>
          <h1>Make complex graphs feel simple.</h1>
          <p>
            Build, explore, and understand your graph with interactive
            algorithm visualizations.
          </p>
          <div className="auth-feature-list">
            <span><i>01</i> Build directed and undirected graphs</span>
            <span><i>02</i> Watch algorithms unfold step by step</span>
            <span><i>03</i> Save and share your work</span>
          </div>
        </div>
        <div className="auth-decoration" aria-hidden="true">
          <span className="decoration-edge edge-one" />
          <span className="decoration-edge edge-two" />
          <span className="decoration-edge edge-three" />
          <span className="decoration-node node-one">A</span>
          <span className="decoration-node node-two">B</span>
          <span className="decoration-node node-three">C</span>
          <span className="decoration-node node-four">D</span>
        </div>
      </section>

      <form
        className="auth-form"
        onSubmit={isSignUp ? handleSignUp : handleLogin}
      >
        <div className="auth-form-heading">
          <p className="eyebrow">{isSignUp ? "Get started" : "Welcome back"}</p>
          <h2>{isSignUp ? "Create your account" : "Log in to Graph Studio"}</h2>
          <p>
            {isSignUp
              ? "Save your graphs and pick up where you left off."
              : "Sign in to continue to your graph workspace."}
          </p>
        </div>

        <label className="auth-field">
          <span>Email address</span>
          <input
            type="email"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            minLength={6}
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {authError && <p className="auth-error" role="alert">{authError}</p>}

        <button className="auth-submit" type="submit">
          {isSignUp ? "Create account" : "Log in"}
        </button>

        <p className="auth-switch">
          {isSignUp ? "Already have an account?" : "New to Graph Studio?"}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError("");
            }}
          >
            {isSignUp ? "Log in" : "Create an account"}
          </button>
        </p>
      </form>
    </main>
  );
}
