//frontend/src/components/EditChannel.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function EditChannel() {
  const data = useSelector((state) => state.auth.user);
  const history = useNavigate();

  const [channeldata, setchanneldata] = useState(null);
  const [loader, setLoader] = useState(false);

  const [file, setFile] = useState('');
  const [name, setname] = useState('');
  const [handle, sethandle] = useState('');
  const [description, setdescription] = useState('');

  useEffect(() => {
    if (data._id) {
      const fetchUser = async () => {
        try {
          setLoader(true);
          const response = await axios.get(`http://localhost:8000/api/v1/channel/data/${data.channelID}`);
          const channelData = response.data.data;

          setchanneldata(channelData);
          setname(channelData.name);
          sethandle(channelData.handle);
          setdescription(channelData.description);
          setLoader(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUser();
    }
  }, [data._id]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('handle', handle);
    formData.append('description', description);
    if (file) {
      formData.append('banner', file);
    }

    try {
      setLoader(true);

      const res = await axios.put(`http://localhost:8000/api/v1/channel/update/${channeldata._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoader(false);
      alert("Account Updated Successfully");
      history("/your_channel");
    } catch (error) {
      console.log("Update Account error", error);
      alert("Something went wrong?");
    }
  };


  const handleCancel = () => {
    history("/");
  };

  return (
    loader ?
      <div className="text-center my-72">
        <div className="p-4 text-center">
          <div role="status">
            <span className="">Loading...</span>
          </div>
        </div>
      </div>
      :
      <>
        <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
          <div className="mb-4 col-span-full xl:mb-2">
            {channeldata ? (
              <>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="max-w-3xl">
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
                  <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on YouTube and not other Google services. You can change your name twice in 14 days.</p>
                  <input type="text" name="name" id="name" value={name} onChange={(e) => setname(e.target.value)} className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Name" required />

                  <label htmlFor="handle" className="block mb-1 text-sm font-medium text-gray-900">Handle</label>

                  <input type="text" name="handle" id="handle" value={handle} onChange={(e) => sethandle(e.target.value)} className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Email" required />

                  <label htmlFor="channelBanner" className="block mb-1 text-sm font-medium text-gray-900">Banner</label>
                  <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">It’s recommended to use a picture that’s at least 98 x 98 pixels and 4MB or less. Use a PNG or GIF (no animations) file. Make sure your picture follows the YouTube Community Guidelines.</p>
                  <input type="file" name="channelBanner" id="channelBanner" onChange={handleFileChange} className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />

                  <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900">Description</label>

                  <input type="text" name="description" id="description" value={description} onChange={(e) => setdescription(e.target.value)} className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="description" required />

                  <button onClick={handleCancel} type="button" className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2">
                    Cancel
                  </button>
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">
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
  );
}

export default EditChannel;
