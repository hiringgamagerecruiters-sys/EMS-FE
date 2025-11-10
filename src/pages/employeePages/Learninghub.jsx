import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { CiMemoPad } from "react-icons/ci";
import { GoCheckCircle, GoDownload } from "react-icons/go";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/defaultImage.jpg";
import api from "../../utils/api";
const BASE_URL = import.meta.env.VITE_API_URL_;


function Learninghub() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  // BUG028: Course categories
  const categories = [
    "All",
    "Programming",
    "Web Development",
    "Soft Skills",
    "Project Management",
    "Data Science",
    "Design",
    "Business",
    "Marketing"
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "/employee/all_courses",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("fetchCourses is : ", response.data);
      setCourses(response.data.courses || []);
      setFilteredCourses(response.data.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses.", err);
    } finally {
      setLoading(false);
    }
  };

  // BUG029: Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get("/employee/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.courses) {
        const enrolledIds = response.data.courses.map(course => course._id || course.courseId);
        setEnrolledCourses(new Set(enrolledIds));
      }
    } catch (err) {
      console.error("Failed to fetch enrolled courses.", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  // BUG027 & BUG028: Filter courses based on search and category
  useEffect(() => {
    let results = courses;

    // Apply search filter
    if (search) {
      results = results.filter((course) =>
        course.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(search.toLowerCase())) ||
        (course.category && course.category.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      results = results.filter((course) =>
        course.category === selectedCategory ||
        (course.tags && course.tags.includes(selectedCategory)) ||
        (course.courseTitle.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    setFilteredCourses(results);
  }, [search, selectedCategory, courses]);

  const getImageUrl = (course) => {
    if (course.courseImage) {
      if (course.courseImage.includes('uploads')) {
        return `${BASE_URL}/${course.courseImage}`;
      }
      return `${BASE_URL}/uploads/${course.courseImage}`;
    }
    
    if (course.image) {
      return `${BASE_URL}/uploads/${course.image}`;
    }
    
    if (course.thumbnail) {
      return `${BASE_URL}/uploads/${course.thumbnail}`;
    }
    
    return defaultImage;
  };

  // BUG029: Handle course enrollment
  const handleEnrollCourse = async (courseId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking enroll button
    
    try {
      const response = await api.post(
        `/employee/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Add to enrolled courses set
        setEnrolledCourses(prev => new Set(prev).add(courseId));
        alert("Successfully enrolled in the course!");
        
        // Refresh enrolled courses list
        fetchEnrolledCourses();
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      if (error.response?.status === 409) {
        alert("You are already enrolled in this course.");
      } else {
        alert("Failed to enroll in the course. Please try again.");
      }
    }
  };

  // BUG029: Check if user is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrolledCourses.has(courseId);
  };

  // Extract categories from courses for dynamic filtering
  const extractCategoriesFromCourses = () => {
    const courseCategories = new Set(["All"]);
    courses.forEach(course => {
      if (course.category) {
        courseCategories.add(course.category);
      }
      if (course.tags) {
        course.tags.forEach(tag => courseCategories.add(tag));
      }
    });
    return Array.from(courseCategories);
  };

  const dynamicCategories = extractCategoriesFromCourses();

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 p-5">
        <CiMemoPad className="text-black text-4xl" />
        <h1 className="text-3xl font-bold text-gray-800">Learning Hub</h1>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, description, or category..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="text-gray-600" />
            <span className="text-gray-700">Filters</span>
          </button>
        </div>

        {/* BUG028: Category Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(search || selectedCategory !== "All") && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {search && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Search: "{search}"
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Category: {selectedCategory}
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* BUG027: No Results Message */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <FaSearch className="w-full h-full" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {search || selectedCategory !== "All" 
              ? `No courses found matching your search "${search}"${selectedCategory !== "All" ? ` in category "${selectedCategory}"` : ''}. Try adjusting your filters.`
              : "No courses available at the moment. Please check back later."}
          </p>
          {(search || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear filters and show all courses
            </button>
          )}
        </div>
      ) : (
        /* Courses Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course, index) => (
            <div
              key={course._id || index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(course)}
                  alt={course.courseTitle}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
                
                {/* BUG028: Category Badge */}
                {(course.category || course.tags) && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                      {course.category || course.tags?.[0] || "Course"}
                    </span>
                  </div>
                )}

                {/* BUG029: Enrollment Status Badge */}
                {isEnrolled(course._id) && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <GoCheckCircle />
                      Enrolled
                    </span>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {course.courseTitle}
                </h3>
                
                {/* Course Description */}
                {course.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                )}

                {/* BUG028: Course Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {course.tags.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{course.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  {/* BUG029: Enroll Button */}
                  {!isEnrolled(course._id) ? (
                    <button
                      onClick={(e) => handleEnrollCourse(course._id, e)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                    >
                      <FaRegBookmark />
                      Enroll Now
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/employee/course/${course._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                    >
                      <GoCheckCircle />
                      Continue Learning
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate(`/employee/course/${course._id}`)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredCourses.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
          {(search || selectedCategory !== "All") && " matching your criteria"}
        </div>
      )}
    </div>
  );
}

export default Learninghub;