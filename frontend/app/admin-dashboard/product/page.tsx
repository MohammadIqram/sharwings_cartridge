"use client";

import { motion } from "framer-motion";
import { Trash, Star, EllipsisVertical } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/imageUtils";
import { useEffect, useState } from "react";
import EditProductModal from "@/components/admin/EditProductForm";
import { toast } from "sonner";

const ProductsList = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const openEditModal = (product: any) => {
    setEditProduct(product);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
          { credentials: "include" }
        );
        const data = await response.json();
        setProducts(data.products);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch the products");
      }
    };

    fetchAllProducts();
  }, []);

  const handleSave = async ({id, form} : {id: string, form: any}) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/id/${id}`,
        {
          method: "post",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        const newProductList = products.filter((product) => product.id === id);
        setProducts(newProductList);
        toast.success("Product updated successfully");
        closeModal();
        return;
      }
      toast.error("Error updating the product");
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`,
        { method: "delete", credentials: "include" }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully");
        return;
      }
      toast.error("Error deleting the product");
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
    }
  };

  const toggleFeaturedProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`,
        { method: "patch", credentials: "include" }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p
          )
        );
        toast.success("Product featured status updated");
        return;
      }
      toast.error("Error updating featured status");
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg overflow-x-auto max-w-7xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Products Dashboard
      </h2>
      <p className="text-gray-600 mb-6">
        Manage all products in your store. Edit details, mark as featured, or delete items.
      </p>

      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Sale Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Featured
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {products?.map((product) => (
            <tr key={product.id} className="hover:bg-blue-50 transition">
              {/* Product */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={getOptimizedImageUrl(product.image, { width: 80 })}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xl text-wrap">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>

              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">₹{product.price.toFixed(2)}</div>
              </td>

              {/* Sale Price */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  ₹{product.salePrice?.toFixed(2)}
                </div>
              </td>

              {/* Quantity */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{product.quantity} Units</div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{product.category}</div>
              </td>

              {/* Featured */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product.id)}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    product.isFeatured
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title={product.isFeatured ? "Featured" : "Mark as Featured"}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete Product"
                >
                  <Trash className="h-5 w-5" />
                </button>

                {/* Edit Dropdown */}
                <div
                  onMouseEnter={() => setOpenMenuId(product.id)}
                  onMouseLeave={() => setOpenMenuId(null)}
                  className="relative"
                >
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-600">
                    <EllipsisVertical className="h-5 w-5" />
                  </button>

                  {openMenuId === product.id && (
                    <div className="absolute -top-2 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                      <ul>
                        <li
                          onClick={() => openEditModal(product)}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
                        >
                          Edit Product
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditProductModal
        isOpen={isModalOpen}
        product={editProduct}
        onClose={closeModal}
        onSave={handleSave}
      />
    </motion.div>
  );
};

export default ProductsList;
