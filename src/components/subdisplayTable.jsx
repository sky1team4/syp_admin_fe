import { createColumns } from "./data-table/subscriptionColumns"
import { SubscriptionTable } from "./data-table/subscriptionTable"

const TableComponent = ({ 
  title, 
  array, 
  btnText, 
  click, 
  isOpen,
  backBTN,
  link,
  handleEdit,
  handleDelete
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
    />
  );
}

export default TableComponent;





