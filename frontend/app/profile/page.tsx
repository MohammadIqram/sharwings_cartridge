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
import { useUserStore } from "../../stores/useUserStore";

type MenuItemType = "account" | "orders" | "returns" | "claims" | "billing" | "help" | "delete";

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
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const { navigate } = useNavigation();
  const [orderHistory, setOrderHistory] = useState<any>([]);
  const [copied, setCopied] = useState('');

  const { user, updateUser } = useUserStore();

  // State for different account sections
  const [profileData, setProfileData] = useState({
    name: user?.name,
  });
  const [editingProfile, setEditingProfile] = useState(false);

  // State for email change
  const [emailState, setEmailState] = useState({
    currentEmail: user?.email,
    newEmail: "",
    password: "",
    otp: "",
    showOtpField: false,
    isSubmittingEmail: false,
  });

  // State for password change
  const [passwordState, setPasswordState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    isSubmittingPassword: false,
  });

  // State for billing & address
  const [billingAddress, setBillingAddress] = useState({
    fullName: user?.address?.fullName,
    phone: user?.address?.phone,
    streetAddress: user?.address?.street,
    city: user?.address?.city,
    state: user?.address?.state,
    zipCode: user?.address?.zipCode,
    isDefault: true,
  });
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempAddressData, setTempAddressData] = useState({ ...billingAddress });

  useEffect(() => {
    setProfileData((prev) => ({...prev, name: user?.name}));
    setEmailState((prev) => ({ ...prev, currentEmail: user?.email }));
    setBillingAddress((prev) => ({...prev, 
      fullName: user?.address?.fullName ?? prev.fullName,
      phone: user?.address?.phone ?? prev.phone,
      streetAddress: user?.address?.street ?? prev.streetAddress,
      city: user?.address?.city ?? prev.city,
      state: user?.address?.state ?? prev.state,
      zipCode: user?.address?.zipCode ?? prev.zipCode,
    }))
  }, [user]);

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

  // profileInformation
  const handleProfileInformation = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/profile`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(profileData)
          },
        );
        const data = await response.json();
        if (response.ok && data && data.success) {
          toast.success('Full name updated successfully');
          updateUser({ name: profileData.name });
          setEditingProfile(false);
          return;
        }
        toast.error(data.message || "some unexpected error occured.");
      } catch (error: any) {
        console.log(error);
        toast.error(
          "failed to update the fullname, ",
          error.message || error?.response?.data?.message,
        );
      }
  };

  const handlePasswordChange = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/profile/change-password`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(passwordState)
          },
        );
        const data = await response.json();
        if (response.ok && data && data.success) {
          toast.success('password updated successfully');
          return;
        }
        toast.error(data.message || "some error occured. Please try later.");
      } catch (error: any) {
        console.log(error);
        toast.error(
          "failed to update your account password. If the issue persists, please contact support. ",
          error.message || error?.response?.data?.message,
        );
      }
  }

  const addCustomerBillingAddress = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/profile/billing-address`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tempAddressData)
          },
        );
        const data = await response.json();
        if (response.ok && data && data.success) {
          setBillingAddress(tempAddressData);
          setEditingAddress(false);
          toast.success('Billing address updated successfully');
          return;
        }
        toast.error(data.message || "some error occured. Please try later.");
      } catch (error: any) {
        console.log(error);
        toast.error(
          "failed to update your billing address. If the issue persists, please contact support. ",
          error.message || error?.response?.data?.message,
        );
      }
  }

  const menuItems = [
    { id: "account" as const, label: "Account", icon: "👤" },
    { id: "orders" as const, label: "Orders", icon: "📦" },
    { id: "returns" as const, label: "Return & Exchange", icon: "🔄" },
    { id: "claims" as const, label: "Claim Warranty", icon: "⚙️" },
    { id: "billing" as const, label: "Billing & Address", icon: "📍" },
    { id: "help" as const, label: "Help & Support", icon: "❓" },
    {
      id: "delete" as const,
      label: "Delete Account",
      icon: "🗑️",
      isDanger: true,
    },
  ];

  const renderBillingSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Billing & Address</h2>
        <Separator className="mb-8" />
      </div>

      {/* Current Saved Address Block */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Saved Address</h3>
            <p className="text-sm text-gray-600">
              This is your default address for orders and billing.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">{billingAddress.fullName}</p>
                <p className="text-sm text-gray-600">Phone: {billingAddress.phone}</p>
              </div>
              {billingAddress.isDefault && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                  Default
                </span>
              )}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">{billingAddress.streetAddress}</p>
              <p className="text-sm text-gray-600">
                {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Update Address Block */}
      <Card className="p-6 bg-indigo-50 border-indigo-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Update Address</h3>
            <p className="text-sm text-gray-600">
              Modify your billing and shipping address information.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        
        {!editingAddress ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">Ready to update your address?</p>
            <Button
              onClick={() => {
                setEditingAddress(true);
                setTempAddressData({ ...billingAddress });
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={tempAddressData.fullName}
                  onChange={(e) => setTempAddressData({ ...tempAddressData, fullName: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={tempAddressData.phone}
                  onChange={(e) => setTempAddressData({ ...tempAddressData, phone: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street Address *</label>
              <Input
                type="text"
                placeholder="Enter street address"
                value={tempAddressData.streetAddress}
                onChange={(e) => setTempAddressData({ ...tempAddressData, streetAddress: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <Input
                  type="text"
                  placeholder="Enter city"
                  value={tempAddressData.city}
                  onChange={(e) => setTempAddressData({ ...tempAddressData, city: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <Input
                  type="text"
                  placeholder="Enter state"
                  value={tempAddressData.state}
                  onChange={(e) => setTempAddressData({ ...tempAddressData, state: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zip Code *</label>
                <Input
                  type="text"
                  placeholder="Enter zip code"
                  value={tempAddressData.zipCode}
                  onChange={(e) => setTempAddressData({ ...tempAddressData, zipCode: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="setDefault"
                checked={tempAddressData.isDefault}
                onChange={(e) => setTempAddressData({ ...tempAddressData, isDefault: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="setDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                Set as default address
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={addCustomerBillingAddress}
                className="bg-green-600 hover:bg-green-700 flex-1"
                disabled={!tempAddressData.fullName || !tempAddressData.phone || !tempAddressData.streetAddress || !tempAddressData.city || !tempAddressData.state || !tempAddressData.zipCode}
              >
                Save Address
              </Button>
              <Button
                onClick={() => {
                  setEditingAddress(false);
                  setTempAddressData({ ...billingAddress });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <Separator className="mb-8" />
      </div>

      {/* Profile Information Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <p className="text-sm text-gray-600">
              Update your personal information including name, phone, and address.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!editingProfile}
              className="w-full"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2">Member Since</label>
            <Input
              type="text"
              value={userData.createdAt}
              disabled
              className="w-full bg-gray-50"
            />
          </div> */}
        </div>

        <div className="flex gap-2 pt-4">
          {!editingProfile ? (
            <Button
              onClick={() => setEditingProfile(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleProfileInformation}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setEditingProfile(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Email Change Section */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Change Email Address</h3>
            <p className="text-sm text-gray-600">
              Update your email address. You'll need to verify that the new email belongs to you by entering an OTP sent to your new email.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Email</label>
            <Input
              type="email"
              value={emailState.currentEmail}
              disabled
              className="w-full bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Email Address *</label>
            <Input
              type="email"
              placeholder="Enter your new email address"
              value={emailState.newEmail}
              onChange={(e) => setEmailState({ ...emailState, newEmail: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">A verification will be sent to this email.</p>
          </div>

          {!emailState.showOtpField && (
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <Input
                type="password"
                placeholder="Enter your account password"
                value={emailState.password}
                onChange={(e) => setEmailState({ ...emailState, password: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">We need your password to verify this change.</p>
            </div>
          )}

          {emailState.showOtpField && (
            <div>
              <label className="block text-sm font-medium mb-2">Verification OTP *</label>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP sent to your new email"
                value={emailState.otp}
                onChange={(e) => setEmailState({ ...emailState, otp: e.target.value.slice(0, 6) })}
                maxLength={6}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Check your new email for the verification code.</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          {!emailState.showOtpField ? (
            <Button
              onClick={() => setEmailState({ ...emailState, showOtpField: true })}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!emailState.newEmail || !emailState.password || emailState.isSubmittingEmail}
            >
              {emailState.isSubmittingEmail ? "Sending..." : "Send Verification Code"}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  // Handle OTP verification
                  console.log("Verifying OTP:", emailState.otp);
                }}
                className="bg-green-600 hover:bg-green-700"
                disabled={!emailState.otp || emailState.isSubmittingEmail}
              >
                {emailState.isSubmittingEmail ? "Verifying..." : "Verify & Update Email"}
              </Button>
              <Button
                onClick={() => setEmailState({ ...emailState, showOtpField: false, otp: "" })}
                variant="outline"
              >
                Back
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Password Change Section */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
            <p className="text-sm text-gray-600">
              Ensure your account is protected with a strong, unique password.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password *</label>
            <Input
              type="password"
              placeholder="Enter your current password"
              value={passwordState.oldPassword}
              onChange={(e) => setPasswordState({ ...passwordState, oldPassword: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password *</label>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password *</label>
            <Input
              type="password"
              placeholder="Re-enter your new password"
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* Password Criteria */}
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Password Requirements</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-lg ${passwordState.newPassword.length >= 8 ? "text-green-500" : "text-gray-300"}`}>
                ✓
              </span>
              <span className="text-sm text-gray-600">At least 8 characters long</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${/[A-Z]/.test(passwordState.newPassword) ? "text-green-500" : "text-gray-300"}`}>
                ✓
              </span>
              <span className="text-sm text-gray-600">Contains at least one uppercase letter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${/[a-z]/.test(passwordState.newPassword) ? "text-green-500" : "text-gray-300"}`}>
                ✓
              </span>
              <span className="text-sm text-gray-600">Contains at least one lowercase letter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${/[0-9]/.test(passwordState.newPassword) ? "text-green-500" : "text-gray-300"}`}>
                ✓
              </span>
              <span className="text-sm text-gray-600">Contains at least one number</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${/[!@#$%^&*]/.test(passwordState.newPassword) ? "text-green-500" : "text-gray-300"}`}>
                ✓
              </span>
              <span className="text-sm text-gray-600">Contains at least one special character (!@#$%^&*)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${passwordState.newPassword === passwordState.confirmPassword && passwordState.newPassword ? "text-green-500" : "text-gray-300"}`}>
                ✓
              </span>
              <span className="text-sm text-gray-600">Passwords match</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handlePasswordChange}
            className="bg-orange-600 hover:bg-orange-700"
            disabled={
              !passwordState.oldPassword || 
              !passwordState.newPassword || 
              !passwordState.confirmPassword ||
              passwordState.newPassword !== passwordState.confirmPassword ||
              passwordState.newPassword.length < 8 ||
              !/[A-Z]/.test(passwordState.newPassword) ||
              !/[a-z]/.test(passwordState.newPassword) ||
              !/[0-9]/.test(passwordState.newPassword) ||
              !/[!@#$%^&*]/.test(passwordState.newPassword) ||
              passwordState.isSubmittingPassword
            }
          >
            {passwordState.isSubmittingPassword ? "Updating..." : "Update Password"}
          </Button>
          <Button
            onClick={() => setPasswordState({ oldPassword: "", newPassword: "", confirmPassword: "", isSubmittingPassword: false })}
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </Card>
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
          We offer a 07-day return policy for all items. Items must be unused
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
              You have 07 days from purchase date
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

  const renderClaimWarrantySection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Claim Warranty</h2>
        <Separator className="mb-6" />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">Warranty Coverage</h3>
        <p className="text-sm text-green-800">
          All our products come with a comprehensive warranty. Coverage includes
          manufacturing defects and malfunctions. Warranty period varies by product.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Active Warranty Claims</h3>
          <p className="text-gray-500">No active warranty claims</p>
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 w-full cursor-pointer"
          onClick={() => navigate("/claim-warranty")}
        >
          Initiate Warranty Claim
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-semibold">Warranty Information</h3>
        <div className="space-y-3">
          <div className="border rounded-lg p-3">
            <p className="font-medium text-sm">
              What is covered under warranty?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Manufacturing defects, hardware failures, and component malfunctions
              are covered. Physical damage and normal wear are not included.
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="font-medium text-sm">
              How do I file a warranty claim?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Visit our warranty claim page with your order number and product details.
              Our team will review and process your claim within 5-7 business days.
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="font-medium text-sm">
              What are the warranty terms?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Warranty coverage begins from the date of purchase and varies by product.
              Check your product documentation for specific warranty duration.
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
      case "claims":
        return renderClaimWarrantySection();
      case "billing":
        return renderBillingSection();
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
