import React from 'react';
import '../styles/Videos.css';

export default function Videos() {
  return (
    <div className="videos-page">
      <h2 className="page-title">Instructional Videos</h2>

      <div className="video-grid">
        <div className="video-box">
          <iframe
            src="https://www.youtube.com/embed/O6Xo21L0ybE"
            title="Basic Training Video"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-box">
          <iframe
            src="https://www.youtube.com/embed/MpXOgwpDi2s?si=BrvnR4qnWpKBHkEr"
            title="Equipment Usage Guide"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-box">
          <iframe
            src="https://www.youtube.com/embed/L0Yy46xLUCw?si=kqhL28SAgmyvtA32"
            title="Safety Instructions"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
