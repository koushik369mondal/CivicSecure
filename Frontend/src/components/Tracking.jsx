import React, { useState } from "react";
import { FaSearch, FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
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

    // Dummy status data (later you can fetch from backend API)
    const mockStatus = {
        "12345": {
            id: "12345",
            title: "Pothole near Market Road",
            status: "In Review",
            lastUpdate: "2025-09-12",
            department: "Municipal Corporation",
            history: [
                { step: "Pending", date: "2025-09-10", remark: "Complaint filed successfully" },
                { step: "In Review", date: "2025-09-12", remark: "Assigned to field officer for inspection" },
            ],
        },
        "67890": {
            id: "67890",
            title: "Street Light not working",
            status: "Resolved",
            lastUpdate: "2025-09-10",
            department: "Electricity Board",
            history: [
                { step: "Pending", date: "2025-09-08", remark: "Complaint filed successfully" },
                { step: "In Review", date: "2025-09-09", remark: "Inspection scheduled and completed" },
                { step: "Resolved", date: "2025-09-10", remark: "Street light repaired and tested" },
            ],
        },
        "54321": {
            id: "54321",
            title: "Garbage collection delay",
            status: "Pending",
            lastUpdate: "2025-09-14",
            department: "Sanitation Department",
            history: [
                { step: "Pending", date: "2025-09-14", remark: "Complaint registered and pending review" },
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

    return (
        <Layout>
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <FaSearch className="text-3xl text-emerald-600 mr-3" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Track Complaint Status
                    </h1>
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
                                    placeholder="Enter your complaint ID (e.g., 12345)"
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
                                <p className="text-red-600 text-sm mt-1">{error}</p>
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
                                        {id}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Results */}
                {status && status !== "not-found" && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
                        {/* Complaint Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Complaint Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium text-gray-900">Complaint ID:</span>
                                    <span className="ml-2 font-mono text-gray-900">{status.id}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Current Status:</span>
                                    <span className={`ml-2 font-semibold ${getStatusColor(status.status)}`}>
                                        {status.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Department:</span>
                                    <span className="ml-2 text-gray-700">{status.department}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Last Updated:</span>
                                    <span className="ml-2 text-gray-700">{status.lastUpdate}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="font-medium text-gray-900">Issue:</span>
                                <p className="mt-1 text-gray-700">{status.title}</p>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h4>
                            <div className="relative">
                                <div className="flex items-center justify-between">
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
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Status History</h4>
                                <div className="space-y-4">
                                    {status.history.map((event, idx) => {
                                        const stepInfo = statusSteps.find(step => step.label === event.step);
                                        const StepIcon = stepInfo?.icon || FaCheckCircle;

                                        return (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${stepInfo?.color || 'bg-gray-500'}`}>
                                                    <StepIcon className="text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-gray-900">{event.step}</span>
                                                        <span className="text-sm text-gray-600">{event.date}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{event.remark}</p>
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
