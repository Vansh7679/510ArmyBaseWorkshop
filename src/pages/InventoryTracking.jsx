// pages/InventoryTracking.jsx
import React, { useState } from 'react';
import { Package, Search, Filter, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.jsx';

const InventoryTracking = () => {
  const { partRequests } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock inventory data - in real app this would come from API
  const inventoryItems = [
    {
      id: 1,
      partName: 'Engine Oil Filter',
      partNumber: 'EOF-2024-001',
      category: 'Engine Components',
      currentStock: 25,
      minimumStock: 10,
      maximumStock: 100,
      unitCost: 1500,
      supplier: 'Military Supplies Corp',
      lastRestocked: '2025-09-15',
      location: 'Warehouse A-1'
    },
    {
      id: 2,
      partName: 'Radio Antenna',
      partNumber: 'RA-2024-002',
      category: 'Communication Equipment',
      currentStock: 5,
      minimumStock: 8,
      maximumStock: 50,
      unitCost: 5000,
      supplier: 'CommTech Industries',
      lastRestocked: '2025-09-10',
      location: 'Warehouse C-2'
    },
    {
      id: 3,
      partName: 'Hydraulic Pump',
      partNumber: 'HP-2024-003',
      category: 'Hydraulic Systems',
      currentStock: 12,
      minimumStock: 5,
      maximumStock: 30,
      unitCost: 22500,
      supplier: 'Heavy Machinery Parts',
      lastRestocked: '2025-09-12',
      location: 'Warehouse B-3'
    },
    {
      id: 4,
      partName: 'Brake Pads',
      partNumber: 'BP-2024-004',
      category: 'Vehicle Components',
      currentStock: 2,
      minimumStock: 10,
      maximumStock: 200,
      unitCost: 400,
      supplier: 'Vehicle Parts Ltd',
      lastRestocked: '2025-09-08',
      location: 'Warehouse A-2'
    }
  ];

  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    const stockPercentage = (item.currentStock / item.maximumStock) * 100;
    if (item.currentStock <= item.minimumStock) return 'critical';
    if (stockPercentage < 25) return 'low';
    if (stockPercentage > 80) return 'high';
    return 'normal';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'var(--status-danger)';
      case 'low': return 'var(--status-warning)';
      case 'high': return 'var(--status-info)';
      case 'normal': return 'var(--status-success)';
      default: return 'var(--gray-500)';
    }
  };

  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const lowStockItems = inventoryItems.filter(item => getStockStatus(item) === 'critical' || getStockStatus(item) === 'low');

  return (
    <div className="inventory-tracking">
      <div className="page-header">
        <div className="header-content">
          <h1>Inventory Tracking</h1>
          <p>Monitor and manage parts inventory levels</p>
        </div>
      </div>
      
      {/* Inventory Statistics */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Package />
          </div>
          <div className="stat-content">
            <h3>{inventoryItems.length}</h3>
            <p>Total Parts</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                {categories.length} categories
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3>₹{totalValue.toLocaleString()}</h3>
            <p>Total Value</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <TrendingDown />
          </div>
          <div className="stat-content">
            <h3>{lowStockItems.length}</h3>
            <p>Low Stock Items</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                Need restock
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">
            <AlertTriangle />
          </div>
          <div className="stat-content">
            <h3>{inventoryItems.filter(item => getStockStatus(item) === 'critical').length}</h3>
            <p>Critical Stock</p>
            <div className="stat-breakdown">
              <span className="breakdown-item critical">
                Immediate action required
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search parts by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Inventory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Part Details</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Stock Status</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Location</th>
              <th>Last Restocked</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const stockStatus = getStockStatus(item);
              const stockPercentage = (item.currentStock / item.maximumStock) * 100;
              
              return (
                <tr key={item.id} className={stockStatus === 'critical' ? 'critical-row' : ''}>
                  <td>
                    <div className="part-details">
                      <span className="part-name">{item.partName}</span>
                      <span className="part-number">{item.partNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category">{item.category}</span>
                  </td>
                  <td>
                    <div className="stock-level">
                      <div className="stock-numbers">
                        <span className="current-stock">{item.currentStock}</span>
                        <span className="stock-range">/ {item.maximumStock}</span>
                      </div>
                      <div className="stock-bar">
                        <div 
                          className="stock-fill"
                          style={{ 
                            width: `${Math.min(stockPercentage, 100)}%`,
                            backgroundColor: getStockStatusColor(stockStatus)
                          }}
                        ></div>
                      </div>
                      <span className="min-stock">Min: {item.minimumStock}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStockStatusColor(stockStatus),
                        color: 'white'
                      }}
                    >
                      {stockStatus.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="unit-cost">₹{item.unitCost.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="total-value">₹{(item.currentStock * item.unitCost).toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="location">{item.location}</span>
                  </td>
                  <td>
                    <span className="last-restocked">{item.lastRestocked}</span>
                  </td>
                  <td>
                    <span className="supplier">{item.supplier}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredItems.length === 0 && (
          <div className="no-data">
            <Package className="no-data-icon" />
            <p>No inventory items found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Critical Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="alerts-section">
          <div className="alert-card critical">
            <AlertTriangle className="alert-icon" />
            <div className="alert-content">
              <h3>Stock Level Alerts</h3>
              <p>{lowStockItems.length} items require attention</p>
              <div className="alert-items">
                {lowStockItems.slice(0, 3).map(item => (
                  <div key={item.id} className="alert-item">
                    <span className="item-name">{item.partName}</span>
                    <span className="item-stock">Stock: {item.currentStock}</span>
                  </div>
                ))}
                {lowStockItems.length > 3 && (
                  <span className="more-items">+{lowStockItems.length - 3} more items</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTracking;