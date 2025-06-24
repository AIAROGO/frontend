// frontend/src/components/patients/PatientDetails.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const PatientDetails = ({ patient }) => {
  const { darkMode } = useTheme();

  if (!patient) {
    return <p className="text-center text-gray-500">No patient selected.</p>;
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
      <div className="flex items-center mb-4">
        <img src={patient.img} alt="Patient" className="h-20 w-20 rounded-full object-cover object-top mr-4" />
        <div>
          <p className="text-lg font-medium">{patient.name}</p>
          <p className="text-sm text-gray-500">{patient.age}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Patient ID</p>
          <p>{patient.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p>{patient.department}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Doctor</p>
          <p>{patient.doctor}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {patient.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
