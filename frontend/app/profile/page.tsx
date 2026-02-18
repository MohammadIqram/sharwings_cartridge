"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/components/hooks/useNavigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

type MenuItemType = "account" | "orders" | "returns" | "help" | "delete";

type TrackingStage = {
  id: string;
  label: string;
  icon: string;
  timestamp: string;
  completed: boolean;
};

type Order = {
  id: string;
  date: string;
  total: string;
  status:
    | "Placed"
    | "Dispatched"
    | "In Transit"
    | "Out for Delivery"
    | "Delivered";
  items: number;
  trackingStages: TrackingStage[];
};

// Add animations to head
const animationStyles = `
  @keyframes pulse-dot {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
  }

  .pulse-dot {
    animation: pulse-dot 2s infinite;
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-up {
    animation: slide-up 0.5s ease-out;
  }

  @keyframes line-draw {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: 100px;
      opacity: 1;
    }
  }

  .line-draw {
    animation: line-draw 0.6s ease-out;
  }
`;

export default function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState<MenuItemType>("account");
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const { navigate } = useNavigation();
  const [orderHistory, setOrderHistory] = useState<any>([]);
  const [copied, setCopied] = useState('');

  // Sample user data - replace with actual user data from your store
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main Street, City, State 12345",
    createdAt: "2024-01-15",
  });

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/history?page=${ordersPage}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        if (response.ok && data && data.success) {
          setOrderHistory(data.orders);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(
          "failed to fetch order history, ",
          error.message || error?.response?.data?.message,
        );
      }
    };

    getOrders();
  }, [ordersPage]);

  const handleCopyOrderId = async (orderId: string) => {
    try {
        await navigator.clipboard.writeText(orderId);
        setCopied(orderId);

        setTimeout(() => setCopied(''), 2000);
    } catch (error: any) {
        toast.error('error when copying order ID, please check the browser permissions and try again.');
    }
  }

  const menuItems = [
    { id: "account" as const, label: "Account", icon: "👤" },
    { id: "orders" as const, label: "Orders", icon: "📦" },
    { id: "returns" as const, label: "Return & Exchange", icon: "🔄" },
    { id: "help" as const, label: "Help & Support", icon: "❓" },
    {
      id: "delete" as const,
      label: "Delete Account",
      icon: "🗑️",
      isDanger: true,
    },
  ];

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <Separator className="mb-6" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            disabled={!isEditing}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            disabled={!isEditing}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input
            type="tel"
            value={userData.phone}
            onChange={(e) =>
              setUserData({ ...userData, phone: e.target.value })
            }
            disabled={!isEditing}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <Input
            type="text"
            value={userData.address}
            onChange={(e) =>
              setUserData({ ...userData, address: e.target.value })
            }
            disabled={!isEditing}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Member Since</label>
          <Input
            type="text"
            value={userData.createdAt}
            disabled
            className="w-full bg-gray-50"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setIsEditing(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                // Reset to original values if needed
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const renderOrdersSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
        <Separator className="mb-6" />
      </div>

      <div className="space-y-4">
        {orderHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          orderHistory?.map((order: any) => (
            <div key={order.id}>
              {/* Order Header Card */}
              <Card
                className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  {/* Order ID */}
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-semibold truncate">{order.id}
                        <button
                        button-id={`copy-${order.id}`}
                        onClick={handleCopyOrderId.bind(null, order.id)}
                        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                        >
                        {copied === order.id ? (
                            <>
                            <Check size={16} className="text-green-600" />
                            <span className="text-sm text-green-600">Copied</span>
                            </>
                        ) : (
                            <>
                            <Copy size={16} />
                            <span className="text-sm">Copy</span>
                            </>
                        )}
                        </button>
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Items Count */}
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-semibold">
                      {order.orderItems.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0,
                      )}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-semibold">₹{order.totalAmount}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <span
                      className={`text-2xl transition-transform duration-300 ${
                        expandedOrder === order.id ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>
              </Card>

              {/* Expanded Section */}
              {expandedOrder === order.id && (
                <div className="mt-4 p-6 bg-white border-2 border-t-0 border-blue-300 rounded-b-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="font-semibold text-lg mb-6">Order Details</h3>

                  {/* Products */}
                  <div className="space-y-4">
                    {order.products.map((item: any) => (
                      <div key={item.product.id} className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.address.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.address.street}, {order.address.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.address.state} - {order.address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {order.address.phone}
                    </p>
                  </div>

                  {/* Return Info (If Requested) */}
                  {order.isReturnRequested && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-700 mb-2">
                        Return Requested
                      </p>
                      <p className="text-sm text-red-600">
                        Reason: {order.returnReason}
                      </p>
                      <p className="text-sm text-red-600">
                        Description: {order.returnDescription}
                      </p>
                      <p className="text-sm text-red-600">
                        Status: {order.returnStatus}
                      </p>
                      <p className="text-sm text-red-600">
                        Requested At: {order.returnRequestedAt}
                      </p>
                        <p className="text-sm text-red-600">
                        Processed At: {order.returnProcessedAt || 'order under review'}
                        </p>
                    </div>
                  )}

                  {/* Tracking Timeline - Expandable */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 p-6 bg-white border-2 border-t-0 border-blue-300 rounded-b-lg animate-in fade-in slide-in-from-top-2 duration-300">
                      <h3 className="font-semibold text-lg mb-8">
                        Order Tracking
                      </h3>

                      {/* Timeline */}
                      <div className="space-y-0">
                        {order.trackingStages?.map((stage: any, index: number) => (
                          <div key={stage.id} className="flex gap-6">
                            {/* Timeline Line and Circle */}
                            <div className="flex flex-col items-center">
                              {/* Circle with Icon */}
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all duration-500 ${
                                  stage.completed
                                    ? "bg-green-500 scale-100 shadow-lg"
                                    : "bg-gray-300 scale-90"
                                }`}
                              >
                                {stage.icon}
                              </div>

                              {/* Vertical Line */}
                              {index < order.trackingStages.length - 1 && (
                                <div
                                  className={`w-1 flex-grow transition-all duration-700 ${
                                    order.trackingStages[index + 1].completed
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                  style={{ minHeight: "80px" }}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="pb-12 flex-grow">
                              <div className="pt-1">
                                <h4
                                  className={`font-semibold text-base transition-colors duration-300 ${
                                    stage.completed
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {stage.label}
                                </h4>
                                <p
                                  className={`text-sm mt-2 transition-colors duration-300 ${
                                    stage.completed
                                      ? "text-gray-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {stage.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Details */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Estimated Delivery
                            </p>
                            <p className="font-semibold text-gray-900">
                              {order.status === "Delivered"
                                ? "Delivered"
                                : "Feb 20, 2025"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Tracking Number
                            </p>
                            <p className="font-semibold text-gray-900">
                              TRK{order.id.slice(-4)}789456
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-3">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          Track Shipment
                        </Button>
                        {order.status === "Delivered" && (
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            Download Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="order-pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setOrdersPage((prev) => Math.max(1, prev - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {ordersPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setOrdersPage((prev) => prev + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );

  const renderReturnsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Return & Exchange</h2>
        <Separator className="mb-6" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Return Policy</h3>
        <p className="text-sm text-blue-800">
          We offer a 30-day return policy for all items. Items must be unused
          and in original packaging.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Recent Returns</h3>
          <p className="text-gray-500">No active returns</p>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full cursor-pointer"
          onClick={() => navigate("/return-form")}
        >
          Request a Return or Exchange
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <div className="border rounded-lg p-3">
            <p className="font-medium text-sm">
              How long do I have to return an item?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You have 30 days from purchase date
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="font-medium text-sm">
              What is your exchange process?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Contact support and we'll help you exchange for a different size
              or color
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
        <Separator className="mb-6" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">📚 Knowledge Base</h3>
          <p className="text-sm text-gray-600">
            Browse frequently asked questions
          </p>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">💬 Contact Us</h3>
          <p className="text-sm text-gray-600">
            Get in touch with our support team
          </p>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">🐛 Report a Bug</h3>
          <p className="text-sm text-gray-600">
            Help us improve by reporting issues
          </p>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">🎓 Tutorials</h3>
          <p className="text-sm text-gray-600">Learn how to use our platform</p>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Direct Support</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Email: support@example.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone: +1 (800) 123-4567</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hours: Mon-Fri, 9AM-5PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeleteSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h2>
        <Separator className="mb-6" />
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-red-900 mb-2">⚠️ Danger Zone</h3>
        <p className="text-sm text-red-800">
          Deleting your account is permanent and cannot be undone. All your data
          will be lost.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Before you go...</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Your orders history will be deleted</li>
            <li>✓ Your wishlist will be cleared</li>
            <li>✓ Your profile information will be removed</li>
            <li>✓ You won't be able to recover this account</li>
          </ul>
        </div>

        <div className="pt-4">
          <label className="flex items-center gap-3 mb-4">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">
              I understand that this action cannot be undone
            </span>
          </label>
          <Button className="bg-red-600 hover:bg-red-700 w-full">
            Delete My Account Permanently
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "account":
        return renderAccountSection();
      case "orders":
        return renderOrdersSection();
      case "returns":
        return renderReturnsSection();
      case "help":
        return renderHelpSection();
      case "delete":
        return renderDeleteSection();
      default:
        return renderAccountSection();
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account and preferences
            </p>
          </div>

          {/* Main Layout - Sidebar + Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <nav className="space-y-2 sticky top-8">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeMenu === item.id
                        ? "bg-blue-600 text-white shadow-md"
                        : item.isDanger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 lg:col-span-4">
              <Card className="p-8 bg-white">{renderContent()}</Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
