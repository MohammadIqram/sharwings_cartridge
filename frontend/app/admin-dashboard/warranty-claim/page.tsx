"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getOptimizedImageUrl } from "@/lib/imageUtils";
import { toast } from "sonner";

export default function WarrantyClaimsAdminDashboard() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    const getWarrantyTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/warranty/claim/dashboard`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Failed to fetch warranty claims");
        setClaims(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch warranty claims");
      }
    };

    getWarrantyTickets();
  }, []);

  const handleProductWarrentyStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const row = e.currentTarget.closest("tr");
    const claimId = row?.getAttribute("data-claimid");
    const status = e.currentTarget.value;
    if (!claimId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/warranty/claim/${claimId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to update claim status");

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim._id === claimId ? { ...claim, status } : claim
        )
      );
      toast.success("Claim status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update claim status");
    } finally {
      e.currentTarget.blur();
    }
  };

  // Helper: Status color mapping
  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
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
        Warranty Claims Dashboard
      </h2>
      <p className="text-gray-600 mb-6">
        Manage warranty claims submitted by customers. Update statuses as needed.
      </p>

      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Raised At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {claims?.map((claim) => (
            <tr
              key={claim.id}
              data-claimid={claim.id}
              className="hover:bg-blue-50 transition"
            >
              {/* Product */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={getOptimizedImageUrl(claim.imageUrl, { width: 80 })}
                      alt={claim.productName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {claim.productName}
                    </div>
                  </div>
                </div>
              </td>

              {/* Customer Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{claim.user?.name}</div>
              </td>

              {/* Customer Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{claim.user?.email}</div>
              </td>

              {/* Raised At */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {claim.createdAt?.split("T")[0]}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="inline-block relative w-full max-w-[150px]">
                  <select
                    value={claim.status}
                    onChange={handleProductWarrentyStatus}
                    className={`w-full px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium ${getStatusClass(
                      claim.status
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
