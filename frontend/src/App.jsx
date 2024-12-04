// //frontend/src/App.jsx
import { Navbar, Sidebar } from "./components";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const isVideoPage = location.pathname.startsWith("/watch");
  const handleSearch = (term) => {
    setSearchTerm(term); // Update the search term
  };

  useEffect(() => {
    // Close the sidebar when on a video page
    if (isVideoPage) {
      setIsOpen(false);
    } else if (window.innerWidth >= 769) {
      // Reset to default state based on window size if not on a video page
      setIsOpen(true);
    }

    // Listen for window resize events and adjust the sidebar visibility
    const handleResize = () => {
      if (window.innerWidth < 769) {
        setIsOpen(false);
      } else if (!isVideoPage) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call immediately to set the correct sidebar state based on window size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isVideoPage]);

  return (
    <>
      {/* <Navbar openChange={() => setIsOpen((prev) => !prev)} /> */}
      <Navbar openChange={() => setIsOpen((prev) => !prev)} onSearch={handleSearch} />
      <div
        className={`flex pt-8 overflow-hidden bg-white ${
          isVideoPage && isOpen ? "relative" : ""
        }`}
      >
        <Sidebar hidden={isOpen} />
        <div
          id="main-content"
          className={`w-full h-full overflow-y-auto bg-white ${
            !isVideoPage && isOpen ? "lg:ml-52" : "ml-0"
          }`}
          style={{
            position: isVideoPage && isOpen ? "relative" : "static",
            zIndex: isVideoPage && isOpen ? 10 : "auto",
          }}
        >
          <main>
            <Outlet context={{ searchTerm }} />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
