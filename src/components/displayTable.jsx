import { columns } from "../components/data-table/subscriptionColumns"
import { SubscriptionTable } from "../components/data-table/subscriptionTable"

const TableComponent = ({ 
  title, 
  array, 
  // btnText, 
  click, 
  isOpen, 
   backBTN
  // link,
  // columnTitles 
}) => {
return (
  <SubscriptionTable
    columns={columns} 
    data={array}
    title={title}
    // btnText={btnText}
    // link={link}
    backBTN={backBTN}
    click={click}
    isOpen={isOpen}
  />
);
}

export default TableComponent;





