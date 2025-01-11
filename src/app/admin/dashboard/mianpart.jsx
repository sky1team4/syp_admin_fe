"use client"
import React, { useState, useMemo } from "react";
import Image from "next/image";
import VerificationRequest from "./verificationrequest";
import Table from "../../../../components/ui/Table";
// import TableBody from "@/components/ui/TableBody";
// import TableCell from "@/components/ui/TableCell";
// import TableHead from "@/components/ui/TableHead";
import TableHeader from "../../../../components/ui/TableHeader";
import TableRow from "../../../../components/ui/TableRow";
import Input from "../../../../components/ui/Input";
// import Select from "@/components/ui/Select";
// import SelectTrigger from "@/components/ui/SelectTrigger";
// import SelectValue from "@/components/ui/SelectValue";
// import SelectContent from "@/components/ui/SelectContent";
// import SelectItem from "@/components/ui/SelectItem";

const UserTable = () => {
  const users = [
    {
      name: "Maddison",
      username: "@Maddison_c21",
      phone: "0321765284",
      status: "Active",
      subscription: "Unsubscribed",
      avatar: "https://i.pravatar.cc/40",
    },
    {
      name: "Maddison",
      username: "@Maddison_c21",
      phone: "0321765284",
      status: "Inactive",
      subscription: "Subscribed",
      avatar: "https://i.pravatar.cc/40",
    },
    {
      name: "Maddison",
      username: "@Maddison_c21",
      phone: "0321765284",
      status: "Active",
      subscription: "Unsubscribed",
      avatar: "https://i.pravatar.cc/40",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Users");
  const [filters, setFilters] = useState({
    name: "",
    username: "",
    phone: "",
    status: "",
    subscription: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchName = user.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchUsername = user.username
        .toLowerCase()
        .includes(filters.username.toLowerCase());
      const matchPhone = user.phone.includes(filters.phone);
      const matchStatus = filters.status
        ? user.status === filters.status
        : true;
      const matchSubscription = filters.subscription
        ? user.subscription === filters.subscription
        : true;

      return (
        matchName &&
        matchUsername &&
        matchPhone &&
        matchStatus &&
        matchSubscription
      );
    });
  }, [users, filters]);

  const getStatusBadge = (status) => {
    if (status === "Active")
      return (
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
          Active
        </span>
      );
    return (
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
        Inactive
      </span>
    );
  };

  const getSubscriptionBadge = (subscription) => {
    if (subscription === "Subscribed")
      return <span className="text-green-600 font-medium">Subscribed</span>;
    return <span className="text-red-600 font-medium">Unsubscribed</span>;
  };

  return (
    <div className="relative">
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-white rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Users Information
          </h2>
          <button className="bg-gray-100 rounded-full">
            <Image src="/More.svg" width={45} height={45} alt="More Options" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-start w-fit border border-purple-600 rounded-lg overflow-hidden">
          {/* Users Tab */}
          <button
            className={`px-4 py-2 text-sm md:text-base font-medium transition ${activeTab === "Users"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
              }`}
            onClick={() => setActiveTab("Users")}
          >
            Users
          </button>

          {/* Verification Requests Tab */}
          <button
            className={`px-4 py-2 text-sm md:text-base font-medium transition ${activeTab === "Verification Requests"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
              }`}
            onClick={() => setActiveTab("Verification Requests")}
          >
            Verification Requests
          </button>
        </div>

        {/* Table for Larger Screens */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  User
                  <Input
                    placeholder="Filter Name"
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    className="mt-2"
                  />
                  <Input
                    placeholder="Filter Username"
                    value={filters.username}
                    onChange={(e) =>
                      handleFilterChange("username", e.target.value)
                    }
                    className="mt-2"
                  />
                </TableHead>
                <TableHead>
                  Phone Number
                  <Input
                    placeholder="Filter Phone"
                    value={filters.phone}
                    onChange={(e) => handleFilterChange("phone", e.target.value)}
                    className="mt-2"
                  />
                </TableHead>
                <TableHead>
                  Status
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange("status", value)}
                    className="mt-2"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead>
                  Subscription
                  <Select
                    value={filters.subscription}
                    onValueChange={(value) =>
                      handleFilterChange("subscription", value)
                    }
                    className="mt-2"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="Subscribed">Subscribed</SelectItem>
                      <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {user.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {user.username}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {user.phone}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <button onClick={() => setIsOpen(!isOpen)}>
                        <Image
                          src="/Vector.svg"
                          width={20}
                          height={20}
                          alt="Action"
                        />
                      </button>
                      {isOpen && (
                        <VerificationRequest
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Cards for Smaller Screens */}
        <div className="block md:hidden space-y-4 overflow-x-auto">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-gray-800 font-medium">
                    {user.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {user.username}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  Phone: {user.phone}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p>Status: {getStatusBadge(user.status)}</p>
                  <p>
                    Subscription: {getSubscriptionBadge(user.subscription)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <button className="p-2 bg-gray-100 rounded-full">
                  <Image
                    src="/Vector.svg"
                    width={25}
                    height={25}
                    alt="Action"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTable;