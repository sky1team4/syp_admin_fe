"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRelationships } from '../../../redux/features/relationshipSlice';
import TableSideBar from '../../../components/TableSideBar';
import DisplayTable from '../../../components/displayTable';

function Content() {
  const dispatch = useDispatch();
  const relationships = useSelector((state) => state.relationships?.items || []);
  const isLoading = useSelector((state) => state.relationships?.isLoading || false);
  const error = useSelector((state) => state.relationships?.error || null);

  useEffect(() => {
    dispatch(fetchRelationships());
  }, [dispatch]);

  const tableData = relationships.map((relationship) => ({
    title: relationship.title,
    createdDate: relationship.createdDate,
    lastUpdated: relationship.lastUpdated,
  }));

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        title="Relationship"
        dis="Manage relationships efficiently."
        subTitle="Relationship Name *"
        namePlaceholder="Enter relationship name"
        saveButtonText="Add Relationship"
        updateButtonText="Update Relationship"
        type="relationship"
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <DisplayTable
          click={toggleSidebar}
          isOpen={isOpen}
          btnText="Add Relationship"
          title="Relationship"
          array={tableData}
          col1_Title="Relationship"
          col2_Title="Created Date"
          col3_Title="Last Updated"
        />
      )}
    </div>
  );
}

export default Content;
