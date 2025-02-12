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
        {isLoading && <p>Loading relationships...</p>}
        {error && <p>Error loading relationships: {error}</p>}
        
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
