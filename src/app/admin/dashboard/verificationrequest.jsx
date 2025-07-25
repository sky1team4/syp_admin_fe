import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProfilePic from '../../../../public/pp.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
// import { submitVerificationRequest, resetVerificationState } from '../../../redux/features/verificationSlice';
import { GetAllbadgeVerificationRequest,ChangeBadgeStatus } from '../../../redux/features/badgeVerificationSlice';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ImageViewer = ({ isOpen, onClose, imageUrl, userData }) => {
  const slides = [
    { 
      src: process.env.NEXT_PUBLIC_API_URL + "/" + userData?.id_card_front_image,
      title: "Front Side"
    },
    { 
      src: process.env.NEXT_PUBLIC_API_URL + "/" + userData?.id_card_back_image,
      title: "Back Side"
    }
  ].filter(slide => slide.src.includes("undefined") === false);

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      plugins={[Zoom, Thumbnails]}
      carousel={{
        preload: 1,
        finite: true
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true
      }}
    />
  );
};

const ImageCard = ({ imageUrl, alt, onClick, side }) => {
  const [fileSize, setFileSize] = useState('');

  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        const approximateSize = (img.naturalWidth * img.naturalHeight * 0.23);
        if (approximateSize < 1024) {
          setFileSize(Math.round(approximateSize) + ' B');
        } else if (approximateSize < 1048576) {
          setFileSize(Math.round(approximateSize / 1024) + ' KB');
        } else {
          setFileSize((approximateSize / 1048576).toFixed(2) + ' MB');
        }
      };
    }
  }, [imageUrl]);

  return (
    <div className="border rounded-lg shadow-sm bg-gray-50 w-48 p-2 relative cursor-pointer group">
      <label className="block">
        <div className="relative w-full h-[180px]">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-md hover:opacity-80 transition-opacity"
            onClick={onClick}
          />
        </div>
        <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
          <span className="font-medium">{side} Side</span>
          <span className="font-medium">Size: {fileSize}</span>
        </div>
      </label>
    </div>
  );
};

const VerificationRequest = ({ isOpen, setIsOpen, userData }) => {

  console.log("userData", userData);
  
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

      await dispatch(ChangeBadgeStatus({id: userData.id}))
      // Refresh the verification requests data after status change
      dispatch(GetAllbadgeVerificationRequest())

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

  // Check if the verification is already active/verified
  const isVerified = userData?.badge_status === 'verified' || userData?.badge_status === 'active';


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
            {isVerified ? 'Badge Verification Details' : 'Badge Verification Request'}
          </h2>
            <Image 
              src="/FAQ/cross.png" 
              className="cursor-pointer" 
              alt="close" 
              width={20} 
              height={20} 
              style={{ width: 'auto', height: 'auto' }}
              onClick={() => setIsOpen(false)} 
            />

        </div>
        
        {/* </button> */}

        <div className="flex justify-between items-center p-4 bg-purple-100 rounded-lg shadow-sm max-w-md mt-4">
          <div className="flex">

            <div className="relative w-12 h-12">
              <Image
                src={ProfilePic}
                alt="User Profile"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full border border-gray-300"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-800">{userData?.user_name}</h2>
              <p className="text-xs text-gray-500">{userData?.user_email}</p>
              <p className="text-xs text-gray-500">{userData?.user_phone_number}</p>
            </div>
          </div>

          <div className={`self-center text-xs p-2 px-5 rounded-full ${
            isVerified 
              ? 'bg-green-100 text-green-600' 
              : 'bg-[#fa8d2128] text-[#FA8F21]'
          }`}>
            {userData?.badge_status}
          </div>
        </div>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">
          Required Documents
        </h2>

        {/* Document List */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex space-x-8 justify-center">
            {userData?.id_card_front_image && (
              <ImageCard
                imageUrl={process.env.NEXT_PUBLIC_API_URL + "/" + userData.id_card_front_image}
                alt="ID Card Front"
                onClick={() => setSelectedImage(process.env.NEXT_PUBLIC_API_URL + "/" + userData.id_card_front_image)}
                side="Front"
              />
            )}
            {userData?.id_card_back_image && (
              <ImageCard
                imageUrl={process.env.NEXT_PUBLIC_API_URL + "/" + userData.id_card_back_image}
                alt="ID Card Back"
                onClick={() => setSelectedImage(process.env.NEXT_PUBLIC_API_URL + "/" + userData.id_card_back_image)}
                side="Back"
              />
            )}
          </div>
        </div>

        {/* Image Viewer */}
        <ImageViewer
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
          userData={userData}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              isVerified 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            onClick={handleSubmit}
          >
            {isVerified ? 'Undo Verify' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequest;
