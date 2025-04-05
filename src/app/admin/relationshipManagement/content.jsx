import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRelationships, saveRelationship, updateRelationship, deleteRelationship } from '../../../redux/features/relationshipSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('create');

  const toggleSidebar = (mode = 'create') => {
    if (!isOpen) {
      setMode(mode);
    } else {
      setSelectedItem(null);
      setMode('create');
    }
    setIsOpen(!isOpen);
  };

  const handleEdit = (item) => {
    setSelectedItem({
      id: item.id,
      title: item.name,
      status: item.status
    });
    toggleSidebar('edit');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteRelationship(id));
      toast.success('Relationship deleted successfully');
    } catch (error) {
      toast.error('Failed to delete relationship');
    }
  };

  // console.log(relationships);
  

  return (
    <>
      <div className='flex flex-col gap-3 w-full h-full'>
        {/* {isLoading && <p>Loading relationships...</p>} */}
        {error && (
          <div className='flex flex-col gap-4 w-full h-full items-center justify-center p-8'>
            <div className='text-red-500'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800'>Failed to Load Relationships</h3>
            <p className='text-gray-600 text-center max-w-md'>
              {error?.message || 'An unexpected error occurred while loading the relationships.'}
            </p>
            <button 
              onClick={() => dispatch(fetchRelationships())}
              className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Try Again
            </button>
          </div>
        )}
        
        <TableSideBar
          isOpen={isOpen}
          click={toggleSidebar}
          mode={mode}
          selectedItem={selectedItem}
          title="Relationship"
          dis="Manage relationship records efficiently."
          subTitle="Relationship Name *"
          namePlaceholder="Enter relationship name"
          saveButtonText="Add Relationship"
          updateButtonText="Update Relationship"
          type="relationship"
          fetchData={fetchRelationships}
          saveData={saveRelationship}
          updateData={updateRelationship}
        />

        <DisplayTable
          click={() => toggleSidebar('create')}
          isOpen={isOpen}
          btnText="Add Relationship"
          title="Relationship"
          array={relationships}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isLoading={isLoading}
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
