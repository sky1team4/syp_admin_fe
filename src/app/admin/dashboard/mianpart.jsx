"use client"
import { columns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"

const data = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "Active",
    email: "ken99@yahoo.com",
    phone: "+1 (555) 123-4567",
    subscription: "Premium",
    username: "@ken99",
    image: "https://ui-avatars.com/api/?name=Ken&background=random"
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "Inactive",
    email: "Abe45@gmail.com",
    phone: "+1 (555) 234-5678",
    subscription: "Basic",
    username: "@abe45",
    image: "https://ui-avatars.com/api/?name=Abe&background=random"
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "Inactive",
    email: "Monserrat44@gmail.com",
    phone: "+1 (555) 234-5678",
    subscription: "Basic",
    username: "@monserrat44",
    image: "https://ui-avatars.com/api/?name=Monserrat&background=random"
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "active",
    email: "Silas22@gmail.com",
    phone: "+1 (555) 234-5678",
    subscription: "Basic",
    username: "@silas22",
    image: "https://ui-avatars.com/api/?name=Silas&background=random"
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "active",
    email: "carmella@hotmail.com",
    phone: "+1 (555) 234-5678",
    subscription: "Basic",
    username: "@carmella",
    image: "https://ui-avatars.com/api/?name=Carmella&background=random"
  },
]

export default function DashboardPage() {
  const handleVerification = async (user) => {
    // Add your verification logic here
    console.log("Verifying user:", user);
    // Example: await verifyUser(user.id);
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        onVerify={handleVerification}
      />
    </div>
  );
}
