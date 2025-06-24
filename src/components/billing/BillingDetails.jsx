import React from 'react';

const BillingDetails = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-medium">Invoice ID</p>
        <p className="text-lg">{invoice.id}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Patient</p>
        <p className="text-lg">{invoice.patient}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Amount</p>
        <p className="text-lg">${invoice.amount}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Date</p>
        <p className="text-lg">{invoice.date}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Status</p>
        <p className="text-lg">{invoice.status}</p>
      </div>
    </div>
  );
};

export default BillingDetails;