"use client"
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRefundRequests, updateRefundRequestStatus } from '../../../redux/features/refundRequestSlice'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'
import { createRefundRequestColumns } from '../../../components/data-table/refundRequestColumns'

function RefundRequestsContent() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: refundRequests, isLoading, error } = useSelector((state) => {
    return state.refundRequest || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        await dispatch(fetchRefundRequests()).unwrap();
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching refund requests:', error);
        toast.error('Failed to load refund requests');
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(updateRefundRequestStatus({
        id,
        status: 'approved',
        admin_notes: 'Refund approved by admin'
      })).unwrap();
      toast.success('Refund request approved successfully');
    } catch (error) {
      console.error('Error approving refund request:', error);
      toast.error(error?.message || error || 'Failed to approve refund request');
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(updateRefundRequestStatus({
        id,
        status: 'rejected',
        admin_notes: 'Refund rejected by admin'
      })).unwrap();
      toast.success('Refund request rejected successfully');
    } catch (error) {
      console.error('Error rejecting refund request:', error);
      toast.error(error?.message || error || 'Failed to reject refund request');
    }
  };

  // Format refund requests for display - keep original structure for custom columns
  const formattedRefundRequests = refundRequests || [];

  // Show error state if there's an error
  if (error) {
    return (
      <div className='flex flex-col gap-4 w-full h-full items-center justify-center p-8'>
        <div className='text-red-500'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-gray-800'>Failed to Load Refund Requests</h3>
        <p className='text-gray-600 text-center max-w-md'>
          {error?.message || 'An unexpected error occurred while loading the refund requests.'}
        </p>
        <button 
          onClick={() => dispatch(fetchRefundRequests())}
          className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      <DisplayTable
        click={toggleSidebar}
        isOpen={isOpen}
        btnText={null}
        title="Refund Requests"
        link="/admin"
        array={formattedRefundRequests}
        isLoading={isLoading || !isDataLoaded}
        type="refundRequest"
        customColumns={createRefundRequestColumns({ handleApprove, handleReject })}
      />
    </div>
  );
}

export default RefundRequestsContent

