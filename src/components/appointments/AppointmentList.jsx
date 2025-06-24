import React from 'react';

const AppointmentList = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <p className="text-[var(--accent)] text-center text-lg">
        No appointments scheduled.
      </p>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">Scheduled Appointments</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-gray-50">
                <th className="py-3 px-4 text-sm font-medium text-gray-700">Patient</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700">Doctor</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className="border-b border-[var(--border-color)] hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-700">{appointment.patientName}</td>
                  <td className="py-3 px-4 text-gray-700">{appointment.doctorName}</td>
                  <td className="py-3 px-4 text-gray-700">{appointment.date}</td>
                  <td className="py-3 px-4 text-gray-700">{appointment.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;