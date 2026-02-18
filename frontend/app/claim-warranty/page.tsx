"use client";

import { useState } from "react";
import { Image as ImageIcon, TriangleAlert, Loader } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ClaimWarrantyForm() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    address: "",
    reason: "",
    phone: "",
    photo: "",
  });

  const handlePhotoChange = (e: any) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev : any) => ({ ...prev, photo: reader.result }));
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.productName.trim() === "" || form.reason.trim() === "") {
      toast("Please fill out all required fields.");
      return;
    } else if (!photo) {
      toast("Please upload a photo of the product.");
      return;
    }

    try {
      setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/warranty/claim`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
        const data = await response.json();
        if (response.ok && data.success) {
            setForm({ productName: "", reason: "", address: "", photo: "", phone: "" });
            setPhoto(null);
            setPhotoPreview(null);
            toast.success("Warranty claim submitted successfully!");
            return;
        }
        toast.error(data.message || "Failed to submit warranty claim. Please try again.");
    } catch (err: any) {
      toast.error(err?.reponse?.data?.message || err.message || "Failed to submit warranty claim. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative overflow-hidden py-12 px-4 md:px-16 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        {/* Info Section */}
        <motion.div
          className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
            Warranty Claim Center
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-2">
            At Sharwings, we stand behind the quality of our products. If you
            experience any issues covered under warranty, you can easily submit
            a claim below.
          </p>
          <ul className="text-gray-600 text-base md:text-lg list-disc list-inside mx-auto md:mx-0 max-w-xl mb-2">
            <li className="mb-1">
              Warranty covers manufacturing defects and hardware failures.
            </li>
            <li className="mb-1">
              Provide a clear photo and describe the issue in detail.
            </li>
            <li>
              Our support team will review your claim and respond within 3-5 business days.
            </li>
          </ul>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow">
            Need help? Contact{" "}
            <a href="mailto:sharwings@outlook.com" className="underline">
              sharwings@outlook.com
            </a>
          </span>
        </motion.div>

        {/* Form Section */}
        <motion.div
          className="w-full md:w-1/2 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-xl font-bold text-blue-700 mb-6">Claim Warranty</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="productName"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
                value={form.productName}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Contact number</label>
              <input
                type="tel"
                name="phone"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your contact number"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Upload Photo</label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="photo-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition text-blue-700 font-semibold shadow"
                >
                  <ImageIcon size={20} className="text-blue-500" />
                  {photo ? "Change Photo" : "Choose Photo"}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg shadow border border-blue-100"
                  />
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <textarea
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={4}
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Reason for Claim</label>
              <textarea
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Describe the issue or reason for warranty claim"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button
              disabled={loading}
              type="submit"
              size="lg"
              className="cursor-pointer flex justify-center items-center w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading && <Spinner data-icon="inline-start" />}
              Submit Claim
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
