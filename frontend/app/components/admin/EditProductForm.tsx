"use client";

import { useState, useEffect } from "react";

interface EditProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onSave: (updatedProduct: any) => void;
}

const EditProductModal = ({ isOpen, product, onClose, onSave }: any) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    quantity: 0,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        salePrice: product.salePrice || "",
        quantity: product.quantity || 0,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: product.id, form });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 border border-blue-100">
        <h2 className="text-2xl font-semibold text-blue-800 mb-5">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price & Sale Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cut-off Price</label>
              <input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
