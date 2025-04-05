"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubSkills, saveSubSkill, updateSubSkill, deleteSubSkill } from '../../../redux/features/subSkillSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: subSkills, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    console.log('SubSkill State:', state.subSkill);
    return state.subSkill || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        const response = await dispatch(fetchSubSkills()).unwrap();
        console.log('Fetched Data:', response);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching sub skills:', error);
        toast.error('Failed to load sub skills');
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
      status: item.status,
      skillId: item.skillId
    });
    toggleSidebar('edit');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSubSkill(id)).unwrap();
      toast.success('Sub skill deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sub skill');
    }
  };

  // Format dates for display
  const formattedSubSkills = subSkills ? subSkills.map(subSkill => ({
    ...subSkill,
    skillName: subSkill.skill?.name || 'N/A',
    createdDate: new Date(subSkill.createDate).toLocaleDateString(),
    lastUpdated: new Date(subSkill.updateDate).toLocaleDateString()
  })) : [];

  // if (!isDataLoaded || isLoading) {
  //   return <div>Loading...</div>;
  // }

  console.log('Formatted Sub Skills:', formattedSubSkills);

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Sub Skill"
        dis="Manage sub skills efficiently."
        subTitle="Sub Skill *"
        namePlaceholder="Enter sub skill"
        type="subSkill"
        fetchData={fetchSubSkills}
        saveData={saveSubSkill}
        updateData={updateSubSkill}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Sub Skill"
        title="Sub Skill"
        link="/admin/profile-management"
        array={formattedSubSkills}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        type="subSkill"
      />
    </div>
  );
}

export default Content