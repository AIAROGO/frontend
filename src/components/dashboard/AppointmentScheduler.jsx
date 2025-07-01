import React, { useState } from 'react';

const AppointmentScheduler = ({ appointments, setAppointments }) => {
  const [formData, setFormData] = useState({ time: '', patient: '', doctor: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = { ...formData, status: 'Confirmed' };
    setAppointments([...appointments, newAppointment]);
    setFormData({ time: '', patient: '', doctor: '', type: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <input
          type="text"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          placeholder="Time (e.g., 09:00 AM)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={formData.patient}
          onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
          placeholder="Patient Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={formData.doctor}
          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          placeholder="Doctor Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="Appointment Type"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Schedule Appointment
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Doctor</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{appt.time}</td>
              <td className="px-4 py-2">{appt.patient}</td>
              <td className="px-4 py-2">{appt.doctor}</td>
              <td className="px-4 py-2">{appt.type}</td>
              <td className="px-4 py-2">{appt.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentScheduler;