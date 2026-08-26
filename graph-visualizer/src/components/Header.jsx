export default function Header({ user, handleLogout, darkMode, setDarkMode }) {
  return (
    <div className="header">
      <h1>Graph Visualizer</h1>
      <span>Signed in as {user.email}</span>

      <button
        onClick={handleLogout}
      >
        Log out
      </button>

      <button
        onClick={() => {
          setDarkMode(!darkMode);
        }}
      >
        {darkMode ? "☀️ Light Mode":"🌙 Dark Mode"}
      </button>
    </div>
  );
}
