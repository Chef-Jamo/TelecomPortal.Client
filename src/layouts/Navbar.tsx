import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Switch, Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <AppBar
      position='static'
      color='default'
      className='shadow-none bg-white dark:bg-gray-100'>
      <Toolbar className='flex justify-between bg-white dark:bg-gray-900'>
        <Typography
          variant='h6'
          className='text-black dark:text-white font-semibold'>
          Telecom Portal
        </Typography>

        <Box className='flex items-center space-x-2'>
          <LightModeIcon className='text-yellow-500' />
          <Switch disabled checked={darkMode} onChange={handleThemeToggle} />
          <DarkModeIcon className='text-gray-300 dark:text-white' />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
