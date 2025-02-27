import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProfilePic from '../../../../public/pp.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { submitVerificationRequest, resetVerificationState } from '../../../redux/features/verificationSlice';
import { GetAllbadgeVerificationRequest,ChangeBadgeStatus } from '../../../redux/features/badgeVerificationSlice';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ImageViewer = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={[{ src: imageUrl }]}
      plugins={[Zoom, Thumbnails]}
      carousel={{
        preload: 1
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true
      }}
    />
  );
};

const VerificationRequest = ({ isOpen, setIsOpen, userData }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.verification);
  // const badgeVerificationList = useSelector((state) => state.badgeVerificationList);

  // Add state for image preview URL
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Add state for image viewer
  const [selectedImage, setSelectedImage] = useState(null);

  // Clean up object URL when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleSubmit = async () => {
    console.log("userData", userData.id)
    // console.log("documents", documents);
    try {

      dispatch(ChangeBadgeStatus({id: userData.id}))
      // dispatch(GetAllbadgeVerificationRequest())

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-purplenote-800">
            Badge Verification Request
          </h2>
            <Image src="/FAQ/cross.png" className="cursor-pointer" alt="close" width={20} height={20} onClick={() => setIsOpen(false)} />

        </div>
        
        {/* </button> */}

        <div className="flex  items-center p-4 bg-purple-100 rounded-lg shadow-sm max-w-md mt-4">
          <Image
            src={ProfilePic}
            alt="User Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div className="ml-4">
            <h2 className="text-sm font-semibold text-gray-800">{userData?.user_name}</h2>
            <p className="text-xs text-gray-500">{userData?.user_email}</p>
            <p className="text-xs text-gray-500">{userData?.user_phone_number}</p>
          </div>

          <div className="ml-10 bg-[#fa8d2128] text-xs p-2 px-5 text-[#FA8F21] rounded-full">{userData?.badge_status}</div>
        </div>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">
          Required Documents
        </h2>

        {/* Document List */}
        <div className="flex space-x-4 justify-center mb-6">
          <div className="border rounded-lg shadow-sm bg-gray-50 w-40 h-42 p-2 relative cursor-pointer">
            <label className="block">
              {userData?.id_card_front_image && 
                <Image
                  src={process.env.NEXT_PUBLIC_API_URL +"/"+ userData.id_card_front_image}
                  alt="ID Card Front"
                  width={350}
                  height={200}
                  className="rounded-md mb-2 object-cover hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedImage(process.env.NEXT_PUBLIC_API_URL +"/"+ userData.id_card_front_image)}
                />
              }
            </label>
          </div>
          <div className="border rounded-lg shadow-sm bg-gray-50 w-40 h-42 p-2 relative cursor-pointer">
            <label className="block">
              {userData?.id_card_back_image && 
                <Image
                  src={process.env.NEXT_PUBLIC_API_URL +"/"+ userData.id_card_back_image}
                  alt="ID Card Back"
                  width={350}
                  height={200}
                  className="rounded-md mb-2 object-cover hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedImage(process.env.NEXT_PUBLIC_API_URL +"/"+ userData.id_card_back_image)}
                />
              }
            </label>
          </div>
        </div>

        {/* Image Viewer */}
        <ImageViewer
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />

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
