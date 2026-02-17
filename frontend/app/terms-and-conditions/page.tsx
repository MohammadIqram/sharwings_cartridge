export default function TermsOfService() {

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-16">
				<div className="max-w-4xl mx-auto px-4">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
					<p className="text-indigo-100 text-lg">Please read these terms carefully before using our services.</p>
				</div>
			</div>

			{/* Feature Cards */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
					<div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
								<svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800">Delivery Within 5 to 7 Days</h3>
						</div>
						<p className="text-gray-600">We aim to deliver your orders within 5 to 7 business days from shipment. Delivery times may vary based on location and shipping availability.</p>
					</div>

					<div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-emerald-600 hover:shadow-xl transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mr-4">
								<svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.414L14.414 9 11 12.414 8.586 10 11 7.586z" clipRule="evenodd" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800">Products Are 100% Genuine</h3>
						</div>
						<p className="text-gray-600">All items sold through our website are authentic and sourced from authorized suppliers. We guarantee product authenticity and quality.</p>
					</div>

					<div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-600 hover:shadow-xl transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mr-4">
								<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 2a1 1 0 01.894.553l3 6A1 1 0 0114 10H6a1 1 0 01-.894-1.447l3-6A1 1 0 0110 2z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800">Compliance Issues Resolved Firmly</h3>
						</div>
						<p className="text-gray-600">We handle any compliance, warranty, or legal issues promptly and fairly. Our support team will work with you to resolve disputes in accordance with these terms.</p>
					</div>

					<div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-rose-600 hover:shadow-xl transition-shadow">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mr-4">
								<svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M6 2a1 1 0 00-1 1v1h10V3a1 1 0 00-1-1H6zM4 7v7a3 3 0 003 3h6a3 3 0 003-3V7H4z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800">No Return After 7 Days of Delivery</h3>
						</div>
						<p className="text-gray-600">Returns are accepted within 7 days of delivery only. After 7 days, products are not eligible for return unless required by law.</p>
					</div>
				</div>

				{/* Detailed Terms Sections */}
				<div className="space-y-8">
					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
						<p className="text-gray-700">By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">2. Orders and Payments</h2>
						<div className="text-gray-700 space-y-2">
							<p>All orders are subject to availability and confirmation of the order price. We use secure payment processors and do not store full payment card details on our servers.</p>
							<p>Prices and offers may change without notice; confirmed orders will be honored at the price at the time of purchase.</p>
						</div>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">3. Shipping & Delivery</h2>
						<div className="text-gray-700 space-y-2">
							<p>We strive to deliver within 5 to 7 business days from shipment. Delivery estimates are not guaranteed and may be affected by carrier delays or external factors.</p>
							<p>Risk of loss passes to you upon delivery to the carrier for shipment.</p>
						</div>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">4. Returns & Refunds</h2>
						<div className="text-gray-700 space-y-2">
							<p>Products may be returned within 7 days of delivery if they are unused and in original condition. To initiate a return, contact our support team with your order details.</p>
							<p>Refunds will be processed after we receive and inspect the returned item. Returns initiated after 7 days may be denied, except where consumer law provides otherwise.</p>
						</div>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">5. Product Authenticity</h2>
						<p className="text-gray-700">We guarantee that all products sold on this website are genuine and sourced from authorized suppliers. If you suspect an authenticity issue, notify us immediately for investigation and resolution.</p>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">6. Compliance & Dispute Resolution</h2>
						<p className="text-gray-700">We address compliance issues firmly and fairly. If disputes arise, contact our support; unresolved disputes may be escalated to mediation or legal channels as appropriate.</p>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">7. Limitation of Liability</h2>
						<p className="text-gray-700">To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from the use of our services.</p>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">8. Changes to Terms</h2>
						<p className="text-gray-700">We may update these Terms from time to time. Changes will be posted on this page with an updated "Last Updated" date.</p>
					</section>

					<section className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Us</h2>
						<p className="text-gray-700">For questions about these Terms, contact us at <a href="mailto:sharwings@outlook.com" className="text-cyan-600 hover:underline">sharwings@outlook.com</a>. We aim to respond within 48 hours.</p>
					</section>

					<div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 rounded-lg">
						<p className="text-gray-700"><strong>Last Updated:</strong> November 13, 2025</p>
						<p className="text-gray-600 mt-2 text-sm">By using our services after changes are posted, you accept the updated Terms.</p>
					</div>
				</div>
			</div>

			<div className="py-8"></div>
		</div>
	)
}