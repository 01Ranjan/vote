import React, { useState } from 'react';

function VoterReg() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    idNumber: '',
    files: [],
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!/^[a-zA-Z ]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces';
    }

    if (!formData.age || isNaN(formData.age) || formData.age < 18) {
      newErrors.age = 'Valid age (18+) is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid Indian mobile number';
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.idNumber) {
      newErrors.idNumber = 'ID Proof Number is required';
    }

    if (formData.files.length < 2 || formData.files.length > 5) {
      newErrors.files = 'Upload minimum 2 and maximum 5 files';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const combinedFiles = [...formData.files];
    newFiles.forEach((newFile) => {
      const exists = combinedFiles.some(
        (file) =>
          file.name === newFile.name && file.lastModified === newFile.lastModified
      );
      if (!exists) {
        combinedFiles.push(newFile);
      }
    });

    if (combinedFiles.length > 5) {
      combinedFiles.splice(5); // keep only the first 5
    }

    setFormData({ ...formData, files: combinedFiles });
    e.target.value = null; // allow re-upload of same files
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = formData.files.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, files: updatedFiles });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Form submitted successfully!');
      setFormData({
        name: '',
        age: '',
        gender: '',
        mobile: '',
        email: '',
        idNumber: '',
        files: [],
      });
      setErrors({});
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Voter Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="age" className="block">Age</label>
          <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div>
          <label htmlFor="mobile" className="block">Mobile Number</label>
          <input type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded" maxLength={10} />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block">Email ID</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="idNumber" className="block">ID Proof Number</label>
          <input type="text" id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full p-2 border rounded" />
          {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
        </div>

        <div>
          <label htmlFor="files" className="block">Upload ID Card Photos (2 to 5 images)</label>
          <input type="file" id="files" multiple accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
          {formData.files.length > 0 && (
            <div className="mt-2">
              <p className="text-green-600 text-sm">✅ {formData.files.length} file(s) selected</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`file-${index}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}

export default VoterReg;
