import Image from "next/image";
import React from "react";
import NIC from '../../../../public/pp.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { submitVerificationRequest, resetVerificationState } from '../../../redux/features/verificationSlice';
import { ChangeBadgeStatus } from '@/redux/features/badgeVerificationSlice';
// Image

const VerificationRequest = ({ isOpen, setIsOpen, userData }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.verification);

  const initialDocuments = [
    {
      id: 1,
      label: "Front Side",
      fileName: "",
      fileSize: "",
      imageUrl: null,
      file: null,
    },
    {
      id: 2,
      label: "Back Side",
      fileName: "",
      fileSize: "",
      imageUrl: null,
      file: null,
    },
  ];

  const [documents, setDocuments] = React.useState(initialDocuments);

  const handleFileUpload = async (e, docId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update the document state with the selected file info
    setDocuments(docs => docs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)}KB`,
          imageUrl: URL.createObjectURL(file),
          file: file,
        };
      }
      return doc;
    }));
  };

  const handleSubmit = async () => {
    try {
      // Check if both documents are uploaded
      if (!documents[0].file || !documents[1].file) {
        toast.error('Please upload both front and back side documents');
        return;
      }

      // Pass the correct data structure to match the slice expectations
      const requestData = {
        userData: {
          id: userData?.id || '',
          username: userData?.username || '',
          phone: userData?.phone || ''
        },
        documents: documents
      };

      await dispatch(submitVerificationRequest(requestData)).unwrap();
      toast.success('Verification request submitted successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.message || 'Error submitting verification request');
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      dispatch(resetVerificationState());
    };
  }, [dispatch]);

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
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-500 rounded-full"
          onClick={() => {
            setIsOpen(false);
            setDocuments(initialDocuments);
          }}
        >
          <Image src="/FAQ/cross.png" alt="close" width={20} height={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Verification Request
        </h2>

        <div className="flex items-center p-4 bg-purple-100 rounded-lg shadow-sm max-w-md mt-4">
          <Image
            src={NIC}
            alt="User Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div className="ml-4">
            <h2 className="text-sm font-semibold text-gray-800">Maddison</h2>
            <p className="text-xs text-gray-500">@Maddison_c21</p>
            <p className="text-xs text-gray-500">0321765284</p>
          </div>
        </div>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">
          Required Documents
        </h2>

        {/* Document List */}
        <div className="flex space-x-4 justify-center mb-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border rounded-lg shadow-sm bg-gray-50 w-40 h-42 p-2 relative"
            >
              <label className="cursor-pointer block">
                {doc.imageUrl ? (
                  <Image
                    src={doc.imageUrl}
                    alt={doc.label}
                    width={350}
                    height={6}
                    className="rounded-md mb-2 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <span className="text-gray-500">Click to upload</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, doc.id)}
                />
              </label>
              <div className="absolute top-2 right-2">
                <button
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="text-center flex justify-between">
                {/* <p className="text-sm font-medium text-gray-700">{doc.label}</p> */}
                <p className="text-xs text-gray-500">{doc.fileName}</p>
                <p className="text-xs text-gray-500">{doc.fileSize}</p>
              </div>
            </div>
          ))}
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
            onClick={() => {
              dispatch(ChangeBadgeStatus(userData.id))
            }}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequest;
