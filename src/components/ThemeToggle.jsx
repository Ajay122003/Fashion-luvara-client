import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { useEffect, useState } from "react";
import "../styles/ThemeToggle.css";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.mode);
  const [animate, setAnimate] = useState(false);

  const handleToggle = () => {
    setAnimate(true);
    dispatch(toggleTheme());

    setTimeout(() => setAnimate(false), 400);
  };

  return (
    <button
      onClick={handleToggle}
      className={`theme-toggle-btn ${animate ? "animate" : ""}`}
      aria-label="Toggle theme"
    >
      <span className="icon">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span className="label">
        {theme === "light" ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;
