import "./App.css";
import Footer from "./layouts/Footer";
import Navbar from "./layouts/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors'>
        <Navbar />
        <Home />
        <Footer />
      </div>
    </>
  );
}

export default App;
