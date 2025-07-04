// frontend-new/src/pages/ImageUploadPage.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// This component provides the interface for users to upload construction images.
const ImageUploadPage = () => {
  // <--- CHANGE: Removed 'logout' from destructuring as it's not used directly here
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState(null);

  const fileInputRef = useRef(null);

  // Mock function to simulate uploading an image
  const uploadImageAPI = async (token, imageFile) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          const mockResponse = {
            id: Math.floor(Math.random() * 10000) + 1000,
            name: imageFile.name,
            url: URL.createObjectURL(imageFile),
            ai_analysis_status: 'Processing',
            detected_elements_json: null,
            verified_progress_percentage: null,
            upload_date: new Date().toISOString().split('T')[0],
          };

          setTimeout(() => {
            resolve({
              ...mockResponse,
              ai_analysis_status: 'Completed',
              detected_elements_json: JSON.stringify({
                elements: [
                  { type: 'wall', confidence: 0.95 },
                  { type: 'roof_frame', confidence: 0.88 }
                ]
              }),
              verified_progress_percentage: Math.floor(Math.random() * 40) + 50,
            });
          }, 2000);

        } else {
          reject(new Error("Authentication token missing. Cannot upload image."));
        }
      }, 500);
    });
  };

  // Mock function to simulate fetching a list of previously uploaded images.
  const fetchUploadedImagesAPI = async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          resolve([
            { id: 1001, name: 'Site_Entry_01.jpg', url: 'https://placehold.co/150x100/000/FFF?text=IMG1', ai_analysis_status: 'Completed', progress: '75%', upload_date: '2025-06-20' },
            { id: 1002, name: 'Foundation_View.png', url: 'https://placehold.co/150x100/000/FFF?text=IMG2', ai_analysis_status: 'Processing', progress: 'N/A', upload_date: '2025-06-22' },
            { id: 1003, name: 'Roof_Progress.jpeg', url: 'https://placehold.co/150x100/000/FFF?text=IMG3', ai_analysis_status: 'Completed', progress: '90%', upload_date: '2025-06-25' },
          ]);
        } else {
          reject(new Error("Authentication token missing. Cannot fetch images."));
        }
      }, 1000);
    });
  };

  useEffect(() => {
    if (!authLoading && token) {
      setImagesLoading(true);
      setImagesError(null);
      fetchUploadedImagesAPI(token)
        .then(data => setUploadedImages(data))
        .catch(err => {
          console.error("Failed to fetch uploaded images:", err);
          setImagesError("Failed to load uploaded images.");
        })
        .finally(() => setImagesLoading(false));
    } else if (!authLoading && !token) {
      setUploadedImages([]);
      setImagesLoading(false);
    }
  }, [token, authLoading]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
      setUploadSuccess(null);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const result = await uploadImageAPI(token, selectedFile);
      setUploadSuccess(`Image "${result.name}" uploaded successfully! Analysis status: ${result.ai_analysis_status}.`);
      setUploadedImages(prevImages => [result, ...prevImages]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-emerald-900 text-white p-6 font-inter">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white bg-opacity-15 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-4xl font-extrabold text-center mb-6">Upload New Image for Verification</h2>

        <div className="space-y-4">
          <label htmlFor="file-upload" className="block text-xl font-semibold text-gray-200 mb-2 text-left">
            Select Image File
          </label>
          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-lg text-gray-900 bg-white bg-opacity-80 rounded-lg p-2 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            disabled={uploading}
          />
          {selectedFile && (
            <p className="text-gray-300 text-sm mt-2">Selected file: <span className="font-semibold">{selectedFile.name}</span></p>
          )}

          {uploadError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{uploadSuccess}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xl"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading & Analyzing...' : 'Upload Image'}
          </button>
        </div>

        {/* List of Uploaded Images */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-3xl font-bold mb-4 text-center">Your Uploaded Images</h3>
          {imagesLoading ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-lg text-gray-300">Loading previously uploaded images...</p>
            </div>
          ) : imagesError ? (
            <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
              <p className="font-bold">Error loading images:</p>
              <p>{imagesError}</p>
            </div>
          ) : uploadedImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map(image => (
                <div key={image.id} className="bg-white bg-opacity-10 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
                  <img
                    src={image.url || `https://placehold.co/300x200/000/FFF?text=${image.name.substring(0, 10)}...`}
                    alt={image.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/000/FFF?text=Image+Error"; }}
                  />
                  <div className="p-4 space-y-2">
                    <p className="text-lg font-semibold truncate">{image.name}</p>
                    <p className="text-sm text-gray-300">Uploaded: {image.upload_date}</p>
                    <p className="text-sm">Status: <span className={`font-bold ${
                      image.ai_analysis_status === 'Completed' ? 'text-green-300' :
                      image.ai_analysis_status === 'Processing' ? 'text-yellow-300' : 'text-red-300'
                    }`}>
                      {image.ai_analysis_status}
                    </span></p>
                    {image.progress && <p className="text-sm">Progress: <span className="font-bold">{image.progress}</span></p>}
                    <button
                      onClick={() => navigate(`/images/${image.id}`)}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg text-sm shadow-md transition duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl text-gray-300 py-4">No images uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;
