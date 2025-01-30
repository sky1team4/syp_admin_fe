"use client"

import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
import UserTable from './mianpart'
import Dashbaord_stats from '../../../components/dashbaord_stats'
import Notification from './notification'

const DashboardPage = () => {
  const [data, setData] = useState([
    
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      
      const response = await fetch('http://localhost:3000/subscription-verification', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log(result);

      setData(result);
      console.log(result);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col md:flex-row gap-5 w-full p-4'>
      {/* <Sidebar /> */}
      <div className='flex flex-col flex-1 gap-3'>
        {/* <Header /> */}
        <Dashbaord_stats title="Today's Summary" data={data} btnText="Export" />
        <UserTable />
      </div>
      {/* <Notification /> */}
    </div>
  )
}

export default DashboardPage
