import React from 'react';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmButtonText = 'Delete',
  confirmButtonClassName = 'px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700'
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 w-[400px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title || 'Confirm Action'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message || 'Are you sure you want to proceed?'}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-md border border-gray-300 hover:border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={confirmButtonClassName}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDialog; 