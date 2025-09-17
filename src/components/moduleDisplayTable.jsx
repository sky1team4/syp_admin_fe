import React from 'react';
import { createColumns } from './data-table/moduleColumns';
import DisplayTable from './subdisplayTable';

function ModuleDisplayTable({ 
  btnText, 
  title, 
  array, 
  backBTN, 
  col1_Title, 
  col2_Title, 
  col3_Title, 
  isOpen, 
  click, 
  handleEdit, 
  handleDelete 
}) {
  const columns = createColumns({ handleEdit, handleDelete });

  return (
    <DisplayTable
      btnText={btnText}
      title={title}
      array={array}
      backBTN={backBTN}
      col1_Title={col1_Title}
      col2_Title={col2_Title}
      col3_Title={col3_Title}
      isOpen={isOpen}
      click={click}
      columns={columns}
    />
  );
}

export default ModuleDisplayTable;
