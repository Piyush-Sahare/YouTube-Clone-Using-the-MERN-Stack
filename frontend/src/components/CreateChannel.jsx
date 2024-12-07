// //frontend/src/components/CreateChannel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createChannel, clearError, clearSuccessMessage } from "../Redux/slice/channelSlice";
import { getUserData } from "../Redux/slice/authSlice";
import { useToast } from "../hooks/use-toast"

const CreateChannel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const { toast } = useToast()
  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state) => state.channel);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user._id);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'handle') setHandle(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !handle) {
      dispatch(clearError());
      return;
    }

    dispatch(createChannel({ name, handle })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(getUserData(userId)); // Update user state
        onClose(); // Close modal
        toast({
          title: "Channel Created Successfully",
        });
        setLoading(false);
        dispatch(clearError());
        dispatch(clearSuccessMessage());
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800">How you’ll appear</h2>
        <div className="mt-4">
          {/* Form */}
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="handle" className="block text-sm font-medium text-gray-600">Handle</label>
              <input
                type="text"
                id="handle"
                name="handle"
                value={handle}
                onChange={handleInputChange}
                placeholder="@Handle"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Display errors or success */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}

            {/* Footer */}
            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create channel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
