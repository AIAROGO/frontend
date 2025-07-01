import React from 'react';

const ReportGenerator = () => {
  return (
    <div>
      <h4 className="text-md font-medium mb-2">Daily Report</h4>
      <p>Total Patients: 1,284</p>
      <p>Revenue: $15,000</p>
      <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4">
        Export to PDF
      </button>
    </div>
  );
};

export default ReportGenerator;