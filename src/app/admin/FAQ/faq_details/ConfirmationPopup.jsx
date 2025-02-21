import { useEffect, useRef } from 'react';
import Image from 'next/image';

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';

      // Add click outside listener
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };

      // Add escape key listener
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      // Cleanup listeners
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with animation */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" />

      {/* Modal container with animation */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <Image src="/FAQ/cross.png" alt="close" width={16} height={16} />
          </button>

          {/* Warning icon and header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Confirm Delete
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto
                transition duration-150 ease-in-out
                transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto
                transition duration-150 ease-in-out
                transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup; 