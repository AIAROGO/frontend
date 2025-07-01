import React, { useState } from 'react';

const EHRView = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState(patients[0] || {});
  const [ehrData, setEhrData] = useState({ notes: '', diagnosis: '', prescription: '' });

  const handleChange = (e) => {
    setEhrData({ ...ehrData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <select onChange={(e) => setSelectedPatient(patients.find(p => p.id === e.target.value))} className="mb-4 p-2 border rounded">
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>{patient.name}</option>
        ))}
      </select>
      <div className="space-y-4">
        <textarea
          name="notes"
          value={ehrData.notes}
          onChange={handleChange}
          placeholder="Medical Notes"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="diagnosis"
          value={ehrData.diagnosis}
          onChange={handleChange}
          placeholder="Diagnosis"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="prescription"
          value={ehrData.prescription}
          onChange={handleChange}
          placeholder="Prescription"
          className="w-full p-2 border rounded"
        />
        <input type="file" className="w-full p-2 border rounded" />
      </div>
    </div>
  );
};

export default EHRView;