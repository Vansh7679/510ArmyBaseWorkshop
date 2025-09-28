// pages/Workshops.jsx
import React, { useState } from 'react';
import { Plus, Wrench, MapPin, Users, Settings, Eye, Edit } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.jsx';
import CreateWorkshopModal from '../components/modals/CreateWorkshopModal.jsx';

const Workshops = () => {
  const { workshops, setWorkshops, partRequests, apiService } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateWorkshop = async (workshopData) => {
    try {
      const newWorkshop = await apiService.createWorkshop(workshopData);
      setWorkshops(prev => [...prev, newWorkshop]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create workshop:', error);
    }
  };

  return (
    <div className="workshops">
      <div className="page-header">
        <div className="header-content">
          <h1>Workshop Management</h1>
          <p>Manage military workshop facilities and operations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus /> New Workshop
          </button>
        </div>
      </div>
      
      <div className="workshops-grid">
        {workshops.map(workshop => {
          const workshopRequests = partRequests.filter(req => req.workshopId === workshop.id);
          const pendingCount = workshopRequests.filter(req => req.status === 'PENDING').length;
          const approvedCount = workshopRequests.filter(req => req.status === 'APPROVED').length;
          
          return (
            <div key={workshop.id} className="workshop-card">
              <div className="workshop-header">
                <div className="workshop-icon">
                  <Wrench />
                </div>
                <div className="workshop-status">
                  <span className={`status-indicator ${workshop.status.toLowerCase()}`}></span>
                  <span className="status-text">{workshop.status}</span>
                </div>
              </div>
              
              <div className="workshop-content">
                <h3>{workshop.name}</h3>
                
                <div className="workshop-details">
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="detail-item">
                    <Users className="detail-icon" />
                    <span>{workshop.capacity} personnel</span>
                  </div>
                </div>
                
                <div className="workshop-stats">
                  <div className="stat-grid">
                    <div className="stat-item">
                      <span className="stat-number">{workshopRequests.length}</span>
                      <span className="stat-label">Total Requests</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number pending">{pendingCount}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number approved">{approvedCount}</span>
                      <span className="stat-label">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="workshop-actions">
                <button className="btn btn-outline btn-sm">
                  <Eye /> View Requests
                </button>
                <button className="btn btn-outline btn-sm">
                  <Edit /> Edit Details
                </button>
                <button className="btn btn-outline btn-sm">
                  <Settings /> Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {showCreateModal && (
        <CreateWorkshopModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWorkshop}
        />
      )}
    </div>
  );
};

export default Workshops;