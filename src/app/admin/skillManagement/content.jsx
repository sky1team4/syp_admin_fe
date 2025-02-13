"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSkills, saveSkill, updateSkill, deleteSkill } from '../../../redux/features/skillSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: skills, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    return state.skill || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        await dispatch(fetchSkills()).unwrap();
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
        setIsDataLoaded(true);
      }
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
      await dispatch(deleteSkill(id)).unwrap();
      toast.success('Skill deleted successfully');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  // Format dates for display
  const formattedSkills = skills?.map(skill => ({
    ...skill,
    createdDate: new Date(skill.createDateTime).toLocaleDateString(),
    lastUpdated: new Date(skill.updateDateTime).toLocaleDateString()
  }));

  if (!isDataLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Skill"
        dis="Manage skill records efficiently."
        subTitle="Skill Name *"
        namePlaceholder="Enter skill name"
        saveButtonText="Add Skill"
        updateButtonText="Update Skill"
        type="skill"
        fetchData={fetchSkills}
        saveData={saveSkill}
        updateData={updateSkill}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Skill"
        title="Skill"
        link="/admin/profile-management"
        array={formattedSkills}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        columnTitles={[
          { header: "Skill", accessorKey: "name" },
          { header: "Created Date", accessorKey: "createdDate" },
          { header: "Last Updated", accessorKey: "lastUpdated" }
        ]}
      />
    </div>
  );
}

export default Content