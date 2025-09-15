import React, { useState } from "react";
import { FaQuestionCircle, FaBook, FaExclamationTriangle, FaPhone, FaEnvelope, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import Layout from './Layout';
import scheme1 from "../../src/assets/scheme1.png";
import scheme2 from "../../src/assets/scheme2.png";
import scheme3 from "../../src/assets/scheme3.png";

const schemes = [
  {
    id: 1,
    title: "PM Awas Yojana",
    description: "Affordable housing scheme for all sections of society.",
    image: scheme1,
  },
  {
    id: 2,
    title: "Digital India",
    description: "Transforming India into a digitally empowered society.",
    image: scheme2,
  },
  {
    id: 3,
    title: "Skill India Mission",
    description: "Enhancing employability through skill development programs.",
    image: scheme3,
  },
];

const infoCards = [
  {
    icon: FaBook,
    title: "User Guide",
    description: "Step-by-step instructions on how to submit complaints, track status, and use all features of CivicSecure.",
    buttonText: "Read Guide",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: FaQuestionCircle,
    title: "FAQs",
    description: "Find answers to commonly asked questions about the grievance redressal process and platform usage.",
    buttonText: "View FAQs",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: FaExclamationTriangle,
    title: "Emergency Protocols",
    description: "Important information about what to do in emergency situations and how to quickly get help.",
    buttonText: "Learn More",
    color: "bg-red-50 text-red-600"
  }
];

export default function InfoHub() {
  const [currentSchemeIndex, setCurrentSchemeIndex] = useState(0);

  const nextScheme = () => {
    setCurrentSchemeIndex((prev) => (prev + 1) % schemes.length);
  };

  const prevScheme = () => {
    setCurrentSchemeIndex((prev) => (prev - 1 + schemes.length) % schemes.length);
  };

  const getVisibleSchemes = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(schemes[(currentSchemeIndex + i) % schemes.length]);
    }
    return visible;
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaInfoCircle className="text-3xl text-emerald-600 mr-3" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Information Hub
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Your comprehensive resource for understanding and using CivicSecure
            </p>
          </div>
        </div>

        {/* Government Schemes Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Latest Government Schemes & Policies
              </h2>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200">
                View All
              </button>
            </div>

            {/* Schemes Carousel */}
            <div className="relative">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={prevScheme}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center"
                  aria-label="Previous schemes"
                >
                  <FaChevronLeft />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 max-w-4xl">
                  {getVisibleSchemes().map((scheme, index) => (
                    <div
                      key={`${scheme.id}-${index}`}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={scheme.image}
                        alt={scheme.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">
                          {scheme.title}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {scheme.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={nextScheme}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center"
                  aria-label="Next schemes"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm text-center">
                <span className="mr-2">💡</span>
                <strong>Tip:</strong> Stay updated with these schemes to unlock benefits for you and your community!
              </p>
            </div>
          </div>
        </section>

        {/* Information Cards Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Access Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full ${card.color} flex items-center justify-center mb-4 mx-auto`}>
                    <IconComponent className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200">
                    {card.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Support Section */}
        <section>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Support */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <FaPhone className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Helpline</h3>
                  <p className="text-gray-600 text-sm">
                    1800-XXX-XXXX <span className="text-gray-500">(Toll-free)</span>
                  </p>
                  <p className="text-gray-500 text-xs">Available 24/7</p>
                </div>
              </div>

              {/* Email Support */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600 text-sm">support@civicsecure.gov.in</p>
                  <p className="text-gray-500 text-xs">Response within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Help Section */}
        <section className="mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Need Additional Help?
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Our support team is here to assist you with any questions or concerns about using CivicSecure.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200">
                  Submit a Support Ticket
                </button>
                <button className="px-6 py-2 border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 font-semibold rounded-md transition-colors duration-200">
                  Live Chat Support
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
