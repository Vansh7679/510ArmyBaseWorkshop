// components/ApiDebugDetailed.jsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';

const ApiDebugDetailed = () => {
  const [debugInfo, setDebugInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const addDebugInfo = (info) => {
    setDebugInfo(prev => [...prev, { ...info, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testRealAPI = async () => {
    setLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugInfo({ type: 'info', message: '🚀 Starting API tests...' });
      
      // Test 1: Direct fetch call
      addDebugInfo({ type: 'info', message: '📡 Testing direct fetch call...' });
      
      const directResponse = await fetch('http://localhost:8080/api/users');
      addDebugInfo({ 
        type: 'success', 
        message: `✅ Direct fetch - Status: ${directResponse.status}`,
        data: `Headers: ${JSON.stringify(Object.fromEntries(directResponse.headers.entries()), null, 2)}`
      });
      
      const directData = await directResponse.json();
      addDebugInfo({ 
        type: 'success', 
        message: `✅ Direct fetch - Data received`,
        data: JSON.stringify(directData, null, 2)
      });

      // Test 2: Using apiService
      addDebugInfo({ type: 'info', message: '🔧 Testing apiService.getUsers()...' });
      
      const serviceData = await apiService.getUsers();
      addDebugInfo({ 
        type: 'success', 
        message: `✅ ApiService - Data received`,
        data: JSON.stringify(serviceData, null, 2)
      });

      // Test 3: Compare data structures
      addDebugInfo({ type: 'info', message: '🔍 Comparing data structures...' });
      
      if (directData && directData.length > 0) {
        const sampleUser = directData[0];
        const requiredFields = ['id', 'username', 'email', 'role'];
        const missingFields = requiredFields.filter(field => !(field in sampleUser));
        
        if (missingFields.length > 0) {
          addDebugInfo({ 
            type: 'warning', 
            message: `⚠️ Missing fields in API response: ${missingFields.join(', ')}`,
            data: `Available fields: ${Object.keys(sampleUser).join(', ')}`
          });
        } else {
          addDebugInfo({ type: 'success', message: '✅ All required fields present in API response' });
        }
      }

      // Test 4: POST request
      addDebugInfo({ type: 'info', message: '📝 Testing POST request...' });
      
      const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test${Date.now()}@army.gov.in`,
        role: 'USER',
        password: 'test123'
      };

      const postResponse = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser)
      });

      if (postResponse.ok) {
        const createdUser = await postResponse.json();
        addDebugInfo({ 
          type: 'success', 
          message: '✅ POST request successful',
          data: JSON.stringify(createdUser, null, 2)
        });
      } else {
        const errorText = await postResponse.text();
        addDebugInfo({ 
          type: 'error', 
          message: `❌ POST request failed - Status: ${postResponse.status}`,
          data: errorText
        });
      }

    } catch (error) {
      addDebugInfo({ 
        type: 'error', 
        message: `❌ Test failed: ${error.message}`,
        data: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testFrontendIntegration = async () => {
    setLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugInfo({ type: 'info', message: '🔗 Testing frontend integration...' });
      
      // Test App context loading
      addDebugInfo({ type: 'info', message: '📋 Simulating App.jsx loadInitialData...' });
      
      const [usersData, workshopsData, requestsData, approvalsData, rolesData] = await Promise.all([
        apiService.getUsers(),
        apiService.getWorkshops(), 
        apiService.getPartRequests(),
        apiService.getApprovals(),
        apiService.getRoles()
      ]);
      
      addDebugInfo({ 
        type: 'success', 
        message: '✅ All APIs called successfully',
        data: `Users: ${usersData?.length || 0}, Workshops: ${workshopsData?.length || 0}, Requests: ${requestsData?.length || 0}, Approvals: ${approvalsData?.length || 0}, Roles: ${rolesData?.length || 0}`
      });

      // Check data format
      if (usersData && Array.isArray(usersData)) {
        addDebugInfo({ type: 'success', message: '✅ Users data is array format - correct!' });
      } else {
        addDebugInfo({ 
          type: 'error', 
          message: '❌ Users data is not array format',
          data: `Type: ${typeof usersData}, Value: ${JSON.stringify(usersData)}`
        });
      }

    } catch (error) {
      addDebugInfo({ 
        type: 'error', 
        message: `❌ Frontend integration test failed: ${error.message}`,
        data: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setDebugInfo([]);
  };

  return (
    <div style={{
      backgroundColor: '#f0f9ff',
      border: '2px solid #3b82f6',
      padding: '20px',
      margin: '20px',
      borderRadius: '8px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h2 style={{ color: '#1d4ed8' }}>🔍 Detailed API Debugger</h2>
      <p>CORS config dekh kar - ab detailed testing karte hain</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testRealAPI}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Testing...' : '🧪 Test Real API'}
        </button>
        
        <button
          onClick={testFrontendIntegration}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Testing...' : '🔗 Test Frontend Integration'}
        </button>

        <button
          onClick={clearLogs}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🧹 Clear Logs
        </button>
      </div>

      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {debugInfo.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#6b7280' }}>
            Click buttons above to start debugging...
          </p>
        ) : (
          debugInfo.map((info, index) => (
            <div key={index} style={{
              margin: '10px 0',
              padding: '12px',
              borderRadius: '5px',
              border: `1px solid ${
                info.type === 'success' ? '#10b981' : 
                info.type === 'error' ? '#ef4444' :
                info.type === 'warning' ? '#f59e0b' : '#6b7280'
              }`,
              backgroundColor: 
                info.type === 'success' ? '#f0fdf4' : 
                info.type === 'error' ? '#fef2f2' :
                info.type === 'warning' ? '#fffbeb' : '#f9fafb'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '5px' 
              }}>
                <span style={{ 
                  fontWeight: 'bold',
                  color: 
                    info.type === 'success' ? '#059669' : 
                    info.type === 'error' ? '#dc2626' :
                    info.type === 'warning' ? '#d97706' : '#374151'
                }}>
                  {info.message}
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {info.timestamp}
                </span>
              </div>
              
              {info.data && (
                <pre style={{
                  backgroundColor: '#f3f4f6',
                  padding: '8px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  overflow: 'auto',
                  margin: '5px 0 0 0',
                  maxHeight: '200px'
                }}>
                  {info.data}
                </pre>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fef3c7',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 What to look for:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li><strong>Direct fetch works:</strong> CORS is fixed ✅</li>
          <li><strong>ApiService fails:</strong> Issue in apiService.js code</li>
          <li><strong>Wrong data format:</strong> Backend returning unexpected structure</li>
          <li><strong>Missing fields:</strong> API response doesn't match expected format</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDebugDetailed;