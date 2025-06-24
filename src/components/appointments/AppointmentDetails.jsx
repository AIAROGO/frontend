import React from 'react';

const AppointmentDetails = ({ appointment }) => {
  if (!appointment) {
    return (
      <p className="text-[var(--accent)] text-center text-lg">
        No appointment selected.
      </p>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">Appointment Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-700">Patient Name</span>
            <p className="mt-1 text-gray-900">{appointment.patientName}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Doctor Name</span>
            <p className="mt-1 text-gray-900">{appointment.doctorName}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Date</span>
            <p className="mt-1 text-gray-900">{appointment.date}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Time</span>
            <p className="mt-1 text-gray-900">{appointment.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;