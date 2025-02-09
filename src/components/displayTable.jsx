import { columns } from "../components/data-table/subscriptionColumns"
import { SubscriptionTable } from "../components/data-table/subscriptionTable"

const TableComponent = ({ 
  title, 
  array, 
  btnText, 
  click, 
  isOpen, 
  columnTitles 
}) => {
return (
  <SubscriptionTable
    columns={columnTitles}
    data={array}
    title={title}
    btnText={btnText}
    click={click}
    isOpen={isOpen}
  />
);
}

export default TableComponent;





