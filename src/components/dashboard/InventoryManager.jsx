import React, { useState } from 'react';

const InventoryManager = ({ inventory, setInventory }) => {
  const [formData, setFormData] = useState({ item: '', stock: '', threshold: '', expiry: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setInventory([...inventory, formData]);
    setFormData({ item: '', stock: '', threshold: '', expiry: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <input
          type="text"
          value={formData.item}
          onChange={(e) => setFormData({ ...formData, item: e.target.value })}
          placeholder="Item Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          placeholder="Stock Level"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={formData.threshold}
          onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
          placeholder="Reorder Threshold"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={formData.expiry}
          onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Item
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Threshold</th>
            <th className="px-4 py-2">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{item.item}</td>
              <td className="px-4 py-2">{item.stock}</td>
              <td className="px-4 py-2">{item.threshold}</td>
              <td className="px-4 py-2">{item.expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;