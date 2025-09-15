import React, { useState } from "react";
import Layout from "./Layout";

function ComplaintForm() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [reporterType, setReporterType] = useState("anonymous");
  const [attachments, setAttachments] = useState([]);

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted!");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Submit a Complaint</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="w-full">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-900">
                Category
              </span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="safety">Safety</option>
              <option value="theft">Theft</option>
              <option value="civic">Civic Issue</option>
              <option value="disaster">Disaster</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-900">
                Description
              </span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 min-h-[120px]"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-900">
                Location
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter address or GPS coordinates"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-900">
                Reporter Type
              </span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
              value={reporterType}
              onChange={(e) => setReporterType(e.target.value)}
              required
            >
              <option value="anonymous">Anonymous</option>
              <option value="pseudonymous">Pseudonymous</option>
              <option value="verified">Verified (Aadhaar)</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-900">
                Attachments
              </span>
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              multiple
              onChange={handleAttachmentChange}
            />
            {attachments.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {attachments.length} file(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto">
              Submit Complaint
            </button>
          </div>
        </form>
        </div>
      </div>
    </Layout>
  );
}

export default ComplaintForm;
