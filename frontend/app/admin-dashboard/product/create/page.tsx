"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const categories = ["fans", "ledlights", "switches-and-sockets", "wires"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    image: "",
    quantity: 0,
    closeOut: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Product created successfully.");
        setNewProduct({
          name: "",
          description: "",
          price: "",
          salePrice: "",
          category: "",
          image: "",
          closeOut: false,
          quantity: 0,
        });
        return;
      }

      toast.error(data.message || "Error creating product");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 150 * 1024) {
      toast.error("Image size should be less than 150KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result as any });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">
          Create New Product
        </h1>
        <p className="text-gray-600">
          Add a new product to your store inventory. Ensure pricing, stock,
          and category details are correct before publishing.
        </p>
      </div>

      {/* Form Container */}
      <motion.div
        className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* Image Tip */}
        <div className="mb-6 flex items-start gap-3 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <AlertTriangle className="text-blue-500 mt-1" size={20} />
          <span className="text-blue-800 text-sm">
            <strong>Tip:</strong> Images smaller than 150KB load faster and improve user experience.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Price & Sale Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Price</label>
              <input
                type="number"
                value={newProduct.salePrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, salePrice: e.target.value })
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value as any })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Clearance */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={newProduct.closeOut}
              onChange={(e) =>
                setNewProduct({ ...newProduct, closeOut: e.target.checked })
              }
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Mark as Clearance Sale</label>
          </div>

          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="image"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Upload size={18} />
              Upload Image
            </label>
            {newProduct.image && (
              <span className="text-sm text-green-600">Image uploaded ✓</span>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {loading && <Spinner data-icon="inline-start" />}
            Create Product
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProductForm;
