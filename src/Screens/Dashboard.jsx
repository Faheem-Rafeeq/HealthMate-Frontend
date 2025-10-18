// src/Screens/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('healthmate_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Simulate loading user data and recent reports
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call to get user's recent reports
      // You can replace this with actual API call later
      setTimeout(() => {
        setRecentReports([
          { id: 1, type: 'Blood Test', date: '2024-01-15', status: 'Normal' },
          { id: 2, type: 'Diabetes Panel', date: '2024-01-10', status: 'Abnormal' },
          { id: 3, type: 'Thyroid Test', date: '2024-01-05', status: 'Normal' },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('healthmate_token');
      localStorage.removeItem('healthmate_user');
      // Redirect to login
      navigate('/login');
    }
  };

  const handleUploadReport = () => {
    navigate('/upload');
  };

  const handleAddVitals = () => {
    navigate('/vitals');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">HealthMate</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username || 'User'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username || 'User'}! 👋
            </h2>
            <p className="text-gray-600">
              Your health companion is here to help you understand and manage your medical reports.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Upload Report Card */}
            <div 
              onClick={handleUploadReport}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Medical Report</h4>
              <p className="text-gray-600 text-sm">
                Upload lab reports, prescriptions, or scan results for AI analysis
              </p>
            </div>

            {/* Add Vitals Card */}
            <div 
              onClick={handleAddVitals}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Manual Vitals</h4>
              <p className="text-gray-600 text-sm">
                Track BP, Sugar, Weight, and other vital measurements manually
              </p>
            </div>

            {/* View Timeline Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">View Health Timeline</h4>
              <p className="text-gray-600 text-sm">
                See all your reports and vitals in chronological order
              </p>
            </div>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="px-4 py-6 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Reports</h3>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            {recentReports.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{report.type}</h4>
                        <p className="text-sm text-gray-500">Date: {report.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No medical reports yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first report to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Health Tip</h3>
            <p className="text-blue-800">
              "Regular monitoring of your vital signs can help in early detection of potential health issues. 
              Make sure to track your BP and sugar levels regularly."
            </p>
            <p className="text-blue-700 text-sm mt-2 italic">
              Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi. (This AI is for understanding only, not for treatment)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;