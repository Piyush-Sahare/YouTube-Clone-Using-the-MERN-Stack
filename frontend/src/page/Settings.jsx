//frontend/src/page/Settings.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import img from "../assets/gde-najti-ssylku-na-svoj-kanal-youtube.jpg"
import { useState } from 'react'
import { useSelector ,useDispatch} from 'react-redux';
import { deleteAccount } from '../Redux/slice/authSlice';
import { useToast } from "../hooks/use-toast"
function Settings() {

    const [loader, setLoader] = useState(false)
    const userdata = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { toast } = useToast()
    const handleDeleteClick = async () =>{
        const  value = confirm("Are you sure ?");
        if (value) { 
            try {
                setLoader(true)
                dispatch(deleteAccount(userdata._id));
                setLoader(false)
                //alert("Your account is deleted !");
                toast({
                    title: "Your account is deleted !",
                  });
                navigate("/signup");
            } catch (error) {
                console.log("account delete error :",error);
                //alert(error);
                toast({
                    variant: "destructive",
                    title: error,
                  });
                
            }
        }  
    }
  return (
    loader ?  
    <div  
    className="text-center  my-72 ">
    <div  
    className="p-4 text-center">
    <div role="status">
        
        <span  
        className="">Loading...</span>
    </div>
    </div>
    </div>
    :
    <div  
    className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4  ">
     <div  
     className="mb-4 col-span-full xl:mb-2"> 
        <div  
        className='text-lg mb-8 '>Settings</div>
        
        <div 
        className="mb-16 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row  max-w-6xl ">
            <div 
            className="flex flex-col justify-between p-4 leading-normal">
                <h5 
                className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">Set up YouTube exactly how you want it</h5>
            </div>
            <img 
            className="ms-auto object-cover rounded-t-lg  md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={img} alt=""/>
        </div>  
        <div 
        className="relative overflow-x-auto  sm:rounded-lg">
            <table 
            className="w-1/2 text-sm text-left rtl:text-right text-gray-500 ">
                <tbody>
                    <tr 
                    className="bg-white   ">
                        <th scope="row" 
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  ">
                        Edit Account
                        </th>
                        <td 
                        className="px-6 py-4">
                            <Link to={"/EditAccount"} 
                            className="font-medium text-blue-600  hover:underline">Edit</Link>
                        </td>
                    </tr>
                    <tr 
                    className="bg-white   ">
                        <th scope="row" 
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Delete Account
                        </th>
                        <td 
                        className="px-6 py-4">
                        <button onClick={handleDeleteClick}  
                        className="font-medium text-blue-600 hover:underline">Delete</button>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    </div>
    </div>
  )
}

export default Settings