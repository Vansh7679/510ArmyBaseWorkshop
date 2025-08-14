import React from 'react';
import './Request.css';

export default function Request() {
  return (
    <div className="request-page">
      <div className="request-container">
        <h2><span className="green-text">Part Request</span> <span className="yellow-text">Submission</span></h2>

        <form className="request-form">
          <label>Upload Damaged Part Image:</label>
          <input type="file" />

          <label>Issue Description:</label>
          <textarea placeholder="Describe the issue..."></textarea>

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
