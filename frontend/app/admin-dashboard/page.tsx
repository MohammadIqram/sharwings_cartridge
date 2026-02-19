"use client";

import Link from "next/link";
import {
  BarChart,
  PlusCircle,
  ShoppingBasket,
  BaggageClaim,
  ReceiptEuroIcon,
  Package,
} from "lucide-react";

const adminLinks = [
  {
    title: "Create Product",
    description: "Add new products to your store",
    href: "/admin-dashboard/product/create",
    icon: PlusCircle,
    color: "green",
  },
  {
    title: "Products",
    description: "View and manage products",
    href: "/admin-dashboard/product",
    icon: ShoppingBasket,
    color: "blue",
  },
  {
    title: "Analytics",
    description: "View sales and revenue analytics",
    href: "/admin-dashboard/analytics",
    icon: BarChart,
    color: "blue",
  },
  {
    title: "Warranty Claims",
    description: "Manage customer warranty claims",
    href: "/admin-dashboard/warranty-claim",
    icon: BaggageClaim,
    color: "red",
  },
  {
    title: "Returns",
    description: "Handle returned orders",
    href: "/admin-dashboard/order/return",
    icon: ReceiptEuroIcon,
    color: "red",
  },
  {
    title: "Orders",
    description: "View and manage customer orders",
    href: "/admin-dashboard/order",
    icon: Package,
    color: "green",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your store, products, orders and analytics in one place.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          const colorStyles = {
            blue: {
              border: "border-blue-200 hover:border-blue-500",
              bgIcon: "bg-blue-100 group-hover:bg-blue-600",
              textIcon: "text-blue-600 group-hover:text-white",
            },
            green: {
              border: "border-green-200 hover:border-green-500",
              bgIcon: "bg-green-100 group-hover:bg-green-600",
              textIcon: "text-green-600 group-hover:text-white",
            },
            red: {
              border: "border-red-200 hover:border-red-500",
              bgIcon: "bg-red-100 group-hover:bg-red-600",
              textIcon: "text-red-600 group-hover:text-white",
            },
          };

          const styles = colorStyles[item.color as keyof typeof colorStyles];

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`group bg-white border ${styles.border} transition-all duration-300 rounded-xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
              >
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full transition mb-6 ${styles.bgIcon}`}
                >
                  <Icon
                    className={`h-7 w-7 transition ${styles.textIcon}`}
                  />
                </div>

                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.title}
                </h2>

                <p className="text-gray-500 text-sm">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
