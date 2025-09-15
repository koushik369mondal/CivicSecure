import React, { useState, useEffect } from "react";
import { FaSearch, FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle, FaFileAlt, FaMapMarkerAlt, FaUser, FaCalendarAlt } from 'react-icons/fa';
import Layout from './Layout';

const statusSteps = [
    { label: "Pending", color: "bg-yellow-500", icon: FaClock },
    { label: "In Review", color: "bg-blue-500", icon: FaExclamationTriangle },
    { label: "Resolved", color: "bg-green-500", icon: FaCheckCircle },
];

const TrackStatus = () => {
    const [complaintId, setComplaintId] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');
    const [submittedComplaints, setSubmittedComplaints] = useState([]);

    // Load submitted complaints from localStorage
    useEffect(() => {
        loadSubmittedComplaints();
    }, []);

    const loadSubmittedComplaints = () => {
        try {
            const complaints = localStorage.getItem('submittedComplaints');
            if (complaints) {
                setSubmittedComplaints(JSON.parse(complaints));
            }
        } catch (error) {
            console.error('Error loading submitted complaints:', error);
        }
    };

    // Enhanced mock status data with more realistic data
    const mockStatus = {
        "12345": {
            id: "CMP-2025-012345",
            title: "Pothole near Market Road causing traffic issues",
            category: "Infrastructure",
            status: "In Review",
            priority: "High",
            lastUpdate: "2025-09-12",
            submittedDate: "2025-09-10",
            department: "Municipal Corporation - Road Department",
            reporterType: "Verified",
            location: "Market Road, near Bus Stand, Sector 15",
            description: "Large pothole causing traffic congestion and vehicle damage. Multiple complaints received from residents.",
            estimatedResolution: "2025-09-20",
            assignedOfficer: "Mr. Rajesh Kumar",
            history: [
                {
                    step: "Pending",
                    date: "2025-09-10",
                    time: "10:30 AM",
                    remark: "Complaint filed successfully via online portal. Complaint ID generated and confirmation sent.",
                    officer: "System"
                },
                {
                    step: "In Review",
                    date: "2025-09-12",
                    time: "2:15 PM",
                    remark: "Assigned to field officer for inspection. Site visit scheduled within 48 hours.",
                    officer: "Dept. Coordinator"
                },
            ],
        },
        "67890": {
            id: "CMP-2025-067890",
            title: "Street Light not working - Safety concern",
            category: "Safety",
            status: "Resolved",
            priority: "Medium",
            lastUpdate: "2025-09-10",
            submittedDate: "2025-09-08",
            department: "Electricity Board - Public Lighting Division",
            reporterType: "Anonymous",
            location: "Main Street, Block A, Residential Area",
            description: "Street light pole #45 not functioning for past week. Area becomes very dark at night causing safety concerns.",
            estimatedResolution: "2025-09-10",
            assignedOfficer: "Ms. Priya Sharma",
            actualResolution: "2025-09-10",
            history: [
                {
                    step: "Pending",
                    date: "2025-09-08",
                    time: "6:45 PM",
                    remark: "Complaint registered via mobile app. Photos attached showing non-functional street light.",
                    officer: "System"
                },
                {
                    step: "In Review",
                    date: "2025-09-09",
                    time: "9:00 AM",
                    remark: "Technical team dispatched for inspection. Faulty bulb and wiring issues identified.",
                    officer: "Technical Supervisor"
                },
                {
                    step: "Resolved",
                    date: "2025-09-10",
                    time: "4:30 PM",
                    remark: "Street light repaired and tested. New LED bulb installed. Area properly illuminated now.",
                    officer: "Field Technician"
                },
            ],
        },
        "54321": {
            id: "CMP-2025-054321",
            title: "Garbage collection delay - Hygiene issue",
            category: "Environment",
            status: "Pending",
            priority: "Medium",
            lastUpdate: "2025-09-14",
            submittedDate: "2025-09-14",
            department: "Sanitation Department - Waste Management",
            reporterType: "Pseudonymous",
            location: "Green Valley Apartments, Phase 2",
            description: "Garbage not collected for 4 days. Overflowing bins causing bad smell and attracting pests.",
            estimatedResolution: "2025-09-18",
            assignedOfficer: "Mr. Suresh Yadav",
            history: [
                {
                    step: "Pending",
                    date: "2025-09-14",
                    time: "8:20 AM",
                    remark: "Complaint registered online with photo evidence. Forwarded to sanitation department for immediate action.",
                    officer: "System"
                },
            ],
        },
    };

    const handleTrack = () => {
        if (!complaintId.trim()) {
            setError('Please enter a complaint ID');
            return;
        }

        setLoading(true);
        setError('');
        setStatus(null);

        // Simulate API call
        setTimeout(() => {
            const foundStatus = mockStatus[complaintId.trim()];
            if (foundStatus) {
                setStatus(foundStatus);
            } else {
                setStatus("not-found");
            }
            setLoading(false);
        }, 1500);
    };

    const handleInputChange = (value) => {
        setComplaintId(value);
        setError('');
        if (!value.trim()) {
            setStatus(null);
        }
    };

    // Find the current step index
    const currentStepIndex = status && status !== "not-found"
        ? statusSteps.findIndex((step) => step.label === status.status)
        : -1;

    const getStatusColor = (statusText) => {
        switch (statusText) {
            case "Resolved": return "text-green-600";
            case "In Review": return "text-blue-600";
            case "Pending": return "text-yellow-600";
            default: return "text-gray-600";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "text-red-600 bg-red-50";
            case "Medium": return "text-yellow-600 bg-yellow-50";
            case "Low": return "text-green-600 bg-green-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <Layout>
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <FaSearch className="text-3xl text-emerald-600 mr-3" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Track Complaint Status
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base mt-1">
                            Monitor your complaint progress and get real-time updates
                        </p>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">
                        Enter Complaint Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Complaint ID
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    className={`flex-1 px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your complaint ID (e.g., CMP-2025-012345)"
                                    value={complaintId}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                                />
                                <button
                                    onClick={handleTrack}
                                    disabled={loading || !complaintId.trim()}
                                    className={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center ${loading || !complaintId.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Tracking...
                                        </>
                                    ) : (
                                        <>
                                            <FaSearch className="mr-2" />
                                            Track
                                        </>
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-600 text-sm mt-1 flex items-center">
                                    <FaExclamationTriangle className="mr-1" />
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Example IDs */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-blue-800 text-sm font-medium mb-2">
                                💡 Try these sample complaint IDs:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(mockStatus).map(id => (
                                    <button
                                        key={id}
                                        onClick={() => handleInputChange(id)}
                                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-md font-mono transition-colors duration-200"
                                    >
                                        {mockStatus[id].id}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Results */}
                {status && status !== "not-found" && (
                    <div className="space-y-6">
                        {/* Complaint Overview */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {status.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <FaFileAlt className="mr-1" />
                                            {status.id}
                                        </span>
                                        <span className="flex items-center">
                                            <FaCalendarAlt className="mr-1" />
                                            {status.submittedDate}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(status.status).replace('text-', 'text-')} ${getStatusColor(status.status).replace('text-', 'bg-').replace('-600', '-100')}`}>
                                        {status.status}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(status.priority)}`}>
                                        {status.priority} Priority
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-medium text-gray-900">Category:</span>
                                        <span className="ml-2 text-gray-700">{status.category}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Department:</span>
                                        <span className="ml-2 text-gray-700">{status.department}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Assigned Officer:</span>
                                        <span className="ml-2 text-gray-700">{status.assignedOfficer}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-medium text-gray-900">Reporter Type:</span>
                                        <span className="ml-2 text-gray-700">{status.reporterType}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Last Updated:</span>
                                        <span className="ml-2 text-gray-700">{status.lastUpdate}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Expected Resolution:</span>
                                        <span className="ml-2 text-gray-700">
                                            {status.actualResolution || status.estimatedResolution}
                                            {status.actualResolution && <span className="text-green-600 ml-1">✓</span>}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="mb-2">
                                    <span className="font-medium text-gray-900 flex items-center">
                                        <FaMapMarkerAlt className="mr-1" />
                                        Location:
                                    </span>
                                </div>
                                <p className="text-gray-700 ml-5">{status.location}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="mb-2">
                                    <span className="font-medium text-gray-900">Description:</span>
                                </div>
                                <p className="text-gray-700">{status.description}</p>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h4>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-8">
                                    {statusSteps.map((step, idx) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;

                                        return (
                                            <div key={step.label} className="flex-1 flex flex-col items-center relative">
                                                {/* Step Circle */}
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${isCompleted ? step.color : "bg-gray-300"
                                                        } ${isCurrent ? 'ring-4 ring-offset-2 ring-emerald-200' : ''}`}
                                                >
                                                    <StepIcon className="text-lg" />
                                                </div>

                                                {/* Step Label */}
                                                <span
                                                    className={`mt-2 text-sm font-semibold text-center ${isCompleted ? "text-gray-900" : "text-gray-400"
                                                        }`}
                                                >
                                                    {step.label}
                                                </span>

                                                {/* Connecting Line */}
                                                {idx < statusSteps.length - 1 && (
                                                    <div className="absolute top-6 left-1/2 w-full h-1 bg-gray-300 -z-10">
                                                        <div
                                                            className={`h-1 transition-all duration-500 ${idx < currentStepIndex ? step.color : "bg-gray-300"
                                                                }`}
                                                            style={{
                                                                width: idx < currentStepIndex ? "100%" : "0%",
                                                            }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Status History */}
                        {status.history && (
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Status History</h4>
                                <div className="space-y-4">
                                    {status.history.map((event, idx) => {
                                        const stepInfo = statusSteps.find(step => step.label === event.step);
                                        const StepIcon = stepInfo?.icon || FaCheckCircle;

                                        return (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${stepInfo?.color || 'bg-gray-500'}`}>
                                                    <StepIcon className="text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-semibold text-gray-900">{event.step}</span>
                                                        <div className="text-sm text-gray-600 text-right">
                                                            <div>{event.date}</div>
                                                            <div className="text-xs">{event.time}</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 text-sm mb-2">{event.remark}</p>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <FaUser className="mr-1" />
                                                        Updated by: {event.officer}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Not Found Message */}
                {status === "not-found" && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg flex items-center">
                        <FaExclamationTriangle className="text-2xl mr-3" />
                        <div>
                            <p className="font-semibold">Complaint Not Found</p>
                            <p className="text-sm mt-1">
                                No complaint found with ID "{complaintId}". Please check the ID and try again.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TrackStatus;
