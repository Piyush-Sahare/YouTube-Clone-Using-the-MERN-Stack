// //frontend/src/page/Channel.jsx
import { useState, useEffect } from "react";
import React from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";
import { MdGridView, MdEqualizer } from "react-icons/md";

function Channel() {
  const data = useSelector((state) => state.auth.user);
  const [userdata, setUserData] = useState();
  const navigate = useNavigate(); 

  const handleDeleteChannel = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your channel? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/v1/channel/delete/${data.channelID}`, {
      });
      alert("Channel deleted successfully");
      navigate("/"); // Redirect user to the home page after deletion
      
    } catch (error) {
      console.error("Error deleting channel:", error);
      alert("Please Login again to Delete Channel.");
    }
  };
  useEffect(() => {
    if (data._id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/v1/account/userData/${data._id}`);
          setUserData(response.data.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUser();
    }
  }, [data._id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

 

  return (
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="mt-4 flex items-center gap-5">
            {userdata ? (
              <>
                <img className="w-28 h-28 rounded-full" src={userdata.avatar} alt="not found" />
                <div className="font-bold dark:text-black">
                  <div className="text-lg">{(userdata.name || "Admin").toUpperCase()}</div>
                  <div className="text-sm mb-3 text-gray-500">Joined in {formatDate(userdata.createdAt)}</div>
                  <Link to={"/edit_channel"}>
                    <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2.5 py-2.5 me-2">Customize channel</button>
                  </Link>
                </div>
              </>
            ) : (
              <div>Loading user data...</div>
            )}
          </div>
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              <li className="me-2">
                <Link
                  to={""}
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  <MdGridView className="w-4 h-4 me-2" />
                  All Videos
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={"upload_video"}
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  <MdEqualizer className="w-4 h-4 me-2" />
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>
          <Outlet />
          <div className="mt-6">
            <button
              type="button"
              onClick={handleDeleteChannel}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Delete Channel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Channel;
