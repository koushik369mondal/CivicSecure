import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaMapMarkerAlt,
  FaPaperclip,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaUser,
  FaEye,
  FaShieldAlt
} from "react-icons/fa";
import Layout from "./Layout";

const COMPLAINT_DRAFT_KEY = 'complaintDraft';
const DRAFT_DURATION = 30 * 60 * 1000; // 30 minutes for drafts

function ComplaintForm({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    location: "",
    reporterType: "anonymous"
  });
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const categories = [
    { value: "safety", label: "Public Safety", icon: "🚨", description: "Street lights, safety hazards, emergency situations" },
    { value: "infrastructure", label: "Infrastructure", icon: "🏗️", description: "Roads, bridges, public buildings" },
    { value: "environment", label: "Environment", icon: "🌱", description: "Pollution, waste management, cleanliness" },
    { value: "traffic", label: "Traffic & Transport", icon: "🚦", description: "Traffic signals, parking, public transport" },
    { value: "utilities", label: "Utilities", icon: "💡", description: "Water, electricity, gas, internet services" },
    { value: "civic", label: "Civic Services", icon: "🏛️", description: "Government services, documentation" },
    { value: "health", label: "Public Health", icon: "🏥", description: "Healthcare facilities, sanitation" },
    { value: "other", label: "Other", icon: "📋", description: "Any other civic issue" }
  ];

  const reporterTypes = [
    {
      value: "anonymous",
      label: "Anonymous",
      icon: FaUser,
      description: "Submit without revealing identity",
      color: "text-gray-600"
    },
    {
      value: "pseudonymous",
      label: "Pseudonymous",
      icon: FaEye,
      description: "Submit with contact info but hidden publicly",
      color: "text-blue-600"
    },
    {
      value: "verified",
      label: "Verified (Aadhaar)",
      icon: FaShieldAlt,
      description: "Submit with Aadhaar verification",
      color: "text-emerald-600"
    }
  ];

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft();
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formData, attachments]);

  // Load saved draft
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(COMPLAINT_DRAFT_KEY);
      if (saved) {
        const draftData = JSON.parse(saved);
        const now = new Date().getTime();
        const savedTime = new Date(draftData.timestamp).getTime();

        if (now - savedTime < DRAFT_DURATION) {
          setFormData({
            category: draftData.category || "",
            description: draftData.description || "",
            location: draftData.location || "",
            reporterType: draftData.reporterType || "anonymous"
          });
        } else {
          localStorage.removeItem(COMPLAINT_DRAFT_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  // Save draft
  const saveDraft = () => {
    if (formData.description.trim() || formData.location.trim() || formData.category) {
      const draftData = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(COMPLAINT_DRAFT_KEY, JSON.stringify(draftData));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(COMPLAINT_DRAFT_KEY);
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle file attachments
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];
    const newErrors = { ...errors };

    files.forEach((file, index) => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        newErrors.attachments = `File "${file.name}" is too large. Maximum size is 10MB.`;
        return;
      }

      // Validate file type
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats'];
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        newErrors.attachments = `File "${file.name}" type is not supported.`;
        return;
      }

      validFiles.push(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push({
            id: `${file.name}-${Date.now()}-${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            preview: e.target.result
          });
          if (previews.length === validFiles.filter(f => f.type.startsWith('image/')).length) {
            setAttachmentPreviews(prev => [...prev, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        previews.push({
          id: `${file.name}-${Date.now()}-${index}`,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: null
        });
      }
    });

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      delete newErrors.attachments;
    }

    setErrors(newErrors);

    // Add non-image files to previews immediately
    const nonImagePreviews = previews.filter(p => !p.preview);
    if (nonImagePreviews.length > 0) {
      setAttachmentPreviews(prev => [...prev, ...nonImagePreviews]);
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Please select a complaint category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please provide the location details';
    }

    if (formData.reporterType === 'verified') {
      // Check if Aadhaar is verified
      const aadhaarVerification = localStorage.getItem('aadhaarVerification');
      if (!aadhaarVerification) {
        newErrors.reporterType = 'Please verify your Aadhaar first to use verified reporting';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate complaint ID
      const complaintId = `CMP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      // Clear draft after successful submission
      clearDraft();

      setSubmitSuccess(true);

      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        if (setCurrentPage) {
          setCurrentPage('dashboard');
        }
      }, 3000);

    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ submit: 'Failed to submit complaint. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <Layout>
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Complaint Submitted Successfully!</h2>
            <p className="text-green-700 mb-4">Your complaint has been registered and assigned a tracking ID.</p>
            <p className="text-sm text-green-600">Redirecting to dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaFileAlt className="text-3xl text-emerald-600 mr-3" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Submit a Complaint
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Report civic issues and help improve your community
            </p>
          </div>
          {draftSaved && (
            <div className="ml-auto text-sm text-emerald-600 flex items-center">
              <FaCheckCircle className="mr-1" />
              Draft saved
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Complaint Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${formData.category === cat.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">{cat.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{cat.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Complaint Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the issue. Include when it occurred, what happened, and any other relevant details..."
                  className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[120px] ${errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <p className="text-red-600 text-sm flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {formData.description.length} characters (minimum 20 required)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <FaMapMarkerAlt className="inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter specific address, landmark, or GPS coordinates"
                className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.location}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                💡 Tip: Be as specific as possible to help authorities locate the issue quickly
              </p>
            </div>
          </div>

          {/* Reporter Type */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reporting Preference</h2>
            <div className="space-y-3">
              {reporterTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${formData.reporterType === type.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="reporterType"
                      value={type.value}
                      checked={formData.reporterType === type.value}
                      onChange={(e) => handleInputChange('reporterType', e.target.value)}
                      className="hidden"
                    />
                    <IconComponent className={`text-xl mr-3 ${type.color}`} />
                    <div>
                      <div className="font-semibold text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.reporterType && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                {errors.reporterType}
              </p>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <FaPaperclip className="inline mr-2" />
              Attachments (Optional)
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors duration-200">
              <input
                type="file"
                multiple
                onChange={handleAttachmentChange}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FaPaperclip className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Click to upload files</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported: Images, Videos, PDFs, Documents (Max 10MB each)
                </p>
              </label>
            </div>

            {errors.attachments && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                {errors.attachments}
              </p>
            )}

            {/* File Previews */}
            {attachmentPreviews.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Uploaded Files:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attachmentPreviews.map((file, index) => (
                    <div key={file.id} className="border border-gray-200 rounded-lg p-3 relative">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <FaFileAlt className="text-4xl text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {errors.submit && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => setCurrentPage && setCurrentPage('dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                  }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 inline-block" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ComplaintForm;
