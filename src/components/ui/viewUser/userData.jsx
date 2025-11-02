import React from "react";
import { MdClose } from "react-icons/md";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import defaultProfileImage from "../../../assets/demo.jpg";

const userData = ({ internData, onClose }) => {
  if (!internData) return null;

  console.log("internData is xx  : ", internData);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-32 rounded-t-2xl" />

          <h3 className="absolute top-4 left-6 text-white text-2xl font-semibold">
            Sender Details
          </h3>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Main content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile Image */}
            <div className="relative -mt-20">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-sky-200 flex items-center justify-center ">
                {internData?.userId?.profileImage ? (
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:5000/uploads/${internData.userId.profileImage}`}
                    alt={`${internData.userId.firstName || ""} ${
                      internData.userId.lastName || ""
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfileImage;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-4xl font-bold text-blue-600">
                      {internData?.userId?.firstName?.[0]?.toUpperCase() || "U"}
                      {internData?.userId?.lastName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {`${internData.userId.firstName} ${internData.userId.lastName}`}
              </h2>
              <p className="text-lg text-gray-600 mb-3">
                {internData.designation}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[
              { label: "ID", value: internData._id },
              { label: "Job Role", value: internData.userId.category },
              { label: "Email", value: internData.userId.email },
              { label: "University ", value: internData.userId.university },
              { label: "Contact No", value: internData.userId.contactNumber },
              { label: "Team", value: internData.userId.group },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50  rounded-lg">
                <span className="block text-sm font-medium text-gray-500">
                  {item.label}
                </span>
                <span className="block text-gray-800 break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full mt-10 mb-10 h-fit">
            <span className="block text-sm font-bold text-blue-500 bg-blue-100 w-fit p-1 pr-12 rounded-md">
              <span>Leave Reson</span>
            </span>
            <span className="block text-gray-800 break-all">
              {internData.reason}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-100 text-right">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-sm font-medium px-4 py-2 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default userData;
