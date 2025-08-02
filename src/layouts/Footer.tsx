import { Typography } from "@mui/material";

const Footer = () => {
  const dateCreated = "2 August 2025";

  return (
    <footer className='w-full py-4 bg-gray-100 dark:bg-gray-800 text-center mt-auto'>
      <Typography variant='body2' className='text-gray-600 dark:text-gray-300'>
        © {dateCreated} — Authored by James Goddard
      </Typography>
    </footer>
  );
};

export default Footer;
