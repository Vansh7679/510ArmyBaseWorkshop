// services/apiService.js
// Real API implementation matching your backend controllers
const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  baseURL: API_BASE_URL,
  
  // User Management APIs - Matching UserController
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  createUser: async (userData) => {
    try {
      // Match CreateUserDTO structure
      const createUserDTO = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        rank: userData.rank,
        phoneNumber: userData.phoneNumber,
        department: userData.department,
        role: userData.role
      };
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserDTO)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },
  
  getUserByUsername: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/username/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  },
  
  getUserByEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },
  
  // Workshop Management APIs - Matching WorkshopController
  getWorkshops: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workshops`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching workshops:', error);
      throw error;
    }
  },
  
  createWorkshop: async (workshopData) => {
    try {
      // Match CreateWorkshopDTO structure
      const createWorkshopDTO = {
        name: workshopData.name,
        location: workshopData.location
      };
      
      const response = await fetch(`${API_BASE_URL}/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createWorkshopDTO)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating workshop:', error);
      throw error;
    }
  },
  
  getWorkshopById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workshops/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching workshop by ID:', error);
      throw error;
    }
  },
  
  getWorkshopByName: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workshops/name/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching workshop by name:', error);
      throw error;
    }
  },
  
  // Part Request Management APIs - Matching PartRequestController
  getPartRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/part-requests`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching part requests:', error);
      throw error;
    }
  },
  
  createPartRequest: async (requestData) => {
    try {
      // Match CreateRequestDTO structure
      const createRequestDTO = {
        partName: requestData.partName,
        partNumber: requestData.partNumber,
        quantity: requestData.quantity,
        priority: requestData.priority,
        workshopId: requestData.workshopId,
        requiredDate: requestData.requiredDate,
        description: requestData.description,
        estimatedCost: requestData.estimatedCost
      };
      
      const response = await fetch(`${API_BASE_URL}/part-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': requestData.userId || '1' // Required header as per controller
        },
        body: JSON.stringify(createRequestDTO)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating part request:', error);
      throw error;
    }
  },
  
  getPartRequestById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/part-requests/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching part request by ID:', error);
      throw error;
    }
  },
  
  getPartRequestsByUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/part-requests/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching part requests by user:', error);
      throw error;
    }
  },
  
  getPartRequestsByWorkshop: async (workshopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/part-requests/workshop/${workshopId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching part requests by workshop:', error);
      throw error;
    }
  },
  
  getPartRequestsByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/part-requests/status/${status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching part requests by status:', error);
      throw error;
    }
  },
  
  // Approval Management APIs - Matching ApprovalController
  getApprovals: async () => {
    try {
      // Since there's no GET /api/approvals endpoint in your controller,
      // we'll return empty array for now
      console.warn('No GET /api/approvals endpoint found in backend');
      return [];
    } catch (error) {
      console.error('Error fetching approvals:', error);
      throw error;
    }
  },
  
  createApproval: async (partRequestId, approvalData) => {
    try {
      // Match ApproveRequestDTO structure
      const approveRequestDTO = {
        status: approvalData.status, // APPROVED or REJECTED
        comments: approvalData.comments
      };
      
      const response = await fetch(`${API_BASE_URL}/approvals/part-request/${partRequestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': approvalData.approverId || '1' // Required header as per controller
        },
        body: JSON.stringify(approveRequestDTO)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating approval:', error);
      throw error;
    }
  },
  
  getApprovalById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approval by ID:', error);
      throw error;
    }
  },
  
  getApprovalsByApprover: async (approverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/approver/${approverId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals by approver:', error);
      throw error;
    }
  },
  
  getApprovalsByPartRequest: async (partRequestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/part-request/${partRequestId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals by part request:', error);
      throw error;
    }
  },
  
  // Role Management APIs - Matching RoleController
  getRoles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  createRole: async (roleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },
  
  getRoleById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching role by ID:', error);
      throw error;
    }
  },
  
  getRoleByName: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/name/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching role by name:', error);
      throw error;
    }
  }
};