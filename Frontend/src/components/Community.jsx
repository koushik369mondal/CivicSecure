import React, { useState } from "react";
import { FaPlus, FaArrowLeft, FaUsers, FaThumbsUp, FaThumbsDown, FaCamera } from "react-icons/fa";
import Layout from './Layout';
import potholeImg from "../../src/assets/potholes.webp";
import garbageImg from "../../src/assets/garbage.webp";
import streetlightImg from "../../src/assets/street.webp";
import waterloggingImg from "../../src/assets/Water.webp";

const communities = [
    {
        id: 1,
        name: "Cleanliness",
        description: "Discuss and report issues related to public cleanliness.",
        members: "42K members",
        icon: "🧹",
    },
    {
        id: 2,
        name: "Traffic",
        description: "Traffic problems, solutions, and road safety discussions.",
        members: "38K members",
        icon: "🚦",
    },
    {
        id: 3,
        name: "Water Supply",
        description: "Water supply, wastage, and related issues.",
        members: "35K members",
        icon: "💧",
    },
    {
        id: 4,
        name: "Electricity",
        description: "Frequent power cuts, electricity bills & solutions.",
        members: "32K members",
        icon: "⚡",
    },
    {
        id: 5,
        name: "Sanitation",
        description: "Garbage disposal and sanitation improvement ideas.",
        members: "30K members",
        icon: "🗑️",
    },
    {
        id: 6,
        name: "Roads",
        description: "Potholes, broken footpaths & road maintenance.",
        members: "28K members",
        icon: "🛣️",
    },
    {
        id: 7,
        name: "Public Transport",
        description: "Bus, metro, and other public transport concerns.",
        members: "27K members",
        icon: "🚌",
    },
    {
        id: 8,
        name: "Pollution",
        description: "Air, noise, and water pollution discussions.",
        members: "25K members",
        icon: "🏭",
    },
    {
        id: 9,
        name: "Healthcare",
        description: "Access to hospitals, quality of service, and complaints.",
        members: "24K members",
        icon: "🏥",
    },
    {
        id: 10,
        name: "Citizen Safety",
        description: "Street lights, women's safety, and public safety issues.",
        members: "22K members",
        icon: "🛡️",
    },
];

const initialPosts = [
    {
        id: 1,
        title: "Pothole near Market Road causing traffic jams",
        image: potholeImg,
        votes: 14,
        author: "Citizen123",
        timestamp: "2 hours ago",
    },
    {
        id: 2,
        title: "Garbage overflow in Sector 15 park area",
        image: garbageImg,
        votes: 9,
        author: "ConcernedResident",
        timestamp: "5 hours ago",
    },
    {
        id: 3,
        title: "Broken footpath tiles at City Center",
        image: streetlightImg,
        votes: 11,
        author: "SafetyFirst",
        timestamp: "1 day ago",
    },
    {
        id: 4,
        title: "Waterlogging near residential area after rain",
        image: waterloggingImg,
        votes: 7,
        author: "RainwaterWoes",
        timestamp: "2 days ago",
    },
];

export default function Community() {
    const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [posts, setPosts] = useState(initialPosts);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState(null);

    const handleEnterCommunity = (community) => {
        setSelectedCommunity(community);
        setCurrentView('detail');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedCommunity(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setNewImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const newEntry = {
            id: Date.now(),
            title: newPost,
            image: newImagePreview,
            votes: 0,
            author: "You",
            timestamp: "Just now",
        };

        setPosts([newEntry, ...posts]);
        setNewPost("");
        setNewImage(null);
        setNewImagePreview(null);
        setShowCreatePost(false);
    };

    const handleVote = (postId, delta) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, votes: Math.max(0, post.votes + delta) } : post
            )
        );
    };

    const resetForm = () => {
        setNewPost("");
        setNewImage(null);
        if (newImagePreview) {
            URL.revokeObjectURL(newImagePreview);
        }
        setNewImagePreview(null);
        setShowCreatePost(false);
    };

    // Communities List View
    if (currentView === 'list') {
        return (
            <Layout>
                <div className="w-full max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <FaUsers className="text-3xl text-emerald-600 mr-3" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Community Hub
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base mt-1">
                                Browse the most active citizen grievance communities
                            </p>
                        </div>
                    </div>

                    {/* Communities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {communities.map((community, index) => (
                            <div
                                key={community.id}
                                onClick={() => handleEnterCommunity(community)}
                                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="text-2xl bg-emerald-50 p-3 rounded-full">
                                            {community.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-sm">
                                                    #{index + 1}
                                                </span>
                                                <h2 className="font-semibold text-lg text-gray-900">
                                                    {community.name}
                                                </h2>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {community.description}
                                            </p>
                                            <span className="text-sm text-emerald-600 font-medium">
                                                {community.members}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    // Community Detail View
    return (
        <Layout>
            <div className="w-full max-w-4xl mx-auto">
                {/* Community Header */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-32 relative">
                        <button
                            onClick={handleBackToList}
                            className="absolute top-4 left-4 px-4 py-2 bg-white text-emerald-700 hover:bg-gray-50 font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
                        >
                            <FaArrowLeft />
                            Back to Communities
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl bg-emerald-50 p-3 rounded-full">
                                {selectedCommunity?.icon}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {selectedCommunity?.name}
                                </h1>
                                <p className="text-gray-600">
                                    {selectedCommunity?.members} • Active community
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Citizens discussing grievances and working on solutions together.
                        </p>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
                        <button
                            onClick={() => setShowCreatePost(true)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
                        >
                            <FaPlus />
                            New Post
                        </button>
                    </div>

                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                            {post.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">{post.author}</span>
                                            <span className="text-gray-500 text-sm ml-2">{post.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    {post.title}
                                </h3>
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt="Post content"
                                        className="w-full max-h-80 object-cover rounded-lg mb-4"
                                    />
                                )}
                            </div>

                            {/* Vote Section */}
                            <div className="border-t border-gray-200 px-6 py-3">
                                <div className="flex items-center justify-center gap-6">
                                    <button
                                        onClick={() => handleVote(post.id, 1)}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors duration-200"
                                    >
                                        <FaThumbsUp />
                                        <span className="text-sm">Upvote</span>
                                    </button>

                                    <span className="font-semibold text-lg text-gray-900 bg-gray-50 px-3 py-1 rounded-md">
                                        {post.votes}
                                    </span>

                                    <button
                                        onClick={() => handleVote(post.id, -1)}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                                    >
                                        <FaThumbsDown />
                                        <span className="text-sm">Downvote</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Post Modal */}
                {showCreatePost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create a Post</h2>
                                <form onSubmit={handleCreatePost} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Describe your grievance
                                        </label>
                                        <textarea
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            placeholder="Write your grievance or concern..."
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Add Photo (Optional)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="post-image"
                                            />
                                            <label
                                                htmlFor="post-image"
                                                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-md transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                            >
                                                <FaCamera />
                                                Choose Photo
                                            </label>
                                            {newImage && (
                                                <span className="text-sm text-gray-600">{newImage.name}</span>
                                            )}
                                        </div>
                                        {newImagePreview && (
                                            <img
                                                src={newImagePreview}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-lg mt-3"
                                            />
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-md transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
