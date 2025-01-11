import React from 'react';

const TableHeader = ({ children }) => {
    return (
        <thead className="bg-gray-100">
            {children}
        </thead>
    );
};

export default TableHeader; 