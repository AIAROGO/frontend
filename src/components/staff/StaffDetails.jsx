import React from 'react';

const StaffDetails = ({ staff }) => {
  if (!staff) return null;

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-medium">Name</p>
        <p className="text-lg">{staff.name}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">ID</p>
        <p className="text-lg">{staff.id}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Role</p>
        <p className="text-lg">{staff.role}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Department</p>
        <p className="text-lg">{staff.department}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Status</p>
        <p className="text-lg">{staff.status}</p>
      </div>
    </div>
  );
};

export default StaffDetails;