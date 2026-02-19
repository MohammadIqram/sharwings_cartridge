"use client";

import { motion } from "framer-motion";
import { EllipsisVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TableSkeleton from "@/components/common/TableSkeleton";

const OrdersTable = () => {
  const [ordersReturn, setOrdersReturn] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const getReturnedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/orders-all?page=${page}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (data && data.success) {
          setOrdersReturn(data.orders);
          if (page === 1) setTotalPages(data.totalPages);
          return;
        }
        toast.error(data.message || "Failed to fetch orders");
      } catch (error: any) {
        toast.error(error?.message || "Could not fetch orders");
      } finally {
        setLoading(false);
      }
    };

    getReturnedProducts();
  }, [page]);

  const handleOrderStatusChange = async (e: any) => {
    const orderId = e.target.dataset?.orderid;
    const newStatus = e.target.dataset?.id;
    if (!orderId) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/status/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to update status");
      toast.success(data.msg || "Status updated successfully");

      setOrdersReturn((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to change status. Try again later.");
    } finally {
      setLoading(false);
      setOpenMenuId(null);
    }
  };

  if (loading) return <TableSkeleton />;

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
            {[
              "Ordered Products",
              "Name",
              "Email",
              "Total Amount",
              "Placed At",
              "Return",
              "Payment Mode",
              "Address",
              "Status",
              "Actions",
            ].map((col) => (
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
                {order.products?.map((p: any) => (
                  <div key={p.product?._id} className="mb-1">
                    <span className="font-semibold">{p.product?.name}</span> <span className="text-gray-400">(x{p.quantity})</span>
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

              <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMode || "N/A"}</td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {order.address ? (
                  <>
                    {order.address.name}, {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zip}
                    <br />
                    {order.address.phone}
                  </>
                ) : (
                  "N/A"
                )}
              </td>

              <td className={`px-6 py-4 text-sm font-medium ${order.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
                {order.status}
              </td>

              <td className="px-6 py-4 text-sm font-medium">
                <div
                  onMouseEnter={() => setOpenMenuId(order._id)}
                  onMouseLeave={() => setOpenMenuId(null)}
                  className="inline-block relative"
                >
                  <button
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EllipsisVertical className="h-5 w-5" />
                  </button>

                  {openMenuId === order._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-blue-50 border border-blue-300 rounded shadow-lg z-50">
                      <ul>
                        {["pending", "processed", "shipped", "delivered", "cancelled"].map((status) => (
                          <li
                            key={status}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-blue-800 capitalize"
                            data-orderid={order.id}
                            data-id={status}
                            onClick={handleOrderStatusChange}
                          >
                            {status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 py-4 bg-blue-50 border-t border-blue-100">
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default OrdersTable;
