import React from 'react';
import { Link } from 'react-router-dom';
import armyBg from '../assets/army-bg.png'; // Ensure this path is correct

const Home = () => {
  const backgroundStyle = {
    backgroundImage: `url(${armyBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent dark background
    padding: '50px',
    borderRadius: '15px',
    textAlign: 'center',
    color: '#FFD700', // golden color
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
    maxWidth: '700px',
    width: '100%',
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    marginTop: '30px',
    fontSize: '18px',
  };

  const listItemStyle = {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#fff',
    background: 'linear-gradient(to right, #4CAF50, #388E3C)',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background 0.3s ease',
    fontWeight: 'bold',
  };

  const linkHoverStyle = {
    background: 'linear-gradient(to right, #66BB6A, #2E7D32)',
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <h1>Welcome to Army Support Portal</h1>
        <p>Choose an option:</p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            <span role="img" aria-label="video">🎥</span>
            <Link
              to="/videos"
              style={linkStyle}
              onMouseOver={e => (e.target.style.background = linkHoverStyle.background)}
              onMouseOut={e => (e.target.style.background = linkStyle.background)}
            >
              Watch Instructional Videos
            </Link>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="box">📦</span>
            <Link
              to="/request"
              style={linkStyle}
              onMouseOver={e => (e.target.style.background = linkHoverStyle.background)}
              onMouseOut={e => (e.target.style.background = linkStyle.background)}
            >
              Request Parts
            </Link>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="status">📋</span>
            <Link
              to="/status"
              style={linkStyle}
              onMouseOver={e => (e.target.style.background = linkHoverStyle.background)}
              onMouseOut={e => (e.target.style.background = linkStyle.background)}
            >
              View Status
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
