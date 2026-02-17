
export default function PrivacyPolicy () {

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-blue-100 text-lg">We are committed to protecting your privacy and ensuring you have a positive experience on our website.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Key Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 11a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Your Data is Our First Priority</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">We understand the importance of your personal information. Every data point you share with us is treated with utmost care and respect. Your trust is the foundation of our relationship with you.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Data is 100% Secure</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">Your data is protected with military-grade encryption and the latest security protocols. We use industry-standard SSL certificates and secure servers to ensure your information remains safe from unauthorized access.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Data is NOT Shared</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">Your personal information will never be shared with third parties without your explicit consent. We respect your privacy completely and keep your data confidential at all times.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-amber-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">100% Genuine Website</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">We are a legitimate, authorized business operating with complete transparency. All our operations comply with international data protection regulations and industry standards.</p>
                    </div>
                </div>

                {/* Detailed Policy Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <section className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-1 h-8 bg-blue-600 mr-4"></span>
                            Information We Collect
                        </h2>
                        <div className="ml-4 space-y-3 text-gray-700">
                            <p className="flex items-start">
                                <span className="text-blue-600 mr-3 mt-1">•</span>
                                <span><strong>Personal Information:</strong> Name, email address, phone number, and mailing address</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-blue-600 mr-3 mt-1">•</span>
                                <span><strong>Payment Information:</strong> Credit card details and transaction history (processed securely through encrypted channels)</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-blue-600 mr-3 mt-1">•</span>
                                <span><strong>Usage Information:</strong> Browser type, IP address, pages visited, and time spent on our site</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-blue-600 mr-3 mt-1">•</span>
                                <span><strong>Device Information:</strong> Device identifiers and operating system information</span>
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-1 h-8 bg-green-600 mr-4"></span>
                            How We Use Your Information
                        </h2>
                        <div className="ml-4 space-y-3 text-gray-700">
                            <p className="flex items-start">
                                <span className="text-green-600 mr-3 mt-1">•</span>
                                <span>To process and fulfill your orders and transactions</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-green-600 mr-3 mt-1">•</span>
                                <span>To send you order confirmations, updates, and customer support communications</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-green-600 mr-3 mt-1">•</span>
                                <span>To improve our website functionality and user experience</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-green-600 mr-3 mt-1">•</span>
                                <span>To prevent fraudulent activities and enhance security</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-green-600 mr-3 mt-1">•</span>
                                <span>To send promotional offers (only with your consent)</span>
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-1 h-8 bg-purple-600 mr-4"></span>
                            Data Security Measures
                        </h2>
                        <div className="ml-4 space-y-3 text-gray-700">
                            <p className="flex items-start">
                                <span className="text-purple-600 mr-3 mt-1">•</span>
                                <span>SSL/TLS encryption for all data transmissions</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-purple-600 mr-3 mt-1">•</span>
                                <span>Secure servers with firewalls and intrusion detection systems</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-purple-600 mr-3 mt-1">•</span>
                                <span>Regular security audits and vulnerability assessments</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-purple-600 mr-3 mt-1">•</span>
                                <span>Access controls and authentication mechanisms</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-purple-600 mr-3 mt-1">•</span>
                                <span>Regular data backups and disaster recovery procedures</span>
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-1 h-8 bg-amber-600 mr-4"></span>
                            Your Rights and Choices
                        </h2>
                        <div className="ml-4 space-y-3 text-gray-700">
                            <p className="flex items-start">
                                <span className="text-amber-600 mr-3 mt-1">•</span>
                                <span>Right to access your personal information</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-amber-600 mr-3 mt-1">•</span>
                                <span>Right to correct or update your information</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-amber-600 mr-3 mt-1">•</span>
                                <span>Right to delete your account and associated data</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-amber-600 mr-3 mt-1">•</span>
                                <span>Right to opt-out of marketing communications</span>
                            </p>
                            <p className="flex items-start">
                                <span className="text-amber-600 mr-3 mt-1">•</span>
                                <span>Right to data portability</span>
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-1 h-8 bg-red-600 mr-4"></span>
                            Contact Us
                        </h2>
                        <p className="text-gray-700 mb-4">If you have any questions or concerns about our privacy practices, please contact us:</p>
                        <div className="bg-slate-50 rounded-lg p-6 space-y-2">
                            <p className="flex items-center text-gray-700">
                                <span className="font-semibold mr-2">Email:</span>
                                <a href="mailto:sharwings@outlook.com" className="text-blue-600 hover:underline">sharwings@outlook.com</a>
                            </p>
                            <p className="flex items-center text-gray-700">
                                <span className="font-semibold mr-2">Address:</span>
                                <span>Sharwings Support Center</span>
                            </p>
                            <p className="flex items-center text-gray-700">
                                <span className="font-semibold mr-2">Response Time:</span>
                                <span>We respond to all inquiries within 48 hours</span>
                            </p>
                        </div>
                    </section>

                    {/* Last Updated */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                        <p className="text-gray-700">
                            <span className="font-semibold">Last Updated:</span> November 13, 2025
                        </p>
                        <p className="text-gray-600 mt-2 text-sm">
                            We may update this privacy policy from time to time. Please check back regularly for any changes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Spacing */}
            <div className="py-8"></div>
        </div>
    )
}