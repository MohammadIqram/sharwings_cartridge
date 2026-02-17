export default function ReturnPolicy() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Return Policy</h1>
          <p className="text-emerald-100 text-lg">Clear returns and refund guidelines to keep you confident while shopping.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-emerald-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3h14v4H3V3zm0 6h10v8H3V9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Return Within 7 Days</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">Initiate returns within 7 days of delivery for eligible items. Items must be unused and in original packaging.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-rose-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">No Return After 7 Days</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">Items are not eligible for return after 7 days of delivery, except where consumer protection laws require otherwise.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Products 100% Genuine</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">We guarantee authenticity for all items. If you suspect a counterfeit, contact us immediately for investigation.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-indigo-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2l2 5h5l-4 3 1 6-5-3-5 3 1-6-4-3h5l2-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Easy Return Process</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">Start a return via our support email with your order number and photos, and we’ll guide you through the next steps.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Window & Eligibility</h2>
            <p className="text-gray-700">Returns must be requested within 7 days of delivery. Eligible items must be unused, with tags attached and in the original packaging. Customized or perishable goods may be non-returnable.</p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Contact our support at <a href="mailto:returns@sharwings.com" className="text-teal-600 hover:underline">returns@sharwings.com</a> with your order number and reason for return.</li>
              <li>Provide photos of the item and packaging when requested.</li>
              <li>Ship the item back to the address we provide after return approval.</li>
            </ol>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Refunds & Timing</h2>
            <p className="text-gray-700">Once we receive and inspect the returned item, approved refunds will be processed to the original payment method within 5-7 business days. Shipping fees are non-refundable unless the return is due to our error.</p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Authenticity & Claims</h2>
            <p className="text-gray-700">All products on our site are authentic. If you have concerns about authenticity, notify us immediately—claims are investigated and resolved firmly and fairly.</p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Exceptions</h2>
            <p className="text-gray-700">Certain items (e.g., intimate goods, perishable items, or clearance items) may not be eligible for return. Any statutory consumer rights remain unaffected.</p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact & Support</h2>
            <p className="text-gray-700">For return inquiries email <a href="mailto:returns@sharwings.com" className="text-teal-600 hover:underline">returns@sharwings.com</a> or call <a href="tel:+91780953951" className="text-teal-600 hover:underline">+91 780953951</a>. We aim to respond within 48 hours.</p>
          </section>

          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-lg">
            <p className="text-gray-700"><strong>Last Updated:</strong> November 13, 2025</p>
            <p className="text-gray-600 mt-2 text-sm">Please review this page regularly; continued use of our services after changes constitutes acceptance of the updated policy.</p>
          </div>
        </div>
      </div>

      <div className="py-8"></div>
    </div>
  );
}