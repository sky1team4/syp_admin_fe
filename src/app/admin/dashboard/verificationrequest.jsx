import Image from "next/image";
import React from "react";
import ProfilePic from '../../../../public/pp.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { submitVerificationRequest, resetVerificationState } from '../../../redux/features/verificationSlice';
import { ChangeBadgeStatus } from '../../../redux/features/badgeVerificationSlice';

const VerificationRequest = ({ isOpen, setIsOpen, userData }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.verification);


  const handleSubmit = async () => {
    console.log("userData", userData.id)
    // console.log("documents", documents);
    try {

      dispatch(ChangeBadgeStatus({id: userData.id}))

      // Ensure userData is defined before accessing its properties
      if (!userData) {
        // toast.error('User data is not available');
        return;
      }

      setIsOpen(false);
    } catch (error) {
      toast.error(error?.message || 'Error submitting verification request');
    }
  };


  return (
    <div
      className={`fixed right-0 inset-y-0 flex justify-center items-center z-50 transition-transform duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      <Toaster position="top-center" />
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Popup */}

      <div className="bg-white rounded-lg h-screen shadow-lg w-full max-w-xl p-6 relative transform transition-transform duration-500">
        
          <Image src="/FAQ/cross.png" className="cursor-pointer" alt="close" width={20} height={20} onClick={() => setIsOpen(false)} />
        {/* </button> */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Verification Request
        </h2>

        <div className="flex items-center p-4 bg-purple-100 rounded-lg shadow-sm max-w-md mt-4">
          <Image
            src={ProfilePic}
            alt="User Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div className="ml-4">
            <h2 className="text-sm font-semibold text-gray-800">{userData?.name}</h2>
            <p className="text-xs text-gray-500">{userData?.email}</p>
            <p className="text-xs text-gray-500">{userData?.phoneNumber}</p>
          </div>
        </div>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">
          Required Documents
        </h2>

        {/* Document List */}
        <div className="flex space-x-4 justify-center mb-6">
         
            <div
             
              className="border rounded-lg shadow-sm bg-gray-50 w-40 h-42 p-2 relative"
            >
              <label className="block">
                {userData?.id_card_front_image && 
                  <Image
                    src={process.env.NEXT_PUBLIC_API_URL + userData?.id_card_front_image}
                     alt="id_card_front_image"
                    width={350}
                    height={6}
                    className="rounded-md mb-2 object-cover"
                  />
                }
                 
               
              </label>
            
            </div>
            <div
             
              className="border rounded-lg shadow-sm bg-gray-50 w-40 h-42 p-2 relative"
            >
              <label className="block">
                {userData?.id_card_back_image && 
                  <Image
                    src={process.env.NEXT_PUBLIC_API_URL + userData?.id_card_back_image}
                    alt="id_card_back_image"
                    width={350}
                    height={6}
                    className="rounded-md mb-2 object-cover"
                  />
                }
                 
               
              </label>
            
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            onClick={() => {setIsOpen(false)
              setDocuments(initialDocuments);}
            }
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={handleSubmit}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequest;
