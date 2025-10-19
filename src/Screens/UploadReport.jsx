// src/Screens/UploadReport.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(selectedFile.type)) {
        setErrors({ file: 'Please select a valid image or PDF file' });
        return;
      }

      if (selectedFile.size > maxSize) {
        setErrors({ file: 'File size must be less than 5MB' });
        return;
      }

      setFile(selectedFile);
      setErrors({});

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setErrors({ file: 'Please select a file to upload' });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('healthmate_token');

      console.log('Uploading file to server...');

      const response = await fetch('http://localhost:5000/api/reports/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - let browser set it
        },
        body: formData
      });

      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        // Success - redirect to dashboard with success message
        navigate('/dashboard', {
          state: {
            message: 'Report uploaded and analyzed successfully!',
            newReport: result.report
          }
        });
      } else {
        // Server returned error
        setErrors({ general: result.message || 'Upload failed' });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: 'Failed to upload file. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const inputEvent = {
        target: {
          files: [droppedFile]
        }
      };
      handleFileChange(inputEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Upload Medical Report</h1>
          <p className="mt-2 text-gray-600">Upload your medical reports for AI-powered analysis with Gemini</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Report File *
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-lg transition-colors ${
                  errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <div className="space-y-3 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  
                  <div className="flex flex-col items-center text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                      <span>Choose a file</span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf,.PDF"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1">or drag and drop</p>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 5MB
                  </p>
                </div>
              </div>

              {file && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">{file.name}</span>
                    </div>
                    <span className="text-xs text-green-600">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}

              {errors.file && (
                <p className="mt-2 text-sm text-red-600">{errors.file}</p>
              )}
            </div>

            {/* File Preview */}
            {previewUrl && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="flex justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-64 rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading & Analyzing...
                  </>
                ) : (
                  'Upload & Analyze with AI'
                )}
              </button>
            </div>
          </form>

          {/* Features & Disclaimer */}
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">✨ What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your file is securely uploaded to Cloudinary</li>
                <li>• Google Gemini AI analyzes the medical report</li>
                <li>• Get simple explanations in English & Roman Urdu</li>
                <li>• Identify abnormal values and get insights</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> AI analysis is for educational purposes only. 
                Always consult with a qualified healthcare professional for medical advice.
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                <strong>Roman Urdu:</strong> Yeh AI analysis sirf samajhne ke liye hai. 
                Ilm ke liye hamesha qualified doctor se mashwara karein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;