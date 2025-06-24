import React, { useState } from 'react';

const AppointmentForm = ({ onAddAppointment }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.doctorName && formData.date && formData.time) {
      onAddAppointment(formData);
      setFormData({
        patientName: '',
        doctorName: '',
        date: '',
        time: ''
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">Schedule New Appointment</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[var(--border-color)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Enter patient name"
              required
            />
          </div>
          <div>
            <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
              Doctor Name
            </label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[var(--border-color)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Enter doctor name"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[var(--border-color)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[var(--border-color)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[var(--accent)] text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;