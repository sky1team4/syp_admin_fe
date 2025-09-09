import { createSubscriptionTypeColumns } from "./data-table/subscriptionTypeColumns"
import { SubscriptionTable } from "./data-table/subscriptionTable"

const SubscriptionTypeTableComponent = ({ 
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
  
  const columns = createSubscriptionTypeColumns({ handleEdit, handleDelete });
  
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

export default SubscriptionTypeTableComponent;
