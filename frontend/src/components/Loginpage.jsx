import React, { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUserId: "",
    password: "",
    captcha: "",
    otp: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrUserId.trim()) newErrors.emailOrUserId = "Email/User ID is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.captcha || formData.captcha !== "XyZ12") newErrors.captcha = "Invalid CAPTCHA.";
    if (!formData.otp || formData.otp.length !== 6) newErrors.otp = "Enter a valid 6-digit OTP.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login Data:", formData);
      // TODO: proceed with login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 mt-[-70px]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 ">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email ID / User ID</label>
            <input
              type="text"
              name="emailOrUserId"
              value={formData.emailOrUserId}
              onChange={handleChange}
              className={`block w-full rounded-xl border px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.emailOrUserId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.emailOrUserId && <p className="text-red-500 text-sm">{errors.emailOrUserId}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full rounded-xl border px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Enter CAPTCHA</label>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 px-4 py-2 rounded-xl font-bold">XyZ12</div>
              <input
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                className={`rounded-xl border px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.captcha ? 'border-red-500' : 'border-gray-300'} w-[90%] sm:w-full`}
              />
            </div>
            {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">OTP from Email</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className={`block w-full rounded-xl border px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            <div className=" flex justify-between">
            <button type="button" className="text-sm text-blue-600 hover:underline">
              Resend OTP
            </button>
             
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
