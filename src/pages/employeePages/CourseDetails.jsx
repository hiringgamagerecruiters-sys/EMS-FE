import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FiArrowLeft } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import defaultImage from "../../assets/defaultImage.jpg";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:5000/api/employee/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(response.data.course);
      } catch (err) {
        console.error("Failed to fetch course details", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-md w-full">
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <button
            onClick={() => navigate("/employee/learninghub")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center mx-auto"
          >
            <FiArrowLeft className="mr-2" />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-md w-full">
          <div className="text-gray-600 mb-4 text-lg">Course not found</div>
          <button
            onClick={() => navigate("/employee/learninghub")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center mx-auto"
          >
            <FiArrowLeft className="mr-2" />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="px-2 sm:px-0">
          <button
            onClick={() => navigate("/employee/learninghub")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to all courses
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 lg:w-2/5 h-64 sm:h-80 md:h-auto">
              <img
                src={`http://localhost:5000/${course.courseImage}`}
                alt={course.courseTitle}
                className="w-full min-h-96 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>

            <div className="p-6 md:p-8 w-full md:w-1/2 lg:w-3/5">
              <div className="flex flex-col h-full">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    {course.courseTitle}
                  </h1>
                  <div className="text-sm text-gray-500 mb-4">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
                  {course.courseDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
            <ul className="space-y-3">
              {course.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-xs">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>      

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              What You'll Learn
            </h2>
            <ul className="space-y-3">
              {course.learn.map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;