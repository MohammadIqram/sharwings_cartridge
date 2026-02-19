"use client";

import { motion } from "framer-motion";
import { EllipsisVertical, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TableSkeleton from "@/components/common/TableSkeleton";

const OrderReturnAdminDashboard = () => {
  const [ordersReturn, setOrdersReturn] = useState<any[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReturnedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/returns`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Could not fetch orders");

        setOrdersReturn(data?.orders);
      } catch (error: any) {
        toast.error(error.message || "Could not fetch orders");
      } finally {
        setLoading(false);
      }
    };

    getReturnedProducts();
  }, []);

  const handleOrderStatusChange = async (e: any) => {
    const target = e.currentTarget;
    const orderId = target.dataset.orderid;
    const status = target.dataset.id;
    if (!orderId || !status) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/return/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to approve return request");
      toast.success(data.msg || "Return request updated");

      setOrdersReturn((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, returnRequest: { ...order.returnRequest, status } }
            : order
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update return request");
    } finally {
      setLoading(false);
      setOpenMenuId(null);
    }
  };

  if (loading && !ordersReturn.length) return <TableSkeleton />;

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg overflow-x-auto max-w-7xl mx-auto border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50">
          <tr>
            {["Ordered Products", "Name", "Email", "Total Amount", "Placed At", "Return", "Status", "Actions"].map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {ordersReturn.map((order) => (
            <tr key={order.id} className="hover:bg-blue-50">
              <td className="px-6 py-4 text-sm text-gray-700">
                {order.products?.map((product: any) => (
                  <div key={product?.product?.id} className="mb-1">
                    <span className="font-semibold">{product?.product?.name}</span> <span className="text-gray-400">(x{product?.quantity})</span>
                  </div>
                ))}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">{order.user?.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{order.user?.email}</td>
              <td className="px-6 py-4 text-sm text-gray-700">₹{order.totalAmount}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{order.createdAt?.split("T")[0]}</td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {order.returnRequest ? (
                  <>
                    <p>{order.returnRequest.reason}</p>
                    <p>{order.returnRequest.description}</p>
                    <p>
                      <span className="font-bold uppercase">Raised at:</span>{" "}
                      {order.returnRequest.requestedAt?.split("T")[0]}
                    </p>
                  </>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>

              <td className={`px-6 py-4 text-sm font-medium ${order.returnRequest?.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.returnRequest?.status || 'Pending'}
              </td>

              <td className="px-6 py-4 text-sm font-medium">
                <div
                  onMouseEnter={() => setOpenMenuId(order.id)}
                  onMouseLeave={() => setOpenMenuId(null)}
                  className="inline-block relative"
                >
                  <button className="text-blue-600 hover:text-blue-800">
                    <EllipsisVertical className="h-5 w-5" />
                  </button>

                  {openMenuId === order.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-blue-50 border border-blue-300 rounded shadow-lg z-50">
                      <ul>
                        {loading && <Loader className="h-5 w-5 animate-spin mx-auto my-2 text-blue-600" />}
                        <li
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-blue-800 capitalize"
                          data-orderid={order.id}
                          data-id="Approved"
                          onClick={handleOrderStatusChange}
                        >
                          approve
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
    </motion.div>
  );
};

export default OrderReturnAdminDashboard;
