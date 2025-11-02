import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CiMemoPad } from "react-icons/ci";
import { GoCheckCircle, GoDownload } from "react-icons/go";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/defaultImage.jpg";

function Learninghub() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const token = Cookies.get("token");

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee/all_courses",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("fetchCourses is : ", response.data);
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses.", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getImageUrl = (course) => {
    if (course.courseImage) {
      if (course.courseImage.includes('uploads')) {
        return `http://localhost:5000/${course.courseImage}`;
      }
      return `http://localhost:5000/uploads/${course.courseImage}`;
    }
    
    if (course.image) {
      return `http://localhost:5000/uploads/${course.image}`;
    }
    
    if (course.thumbnail) {
      return `http://localhost:5000/uploads/${course.thumbnail}`;
    }
    
    return defaultImage;
  };

  const filteredCourses = courses.filter((course) =>
    course.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-1">
      <div className="flex justify-center mb-2">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 p-5">
        <CiMemoPad className="text-black text-4xl" />
        <h1 className="text-3xl font-bold text-gray-800">Learning Hub</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/employee/course/${course._id}`)}
          >
            <img
              src={getImageUrl(course)}
              alt={course.courseTitle}
              className="w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />

            <div className="p-4 bg-cyan-500 relative">
              <h3 className="font-semibold text-lg text-black break-all line-clamp-1">
                {course.courseTitle}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Learninghub;