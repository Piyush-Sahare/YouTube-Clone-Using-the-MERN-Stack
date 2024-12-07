//frontend/src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import React from 'react';
import logo from '../assets/YouTube_Logo_2017.svg.png';
import { Link, useNavigate } from "react-router-dom";
import { logout } from '../Redux/slice/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from '../Redux/slice/authSlice';
import { FiSearch, FiMenu } from "react-icons/fi";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CreateChannel from './CreateChannel';
import { useToast } from "../hooks/use-toast";
import { RiVideoUploadLine } from "react-icons/ri";
function Navbar({ openChange, onSearch }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userdata = useSelector((state) => state.auth.user);
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSidebar = () => {
    openChange();
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleUploadClick = () => {
    navigate("/your_channel/upload_video", { state: { openModal: true } }); // Pass state
  };

  const handleSignOut = () => {
    dispatch(logout());
    console.log("Sign out clicked");
    toast({
      title: "You have successfully logged out",
    });

  };

  useEffect(() => {
    if (userdata?._id) {
      dispatch(getUserData(userdata._id));
    }
  }, [userdata, dispatch]);

  return (
    <>
      <nav className="fixed z-30 w-full border-none bg-white border-b border-gray-200">
        <div className="px-1 py-1 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                className="fixed mt-2 lg:top-2 left-5 z-40 flex items-center justify-center w-6 h-6 bg-white rounded-full  hover:bg-gray-100 group"
              >
                <FiMenu className="w-6 h-6" />
              </button>

              <a className="flex mt-2 ml-14 md:mr-24" href="/">
                <img src={logo} className="mr-2.5 h-5" alt="YouTube Logo" />
              </a>

              <form
                action="#"
                method="get"
                className="hidden lg:block lg:pl-3.5"
                style={{ marginLeft: 300 }}
              >
                <label htmlFor="topbar-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-96">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    style={{ height: 34 }}
                    name="search"
                    id="topbar-search"
                    value={searchTerm}
                    onChange={handleSearchChange} e
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="Search"
                  />
                </div>
              </form>
            </div>

            {/* Conditional rendering for sign-in */}
            {authStatus ? (
              <div className="relative ml-auto lg:ml-4">
                <div className="flex items-center space-x-3"> {/* Flex container to align icon and avatar */}
                  {/* Conditional rendering for upload icon */}
                  {userdata?.hasChannel && (
                    <button
                      onClick={handleUploadClick} // Handle button click
                      className="flex items-center"
                    >
                      <RiVideoUploadLine className="w-6 h-6 text-gray-700 mr-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300"
                    id="user-menu-button-2"
                    aria-expanded={dropdownVisible}
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Open user menu</span>
                    {userdata ? (
                      <img
                        className="w-8 h-8 rounded-full"
                        src={userdata.avatar}
                        alt="User"
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </button>
                </div>
                {dropdownVisible && (
                  <div className="absolute right-0 z-50 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg" id="dropdown-2">
                    {userdata ? (
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-900">{userdata.name}</p>
                        <p className="text-sm font-medium text-gray-900 truncate"> {userdata.email}</p>
                      </div>
                    ) : (
                      <div>Loading user data...</div>
                    )}
                    <ul className="py-1">
                      {userdata?.hasChannel ? (
                        <li>
                          <Link to="/your_channel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Dashboard
                          </Link>
                        </li>
                      ) : (
                        <li>
                          <button
                            onClick={openModal} // Open modal when clicked
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Create Channel
                          </button>
                        </li>
                      )}
                      <li>
                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-blue-500 no-underline">
                <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded font-medium flex items-center gap-1">
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Modal Component */}
      <CreateChannel isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Navbar;
