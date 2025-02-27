import { createColumns } from "./data-table/tableColumns"
import { SubscriptionTable } from "./data-table/displayTable"

const TableComponent = ({ 
  title, 
  array, 
  btnText, 
  click, 
  isOpen,
  backBTN,
  link,
  handleEdit,
  handleDelete,
  isLoading
}) => {
  
  const columns = createColumns({ handleEdit, handleDelete });
  
  return (
    <SubscriptionTable
      columns={columns} 
      data={array}
      title={title}
      btnText={btnText}
      link={link}
      backBTN={backBTN}
      click={click}
      isOpen={isOpen}
      isLoading={isLoading}
    />
  );
}

export default TableComponent;





