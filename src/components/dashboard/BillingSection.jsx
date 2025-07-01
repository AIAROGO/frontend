import React, { useState } from 'react';

const BillingSection = ({ patients }) => {
  const [bills, setBills] = useState([]);
  const [billData, setBillData] = useState({ patientId: '', charge: '', status: 'Pending' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBill = { ...billData, id: `B-${Date.now()}`, date: new Date().toLocaleDateString() };
    setBills([...bills, newBill]);
    setBillData({ patientId: '', charge: '', status: 'Pending' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <select
          value={billData.patientId}
          onChange={(e) => setBillData({ ...billData, patientId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>{patient.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={billData.charge}
          onChange={(e) => setBillData({ ...billData, charge: e.target.value })}
          placeholder="Charge Amount"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Charge
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Charge</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => {
            const patient = patients.find(p => p.id === bill.patientId);
            return (
              <tr key={bill.id}>
                <td className="px-4 py-2">{patient ? patient.name : 'Unknown'}</td>
                <td className="px-4 py-2">{bill.charge}</td>
                <td className="px-4 py-2">{bill.status}</td>
                <td className="px-4 py-2">{bill.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillingSection;