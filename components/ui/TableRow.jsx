import React from 'react';

const Table = ({ children }) => {
    return (
        <table className="min-w-full bg-white rounded-lg">
            {children}
        </table>
    );
};

export default Table;
