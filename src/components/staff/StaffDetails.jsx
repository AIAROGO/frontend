// StaffDetails.jsx
import React from 'react';

const StaffDetails = ({ staff }) => {
  if (!staff) {
    return <p className="text-gray-500">No staff details available.</p>;
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold">Name</p>
        <p>{staff.name}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">ID</p>
        <p>{staff.id}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Role</p>
        <p>{staff.role}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Department</p>
        <p>{staff.department}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Status</p>
        <p>{staff.status}</p>
      </div>
    </div>
  );
};

export default StaffDetails;
