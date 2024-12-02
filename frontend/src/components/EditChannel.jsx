// // //frontend/src/components/EditChannel.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateChannel, getChannel, clearError, clearSuccessMessage } from '../Redux/slice/channelSlice';
// import { useToast } from "../hooks/use-toast"
// function EditChannel() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Accessing required state from Redux
//   const { user } = useSelector((state) => state.auth); 
//   const { channel,error, successMessage } = useSelector((state) => state.channel);

//   // Local component states
//   const [file, setFile] = useState('');
//   const [name, setName] = useState('');
//   const [handle, setHandle] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast()
//   useEffect(() => {
//     if (user?.channelId) {
//       //console.log("Fetching channel for ID:", user.channelID);
//       dispatch(getChannel(user.channelId));
//     }
//   }, [dispatch, user?.channelId]);
  
//   useEffect(() => {
//     if (channel) {
//       //console.log("Channel data:", channel); // Debugging log
//       setName(channel.name || '');
//       setHandle(channel.handle || '');
//       setDescription(channel.description || '');
//     } else {
//       console.log("Channel is still undefined"); // Debugging log
//     }
//   }, [channel]);
  
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('handle', handle);
//     formData.append('description', description);
//     if (file) {
//       formData.append('banner', file);
//     }
//     setLoading(true);
//     dispatch(updateChannel({ channelId: channel?._id, formData }));
//   };

//   const handleCancel = () => {
//     navigate('/your_channel');
//   };

//   useEffect(() => {
//     if (error) {
//       //alert(`Error: ${error}`);
//       toast({
//         variant: "destructive",
//         title: `Error: ${error}`,
//       });
//       dispatch(clearError());
//     }
//     if (successMessage) {
//       setLoading(false);
//       toast({
//         title: successMessage,
//       });
//       dispatch(clearSuccessMessage());
//       navigate('/your_channel');
//     }
//   }, [error, successMessage, navigate, dispatch]);

//   return loading ? (
//     <div className="text-center my-72">
//       <div className="p-4 text-center">
//         <div role="status">
//           <span className="">Loading...</span>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <>
//       <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
//         <div className="mb-4 col-span-full xl:mb-2">
//           {channel ? (
//             <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="max-w-3xl">
//               <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
//               <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
//                 Choose a channel name that represents you and your content. You can change your name twice in 14 days.
//               </p>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                 placeholder="Enter Name"
//               />

//               <label htmlFor="handle" className="block mb-1 text-sm font-medium text-gray-900">Handle</label>
//               <input
//                 type="text"
//                 name="handle"
//                 id="handle"
//                 value={handle}
//                 onChange={(e) => setHandle(e.target.value)}
//                 className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                 placeholder="Enter Handle"
//               />

//               <label htmlFor="channelBanner" className="block mb-1 text-sm font-medium text-gray-900">Banner</label>
//               <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
//                 Use a PNG or GIF file that’s at least 98 x 98 pixels and 4MB or less.
//               </p>
//               <input
//                 type="file"
//                 name="channelBanner"
//                 id="channelBanner"
//                 onChange={handleFileChange}
//                 className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//               />

//               <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900">Description</label>
//               <input
//                 type="text"
//                 name="description"
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                 placeholder="Description"
//               />

//               <button
//                 onClick={handleCancel}
//                 type="button"
//                 className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
//               >
//                 Edit
//               </button>
//             </form>
//           ) : (
//             <div>Loading user data...</div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default EditChannel;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateChannel, getChannel, clearError, clearSuccessMessage } from '../Redux/slice/channelSlice';
import { useToast } from "../hooks/use-toast"
function EditChannel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing required state from Redux
  const { user } = useSelector((state) => state.auth); 
  const { channel, error, successMessage } = useSelector((state) => state.channel);

  // Local component states
  const [file, setFile] = useState('');
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.channelId) {
      dispatch(getChannel(user.channelId));
    }
  }, [dispatch, user?.channelId]);
  
  useEffect(() => {
    if (channel) {
      setName(channel.name || '');
      setHandle(channel.handle || '');
      setDescription(channel.description || '');
    }
  }, [channel]);
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleAvatarChange = (event) => {
    const selectedAvatar = event.target.files[0];
    setAvatar(selectedAvatar);
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
    if (avatar) {
      formData.append('avatar', avatar);
    }
    setLoading(true);
    dispatch(updateChannel({ channelId: channel?._id, formData }));
  };

  const handleCancel = () => {
    navigate('/your_channel');
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: `Error: ${error}`,
      });
      dispatch(clearError());
    }
    if (successMessage) {
      setLoading(false);
      toast({
        title: successMessage,
      });
      dispatch(clearSuccessMessage());
      navigate('/your_channel');
    }
  }, [error, successMessage, navigate, dispatch]);

  return loading ? (
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
          {channel ? (
            <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="max-w-3xl">
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
              <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
                Choose a channel name that represents you and your content. You can change your name twice in 14 days.
              </p>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Name"
              />

              <label htmlFor="handle" className="block mb-1 text-sm font-medium text-gray-900">Handle</label>
              <input
                type="text"
                name="handle"
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Handle"
              />

              <label htmlFor="channelBanner" className="block mb-1 text-sm font-medium text-gray-900">Banner</label>
              <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
                Use a PNG or GIF file that’s at least 98 x 98 pixels and 4MB or less.
              </p>
              <input
                type="file"
                name="channelBanner"
                id="channelBanner"
                onChange={handleFileChange}
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              <label htmlFor="avatar" className="block mb-1 text-sm font-medium text-gray-900">Avatar</label>
              <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
                Use a PNG or GIF file that’s at least 98 x 98 pixels and 4MB or less.
              </p>
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Description"
              />

              <button
                onClick={handleCancel}
                type="button"
                className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
              >
                Edit
              </button>
            </form>
          ) : (
            <div>Loading user data...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditChannel;
