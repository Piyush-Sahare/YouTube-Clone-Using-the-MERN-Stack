// frontend/src/components/CustomizeChannel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, updateAccount, } from '../Redux/slice/authSlice'; // Import the actions

function CustomizeAccount() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [userdata, setUserData] = useState(null);
  const [loader, setLoader] = useState(false);

  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (data._id) {
      dispatch(getUserData(data._id)); // Dispatch the action to fetch user data
    }
  }, [data._id, dispatch]);

  useEffect(() => {
    if (data) {
      setUserData(data);
      setName(data.name);
      setEmail(data.email);
      setPassword(data.password);
    }
  }, [data]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (file) {
      formData.append('avatar', file);
    }

    try {
      setLoader(true);
      await dispatch(updateAccount({ userId: userdata._id, formData })); // Dispatch the updateAccount action
      setLoader(false);
      alert('Account Updated Successfully');
      navigate('/your_channel');
    } catch (error) {
      setLoader(false);
      console.log('Update Account error', error);
      alert('Something went wrong!');
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    loader ? (
      <div className="text-center my-72">
        <div className="p-4 text-center">
          <div role="status">
            <span className="">Loading...</span>
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
          <div className="mb-4 col-span-full xl:mb-2">
            {userdata ? (
              <>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="max-w-3xl">
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Enter Name" 
                    required 
                  />

                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Enter Email" 
                    required 
                  />

                  <label htmlFor="avatar" className="block mb-1 text-sm font-medium text-gray-900">Avatar</label>
                  <input 
                    type="file" 
                    name="avatar" 
                    id="avatar" 
                    onChange={handleFileChange} 
                    className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  />

                  <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="********" 
                    required 
                  />

                  <button 
                    onClick={handleCancel} 
                    type="button" 
                    className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">
                    Edit
                  </button>
                </form>
              </>
            ) : (
              <div>Loading user data...</div>
            )}
          </div>
        </div>
      </>
    )
  );
}

export default CustomizeAccount;
