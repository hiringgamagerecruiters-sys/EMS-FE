import React, { useState } from 'react';
import logo from '../../../assets/logo.png';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    dob: '',
    nic: '',
    profileImage: null,
    internStartDate: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with formData here (e.g. API call)
    console.log(formData);
  };

  return (

    
    <div className="min-h-screen bg-[#0097A7] flex items-start justify-center px-4 py-6 pt-28 overflow-auto">

      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h2 className="text-lg font-bold">Gamage Recruiters - Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
      <div>
            {formData.profileImage && (
    <div className="flex justify-center">
      <img
        src={URL.createObjectURL(formData.profileImage)}
        alt="Profile Preview"
        className="w-24 h-24 object-cover rounded-full border border-gray-300 mb-4"
      />
    </div>
  )}

   {/* Custom styled upload button */}
  <div>
    <label className="block text-sm font-medium mb-1 text-center">Profile Image:</label>
    <label className="flex items-center justify-center gap-4 px-2 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition">
      <span className="text-sm text-gray-700 w-50">Choose Image</span>
      <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  </div>

  {/* Image preview */}
  {formData.profileImage && (
    <div className="mt-3">
      <img
        src={URL.createObjectURL(formData.profileImage)}
        alt="Profile Preview"
        className="w-20 h-20 object-cover rounded-full border border-gray-300"
      />
    </div>
  )}
</div>
{/* First Name + Last Name in one row */}
  <div className="flex gap-4">
    <div className="w-1/2">
      <label className="block text-sm font-medium mb-1">First Name:</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Enter your first name"
        className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
        required
      />
    </div>
    <div className="w-1/2">
      <label className="block text-sm font-medium mb-1">Last Name:</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Enter your last name"
        className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
        required
      />
    </div>
  </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
              required
            />
          </div>

          {/* Contact Number + DOB in one row */}
  <div className="flex gap-4">
    <div className="w-1/2">
      <label className="block text-sm font-medium mb-1">Contact Number:</label>
      <input
        type="tel"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        placeholder="Enter your contact number"
        className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
        required
      />
    </div>
    <div className="w-1/2">
      <label className="block text-sm font-medium mb-1">Date of Birth:</label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
        required
      />
    </div>
  </div>

         <div className="flex gap-4">
  <div className="w-1/2">
    <label className="block text-sm font-medium mb-1">NIC:</label>
    <input
      type="text"
      name="nic"
      value={formData.nic}
      onChange={handleChange}
      placeholder="Enter your NIC"
      className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
      required
    />
  </div>
  <div className="w-1/2">
    <label className="block text-sm font-medium mb-1">Intern Start Date:</label>
    <input
      type="date"
      name="internStartDate"
      value={formData.internStartDate}
      onChange={handleChange}
      className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
      required
    />
  </div>
</div>

      <div>
            <label className="block text-sm font-medium mb-1">description:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your description"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-[#0097A7] text-white font-bold shadow-md hover:bg-[#007c8a] transition"
          >
            Sign Up
          </button>

        </form>
      </div>
    </div>
  );
}

export default SignUp;
