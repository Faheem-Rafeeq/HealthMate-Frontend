// src/Screens/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('healthmate_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchUserReports();
    fetchUserVitals();
  }, []);

  // Mock function to fetch vitals (replace with actual API call)
  const fetchUserVitals = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setVitals([
          { id: 1, type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: '2024-01-15', status: 'normal' },
          { id: 2, type: 'Blood Sugar', value: '95', unit: 'mg/dL', date: '2024-01-14', status: 'normal' },
          { id: 3, type: 'Weight', value: '70', unit: 'kg', date: '2024-01-13', status: 'normal' },
          { id: 4, type: 'Heart Rate', value: '72', unit: 'bpm', date: '2024-01-12', status: 'normal' },
        ]);
      }, 500);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  const fetchUserReports = async () => {
    try {
      const token = localStorage.getItem('healthmate_token');
      const response = await fetch('http://localhost:5000/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const userReports = await response.json();
        setReports(userReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('healthmate_token');
      localStorage.removeItem('healthmate_user');
      navigate('/login');
    }
  };

  const handleUploadReport = () => {
    navigate('/upload');
  };

  const handleAddVitals = () => {
    navigate('/vitals');
  };

  const getRecentReports = () => {
    return reports.slice(0, 3).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getRecentVitals = () => {
    return vitals.slice(0, 4).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getAllTimelineItems = () => {
    const timelineItems = [
      ...reports.map(report => ({
        ...report,
        type: 'report',
        date: new Date(report.date)
      })),
      ...vitals.map(vital => ({
        ...vital,
        type: 'vital',
        date: new Date(vital.date)
      }))
    ];
    
    return timelineItems.sort((a, b) => b.date - a.date).slice(0, 10);
  };

  const getReportStatus = (summary) => {
    if (!summary) return 'unknown';
    const lowerSummary = summary.toLowerCase();
    if (lowerSummary.includes('abnormal') || lowerSummary.includes('high') || lowerSummary.includes('low') || lowerSummary.includes('elevated')) {
      return 'abnormal';
    } else if (lowerSummary.includes('normal') || lowerSummary.includes('good') || lowerSummary.includes('within range')) {
      return 'normal';
    }
    return 'unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAISummary = (summary) => {
    if (!summary) return 'No analysis available';
    
    // Split by common section headers
    const sections = summary.split(/\n\s*\n/);
    return sections.map((section, index) => {
      if (section.includes('ENGLISH SUMMARY:') || section.includes('ROMAN URDU SUMMARY:') || 
          section.includes('KEY FINDINGS:') || section.includes('DOCTOR QUESTIONS:') ||
          section.includes('DIETARY ADVICE:') || section.includes('HOME REMEDIES:')) {
        return (
          <div key={index} className="mb-3">
            <strong className="text-gray-900 block mb-1">{section.split(':')[0]}:</strong>
            <span className="text-gray-700">{section.split(':').slice(1).join(':').trim()}</span>
          </div>
        );
      }
      return (
        <p key={index} className="text-gray-700 mb-2">{section}</p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthMate</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Your Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Welcome, {user?.username || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'reports', 'timeline', 'vitals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                    <p className="text-sm text-gray-500">Total Reports</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => getReportStatus(r.aiSummary) === 'normal').length}
                    </p>
                    <p className="text-sm text-gray-500">Normal Reports</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => getReportStatus(r.aiSummary) === 'abnormal').length}
                    </p>
                    <p className="text-sm text-gray-500">Attention Needed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{vitals.length}</p>
                    <p className="text-sm text-gray-500">Vital Records</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    onClick={handleUploadReport}
                    className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700">Upload Medical Report</h3>
                        <p className="text-sm text-gray-500">Get AI analysis for your medical reports</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={handleAddVitals}
                    className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700">Add Vitals</h3>
                        <p className="text-sm text-gray-500">Track BP, Sugar, Weight measurements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Vitals */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Recent Vitals</h2>
                </div>
                <div className="p-6">
                  {vitals.length > 0 ? (
                    <div className="space-y-4">
                      {getRecentVitals().map((vital) => (
                        <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{vital.type}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(vital.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{vital.value} {vital.unit}</p>
                            <span className="text-green-600 text-sm font-medium">Normal</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No vital records yet</p>
                      <button
                        onClick={handleAddVitals}
                        className="text-green-600 hover:text-green-700 font-medium mt-2"
                      >
                        Add your first vital
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Medical Reports</h2>
                <button
                  onClick={handleUploadReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Report
                </button>
              </div>
            </div>
            <div className="p-6">
              {reports.length > 0 ? (
                <div className="space-y-6">
                  {reports.map((report) => {
                    const status = getReportStatus(report.aiSummary);
                    return (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(report.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <a 
                              href={report.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                            >
                              View File
                            </a>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">AI Analysis Summary:</h4>
                          <div className="text-gray-700 space-y-2 text-sm leading-relaxed">
                            {formatAISummary(report.aiSummary)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medical reports yet</h3>
                  <p className="text-gray-500 mb-4">Upload your first medical report to get AI analysis</p>
                  <button
                    onClick={handleUploadReport}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Upload First Report
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Health Timeline</h2>
            </div>
            <div className="p-6">
              {getAllTimelineItems().length > 0 ? (
                <div className="space-y-4">
                  {getAllTimelineItems().map((item, index) => (
                    <div key={item.id || item._id} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          item.type === 'report' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        {index < getAllTimelineItems().length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                item.type === 'report' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {item.type === 'report' ? 'Report' : 'Vital'}
                              </span>
                              <h3 className="font-medium text-gray-900">
                                {item.type === 'report' ? item.title : `${item.type} - ${item.value} ${item.unit}`}
                              </h3>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                          {item.type === 'report' && item.aiSummary && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.aiSummary.split('\n')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No timeline items yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start by uploading reports or adding vitals</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VITALS TAB */}
        {activeTab === 'vitals' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Vital Signs</h2>
                <button
                  onClick={handleAddVitals}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Vitals
                </button>
              </div>
            </div>
            <div className="p-6">
              {vitals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vitals.map((vital) => (
                    <div key={vital.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{vital.type}</h3>
                        <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded">
                          Normal
                        </span>
                      </div>
                      <div className="text-center mb-4">
                        <p className="text-3xl font-bold text-gray-900">{vital.value}</p>
                        <p className="text-gray-500">{vital.unit}</p>
                      </div>
                      <div className="text-sm text-gray-500 text-center">
                        Recorded on {new Date(vital.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vital records yet</h3>
                  <p className="text-gray-500 mb-4">Start tracking your vital signs for better health monitoring</p>
                  <button
                    onClick={handleAddVitals}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add First Vital
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;