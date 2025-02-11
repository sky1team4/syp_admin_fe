import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRelationships, saveRelationship, updateRelationship } from '../../../redux/features/relationshipSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'

function Content() {
  const dispatch = useDispatch();
  const { items: relationships, isLoading, error } = useSelector((state) => state.relationship || { items: [], isLoading: false, error: null });
  // const { items: relationships = [], isLoading, error } = useSelector(state => state.relationships || { items: [], isLoading: false, error: null });
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchRelationships());
    };
    fetchData();
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  console.log(relationships);
  

  return (
    <>
      <div className='flex flex-col gap-3 w-full h-full'>
        {isLoading && <p>Loading relationships...</p>}
        {error && <p>Error loading relationships: {error}</p>}
        
        <TableSideBar
          isOpen={isOpen}
          click={toggleSidebar}
          title="Relationship"
          dis="Manage relationship records efficiently."
          subTitle="Relationship Name *"
          namePlaceholder="Enter relationship name"
          saveButtonText="Add Relationship"
          updateButtonText="Update Relationship"
          // type="relationship"
        
          saveData={saveRelationship}
          updateData={updateRelationship}
        />

<DisplayTable
          click={toggleSidebar}
          isOpen={isOpen}
          btnText="Add Relationship"
          title="Relationship"
          array={relationships}
          // array={fetchRelationships} // Pass fetchData as a prop
          columnTitles={[
            { header: "Relationship", accessorKey: "name" },
            { header: "Created Date", accessorKey: "createdDate" },
            { header: "Last Updated", accessorKey: "lastUpdated" }
          ]}
        />
      </div>
    </>
  )
}

export default Content;
