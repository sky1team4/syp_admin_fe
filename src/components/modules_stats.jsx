import React from 'react';

function Modules_stats({ title }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">
            View and manage existing system modules
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modules_stats;
