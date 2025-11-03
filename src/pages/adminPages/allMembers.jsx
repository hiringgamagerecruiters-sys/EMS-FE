import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { MdDeleteForever } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import api from "../../utils/api";

function AllMembers() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = Cookies.get("token");
        const res = await api.get(
          "/admin/all_users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load members. Please try again later.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load members data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleStatusUpdate = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const statusText = newStatus ? "activate" : "deactivate";

    try {
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You're about to ${statusText} this user.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${statusText}`,
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setMembers((prev) =>
          prev.map((member) =>
            member._id === userId ? { ...member, active: newStatus } : member
          )
        );

        const token = Cookies.get("token");
        await api.put(
          "/admin/update_user_status",
          { userId, status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `User has been ${statusText}d.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Update status error:", err);
      setMembers((prev) =>
        prev.map((member) =>
          member._id === userId ? { ...member, active: currentStatus } : member
        )
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user status",
      });
    }
  };

  const handleUserRemove = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const token = Cookies.get("token");
        await api.delete(`/api/admin/remove_user`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMembers((prev) => prev.filter((member) => member._id !== id));

        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      Swal.fire("Error!", "Failed to delete user", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col gap-5 min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-8 border-dotted border-t-red-500 border-r-blue-500 border-b-red-500 border-l-green-500"></div>
        <p className="text-2xl text-blue-900">Loading .... </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName || ""} ${member.lastName || ""}`.toLowerCase();
    const email = (member.email || "").toLowerCase();
    const category = (member.category || "").toLowerCase();
    const startDate = member.internStartDate
      ? new Date(member.internStartDate).toISOString().split("T")[0]
      : "";
    const endDate = member.internEndDate
      ? new Date(member.internEndDate).toISOString().split("T")[0]
      : "";

    const term = searchTerm.toLowerCase();

    return (
      fullName.includes(term) ||
      email.includes(term) ||
      category.includes(term) ||
      startDate.includes(term) ||
      endDate.includes(term)
    );
  });

  const visibleMembers = showAll ? filteredMembers : filteredMembers.slice(0, 5);

  return (
    <div className="rounded-lg border-gray-200">
      <div className="flex w-full justify-end">
        <div className="w-md mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-800 mb-4">Error: {error}</div>}

      <div className={`overflow-x-auto ${showAll ? "max-h-[500px] overflow-y-scroll" : ""}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#0A96A6] sticky top-0 z-10">
            <tr>
              {[
                "Name",
                "Email",
                "Contact No",
                "Start Date",
                "End Date",
                "System Role",
                "Job Role",
                "Team",          // <-- added here
                "University",     // <-- added here
                "Status",
                "Action",
                "",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-2 py-3 text-left text-xs font-medium text-white  tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {visibleMembers.length > 0 ? (
              visibleMembers.map((item) => (
                <tr key={item._id} className="hover:bg-sky-100 font-medium px-2">
                  <td className="px-2 text-xs text-gray-900 font-medium">
                    {item.firstName || "Empty"} {item.lastName || "Empty"}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {item.email || "Empty"}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {item.contactNumber || "Empty"}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(item.internStartDate)}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(item.internEndDate)}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {item.role || "Empty"}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {item.jobRole?.jobRoleName || "Empty"}
                  </td>
                  <td className="px-2 text-xs text-gray-500 whitespace-nowrap">
                    {item.team?.teamName || "Empty"}
                  </td>
                  <td className="px-2 text-xs text-gray-500 break-words w-40">
                    {item.university || "Empty"}
                  </td>
                  <td className="px-2 text-xs whitespace-nowrap">
                    <span className={`font-medium ${item.active ? "text-green-600" : "text-red-600"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-2 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusUpdate(item._id, item.active)}
                      className={`w-8 h-4 flex items-center rounded-full transition duration-300 ease-in-out ${
                        item.active ? "bg-green-500" : "bg-red-500 p-1"
                      }`}
                      aria-label={item.active ? "Deactivate user" : "Activate user"}
                    >
                      <div
                        className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ease-in-out ${
                          item.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="w-fit text-gray-500 text-center">
                    <button
                      onClick={() => handleUserRemove(item._id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full text-2xl text-center"
                      title="Delete user"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-4 text-sm text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {members.length > 5 && (
        <div className="text-center mt-1">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-2 text-sm text-white bg-[#0A96A6] rounded hover:bg-[#087d8c] transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AllMembers;
