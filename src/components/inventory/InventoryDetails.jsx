import React from 'react';

const InventoryDetails = ({ item }) => {
  if (!item) return null;

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-medium">Item Name</p>
        <p className="text-lg">{item.name}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">ID</p>
        <p className="text-lg">{item.id}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Quantity</p>
        <p className="text-lg">{item.quantity}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Category</p>
        <p className="text-lg">{item.category}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Status</p>
        <p className="text-lg">{item.status}</p>
      </div>
    </div>
  );
};

export default InventoryDetails;