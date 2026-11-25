export default function Header({ user, handleLogout, darkMode, setDarkMode }) {
  return (
    <div className="header">
      <a className="brand-lockup" href="/" aria-label="Graph Visualizer home">
        <span className="brand-mark">G</span>
        <span>
          <strong>Graph Studio</strong>
          <small>Visualize. Explore. Understand.</small>
        </span>
      </a>

      <div className="header-actions">
        <div className="account-chip">
          <span className="account-avatar">{user.email.charAt(0).toUpperCase()}</span>
          <span className="account-email">{user.email}</span>
        </div>

        <button
          type="button"
          className="button-secondary theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>

        <button type="button" className="button-quiet" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
