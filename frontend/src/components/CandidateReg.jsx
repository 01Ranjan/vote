import React, { useState } from 'react';
import axios from 'axios';

function CandidateReg() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    party: '',
    bio: '',
    agenda: null,
    receipt: null,
    candidateType: '',
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);

  const candidateTypes = [
    'Chief Secretary',
    'Secretary',
    'Treasurer',
    'Vice-President',
    'Member',
  ];

  const validate = () => {
    const newErrors = {};

    if (!/^[a-zA-Z ]{2,50}$/.test(formData.name)) {
      newErrors.name = 'Name must contain 2-50 letters and spaces only';
    }

    if (!formData.age || isNaN(formData.age) || formData.age < 25 || formData.age > 120) {
      newErrors.age = 'Valid age (25-120) is required';
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

    if (!formData.party || formData.party.length < 2 || formData.party.length > 50) {
      newErrors.party = 'Party name must be 2-50 characters';
    }

    if (!formData.bio || formData.bio.length < 10 || formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 10-500 characters';
    }

    if (!formData.agenda) {
      newErrors.agenda = 'Agenda (PDF) is required';
    }

    if (!formData.receipt) {
      newErrors.receipt = 'Receipt of secret deposit is required';
    }

    if (!formData.candidateType) {
      newErrors.candidateType = 'Candidate type is required';
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
      if (combinedFiles.length >= 5) return;
      const exists = combinedFiles.some(
        file => file.name === newFile.name && file.size === newFile.size
      );
      if (!exists) {
        combinedFiles.push(newFile);
      }
    });

    setFormData({ ...formData, files: combinedFiles });
    e.target.value = null;
  };

  const handleAgendaChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setErrors({ ...errors, agenda: 'Please upload a PDF file.' });
    } else {
      setFormData({ ...formData, agenda: file });
      setErrors({ ...errors, agenda: '' });
    }
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setErrors({ ...errors, receipt: 'Please upload an image file (receipt).' });
    } else {
      setFormData({ ...formData, receipt: file });
      setErrors({ ...errors, receipt: '' });
    }
  };

  const confirmRemoveFile = (indexToRemove) => {
    setShowRemoveConfirm(indexToRemove);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = formData.files.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, files: updatedFiles });
    setShowRemoveConfirm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'files') {
          formData.files.forEach(file => formPayload.append('files', file));
        } else if (formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      });

      // Replace with your actual API endpoint
      await axios.post('/api/candidates/register', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          name: '',
          age: '',
          gender: '',
          mobile: '',
          email: '',
          party: '',
          bio: '',
          agenda: null,
          receipt: null,
          candidateType: '',
          files: [],
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({
        ...errors,
        submit: 'Registration failed. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-3 md:mx-auto bg-white rounded-2xl shadow-2xl my-3">
      <h2 className="text-2xl font-bold mb-4">Candidate Registration</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Registration successful! Thank you for submitting your candidacy.
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block">Full Name*</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            maxLength={50}
            aria-describedby="nameError"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p id="nameError" className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Age Field */}
        <div>
          <label htmlFor="age" className="block">Age*</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            value={formData.age} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            min="25"
            max="120"
            aria-describedby="ageError"
            aria-invalid={!!errors.age}
          />
          {errors.age && (
            <p id="ageError" className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>

        {/* Gender Field */}
        <div>
          <label htmlFor="gender" className="block">Gender*</label>
          <select 
            id="gender" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            aria-describedby="genderError"
            aria-invalid={!!errors.gender}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p id="genderError" className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Mobile Field */}
        <div>
          <label htmlFor="mobile" className="block">Mobile Number*</label>
          <input 
            type="tel" 
            id="mobile" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            maxLength={10}
            pattern="[6-9]{1}[0-9]{9}"
            aria-describedby="mobileError"
            aria-invalid={!!errors.mobile}
          />
          {errors.mobile && (
            <p id="mobileError" className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block">Email ID*</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            aria-describedby="emailError"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p id="emailError" className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Candidate Type Field */}
        <div>
          <label htmlFor="candidateType" className="block">Candidate Type*</label>
          <select 
            id="candidateType" 
            name="candidateType" 
            value={formData.candidateType} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            aria-describedby="candidateTypeError"
            aria-invalid={!!errors.candidateType}
          >
            <option value="">Select Type</option>
            {candidateTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          {errors.candidateType && (
            <p id="candidateTypeError" className="text-red-500 text-sm mt-1">{errors.candidateType}</p>
          )}
        </div>

        {/* Party Field */}
        <div>
          <label htmlFor="party" className="block">Party Name*</label>
          <input 
            type="text" 
            id="party" 
            name="party" 
            value={formData.party} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            maxLength={50}
            aria-describedby="partyError"
            aria-invalid={!!errors.party}
          />
          {errors.party && (
            <p id="partyError" className="text-red-500 text-sm mt-1">{errors.party}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block">Candidate Bio* (20-500 characters)</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            minLength={20}
            maxLength={500}
            aria-describedby="bioError"
            aria-invalid={!!errors.bio}
          ></textarea>
          <div className="text-sm text-gray-500">
            {formData.bio.length}/500 characters
          </div>
          {errors.bio && (
            <p id="bioError" className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {/* Agenda PDF Field */}
        <div>
          <label htmlFor="agenda" className="block">Upload Agenda (PDF)*</label>
          <input 
            type="file" 
            id="agenda" 
            accept="application/pdf" 
            onChange={handleAgendaChange} 
            className="w-full p-2 border rounded" 
            aria-describedby="agendaError"
            aria-invalid={!!errors.agenda}
          />
          {formData.agenda && (
            <p className="text-green-600 text-sm mt-1">
              ✅ {formData.agenda.name} ({Math.round(formData.agenda.size / 1024)} KB)
            </p>
          )}
          {errors.agenda && (
            <p id="agendaError" className="text-red-500 text-sm mt-1">{errors.agenda}</p>
          )}
        </div>

        {/* Receipt Image Field */}
        <div>
          <label htmlFor="receipt" className="block">
            Upload Receipt of Secret Deposit (Image)*
          </label>
          <input 
            type="file" 
            id="receipt" 
            accept="image/*" 
            onChange={handleReceiptChange} 
            className="w-full p-2 border rounded" 
            aria-describedby="receiptError"
            aria-invalid={!!errors.receipt}
          />
          {formData.receipt && (
            <p className="text-green-600 text-sm mt-1">
              ✅ {formData.receipt.name} ({Math.round(formData.receipt.size / 1024)} KB)
            </p>
          )}
          {errors.receipt && (
            <p id="receiptError" className="text-red-500 text-sm mt-1">{errors.receipt}</p>
          )}
        </div>

        {/* Supporting Documents Field */}
        <div>
          <label htmlFor="files" className="block">
            Upload Supporting Documents (2-5 images)*
          </label>
          <input 
            type="file" 
            id="files" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            className="w-full p-2 border rounded" 
            aria-describedby="filesError"
            aria-invalid={!!errors.files}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.files.length}/5 files selected
          </p>
          
          {formData.files.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => confirmRemoveFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      aria-label={`Remove file ${file.name}`}
                    >
                      ×
                    </button>
                    
                    {showRemoveConfirm === index && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-2 rounded">
                        <p className="text-white text-xs text-center mb-1">Remove this file?</p>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRemoveConfirm(null)}
                            className="bg-gray-500 text-white text-xs px-2 py-1 rounded"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.files && (
            <p id="filesError" className="text-red-500 text-sm mt-1">{errors.files}</p>
          )}
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">↻</span>
              Submitting...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
}

export default CandidateReg;