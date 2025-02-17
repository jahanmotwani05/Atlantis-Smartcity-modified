import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FIRFormData {
  complainantName: string;
  contactNumber: string;
  email: string;
  incidentDate: string;
  incidentLocation: string;
  incidentType: string;
  description: string;
  witnesses: string;
  evidence: string;
}

const FIRForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FIRFormData>({
    complainantName: '',
    contactNumber: '',
    email: '',
    incidentDate: '',
    incidentLocation: '',
    incidentType: 'theft',
    description: '',
    witnesses: '',
    evidence: ''
  });

  const incidentTypes = [
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'fraud', label: 'Fraud' },
    { value: 'cybercrime', label: 'Cybercrime' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'property_damage', label: 'Property Damage' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your backend API
    // For now, we'll just show a success message
    alert('Your FIR has been submitted successfully. A police officer will contact you shortly.');
    navigate('/emergency');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <span className="text-2xl text-white font-light">Online FIR Filing</span>
              <button
                onClick={() => navigate('/emergency')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Emergency Services
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto pt-20 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-white mb-6">File a First Information Report (FIR)</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="complainantName"
                    value={formData.complainantName}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Incident Date and Time *</label>
                  <input
                    type="datetime-local"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Incident Type *</label>
                  <select
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {incidentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Incident Location *</label>
                <input
                  type="text"
                  name="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the location where the incident occurred"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Detailed Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide a detailed description of the incident..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Witnesses (if any)</label>
                <textarea
                  name="witnesses"
                  value={formData.witnesses}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Names and contact information of any witnesses..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Evidence Description</label>
                <textarea
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe any evidence you have (photos, videos, documents)..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/emergency')}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Submit FIR
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FIRForm;