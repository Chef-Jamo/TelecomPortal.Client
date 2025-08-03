import "./App.css";
import Footer from "./layouts/Footer";
import Navbar from "./layouts/Navbar";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors'>
        <Navbar />
        <Home />
        <Footer />
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
    </>
  );
}

export default App;
