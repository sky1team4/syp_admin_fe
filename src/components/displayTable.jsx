import { columns } from "../components/data-table/subscriptionColumns"
import { SubscriptionTable } from "../components/data-table/subscriptionTable"

const TableComponent = (info) => {
  return (
    <SubscriptionTable
      columns={columns}
      data={info.array}
      title={info.title}
      btnText={info.btnText}
      click={info.click}
      isOpen={info.isOpen}
    />
  )
}

export default TableComponent
