//frontend/src/page/Signup.jsx
import React, { useState } from 'react';
import logo from "../assets/download (1).png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../Redux/slice/authSlice';

function Signup() {

    const [loader, setLoader] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoader(true);
            await dispatch(register(formData)).unwrap();
            setSuccessMessage('Signup successful!');
            setFormData({ name: '', email: '', password: '' });
            setError('');
            setLoader(false);
            alert(" SignUp Successfully .")
            navigate("/login");
        } catch (err) {
            setError(err.message || 'An error occurred.');
            setSuccessMessage('');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        loader ?  
        <div className="text-center  my-72 ">
        <div className="p-4 text-center">
        <div role="status">
            
            <span className="">Loading...</span>
        </div>
        </div>
        </div>
        :
        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 bg-slate-100 ">
            <a href="/" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 ">
                <img src={logo} className="mr-4 h-11" alt="Logo" />
            </a>
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow ">
                <h2 className="text-2xl font-bold text-gray-900 ">
                    Create a New Account
                </h2>
                <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder="Enter Name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-black focus:ring-4 focus:ring-primary-300 sm:w-auto">
                        Create account
                    </button>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
                    <div className="text-sm font-medium text-gray-500">
                        Already have an account? <Link to="/login" className="text-blue-700 hover:underline">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

