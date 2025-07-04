// frontend-new/src/pages/ImageDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// This component displays the detailed information for a specific uploaded image.
const ImageDetailPage = () => {
  // <--- CHANGE: Removed 'logout' from destructuring as it's not used directly here
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const imageId = parseInt(id);

  const [imageDetails, setImageDetails] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function to simulate fetching image details
  const fetchImageDetails = async (token, imageId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          const mockImage = {
            id: imageId,
            name: `Construction_Site_${imageId}.jpg`,
            url: `https://placehold.co/600x400/000/FFF?text=Image+${imageId}`,
            ai_analysis_status: 'Completed',
            upload_date: '2025-07-01',
            detected_elements_json: JSON.stringify({
              elements: [
                { label: 'Wall Structure', confidence: 0.98, bbox: [50, 50, 200, 300] },
                { label: 'Roof Truss', confidence: 0.92, bbox: [250, 100, 400, 250] },
                { label: 'Foundation', confidence: 0.85, bbox: [10, 350, 580, 390] },
                { label: 'Scaffolding', confidence: 0.70, bbox: [450, 80, 550, 380] },
              ],
              overall_assessment: "Good progress on structural elements."
            }),
            verified_progress_percentage: Math.floor(Math.random() * 30) + 60,
            project_id: 123,
          };

          if (imageId === 1002) {
            mockImage.ai_analysis_status = 'Processing';
            mockImage.verified_progress_percentage = null;
            mockImage.detected_elements_json = null;
            mockImage.name = 'Foundation_View_Processing.png';
            mockImage.url = 'https://placehold.co/600x400/000/FFF?text=Processing...';
          } else if (imageId === 1003) {
            mockImage.name = 'Roof_Progress_Final.jpeg';
            mockImage.url = 'https://placehold.co/600x400/000/FFF?text=Roof+Done';
            mockImage.detected_elements_json = JSON.stringify({
              elements: [
                { label: 'Roof Tiles', confidence: 0.99, bbox: [10, 10, 590, 300] },
                { label: 'Chimney', confidence: 0.90, bbox: [400, 50, 500, 150] },
              ],
              overall_assessment: "Roofing completed."
            });
            mockImage.verified_progress_percentage = 95;
          }

          resolve(mockImage);
        } else {
          reject(new Error("Authentication token missing. Cannot fetch image details."));
        }
      }, 1000);
    });
  };

  useEffect(() => {
    if (!authLoading && token && !isNaN(imageId)) {
      setDataLoading(true);
      setError(null);

      fetchImageDetails(token, imageId)
        .then(data => {
          setImageDetails(data);
        })
        .catch(err => {
          console.error("Failed to fetch image details:", err);
          setError("Failed to load image details. Please try again.");
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else if (!authLoading && !token) {
      setImageDetails(null);
      setDataLoading(false);
    } else if (!isNaN(imageId) === false) {
        setError("Invalid Image ID provided.");
        setDataLoading(false);
    }
  }, [token, authLoading, imageId]);

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-emerald-900 text-white p-6">
        <p className="text-xl font-semibold text-gray-200">Loading image details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-emerald-900 text-white p-6">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/upload-image')}
            className="mt-4 bg-white text-red-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Back to Images
          </button>
        </div>
      </div>
    );
  }

  if (!imageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-emerald-900 text-white p-6">
        <p className="text-xl font-semibold text-gray-200">Image not found.</p>
        <button
            onClick={() => navigate('/upload-image')}
            className="mt-4 ml-4 bg-white text-green-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Back to Images
          </button>
      </div>
    );
  }

  const detectedElements = imageDetails.detected_elements_json
    ? JSON.parse(imageDetails.detected_elements_json).elements || []
    : [];
  const overallAssessment = imageDetails.detected_elements_json
    ? JSON.parse(imageDetails.detected_elements_json).overall_assessment || 'N/A'
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-emerald-900 text-white p-6 font-inter">
      <Navbar />

      <div className="max-w-5xl mx-auto space-y-6 bg-white bg-opacity-15 p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-extrabold text-center mb-6">Image: {imageDetails.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Display */}
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-lg shadow-inner p-4">
            <img
              src={imageDetails.url}
              alt={imageDetails.name}
              className="max-w-full h-auto rounded-lg shadow-md border border-gray-600"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/000/FFF?text=Image+Load+Error"; }}
            />
            <p className="text-sm text-gray-300 mt-2">Uploaded on: {imageDetails.upload_date}</p>
          </div>

          {/* AI Analysis Results */}
          <div className="space-y-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
              <p className="font-semibold text-gray-300">AI Analysis Status:</p>
              <p className={`text-2xl font-bold ${
                imageDetails.ai_analysis_status === 'Completed' ? 'text-green-300' :
                imageDetails.ai_analysis_status === 'Processing' ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {imageDetails.ai_analysis_status}
              </p>
            </div>

            {imageDetails.ai_analysis_status === 'Completed' && (
              <>
                <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
                  <p className="font-semibold text-gray-300">Verified Progress Percentage:</p>
                  <p className="text-3xl font-bold text-blue-300">
                    {imageDetails.verified_progress_percentage || 'N/A'}%
                  </p>
                </div>

                <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
                  <p className="font-semibold text-gray-300 mb-2">Detected Elements:</p>
                  {detectedElements.length > 0 ? (
                    <ul className="list-disc list-inside text-lg">
                      {detectedElements.map((element, index) => (
                        <li key={index}>
                          {element.label} (Confidence: {(element.confidence * 100).toFixed(1)}%)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-300">No specific elements detected.</p>
                  )}
                  <p className="font-semibold text-gray-300 mt-4 mb-2">Overall Assessment:</p>
                  <p className="text-lg">{overallAssessment}</p>
                </div>
              </>
            )}
            {imageDetails.ai_analysis_status === 'Processing' && (
              <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner text-center">
                <p className="text-xl font-semibold text-yellow-300">AI analysis is still in progress...</p>
                <p className="text-sm text-gray-300 mt-2">Please check back in a few moments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailPage;
