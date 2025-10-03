import React, { useState } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    alert('✅ Image uploaded!');
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    alert('✅ Video uploaded!');
  };

  const generateARLink = () => {
    if (!imageUrl || !videoUrl) {
      alert('⚠️ Please upload both image and video first!');
      return '';
    }

    // 🔁 REPLACE WITH YOUR DEPLOYED 8TH WALL APP URL
    const baseUrl = "https://web-ar-app-nine.vercel.app";

    const params = new URLSearchParams();
    params.set('image', imageUrl);
    params.set('video', videoUrl);

    return `${baseUrl}?${params.toString()}`;
  };

  const copyLink = () => {
    const link = generateARLink();
    if (!link) return;

    navigator.clipboard.writeText(link)
      .then(() => alert('🎉 Link copied to clipboard!\nOpen on mobile to start AR.'))
      .catch(err => {
        console.error('Copy failed:', err);
        alert('Copy failed. Please copy manually:\n' + link);
      });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>✨ AR Customization Portal</h1>
        <button 
          onClick={() => window.location.href = '/login.html'}
          style={{
            padding: '8px 16px',
            background: '#e2e8f0',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🖼️ Upload Target Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🎥 Upload Video to Play (MP4, H.264, 10MB)</h3>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
        {videoUrl && <video src={videoUrl} controls style={{ width: '300px', marginTop: '10px' }} />}
      </div>

      <button onClick={copyLink} disabled={!imageUrl || !videoUrl}>
        📲 Copy AR Link
      </button>

      {imageUrl && videoUrl && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
          <strong>🔗 Your AR Link:</strong><br />
          <code>{generateARLink()}</code>
        </div>
      )}
    </div>
  );
}

export default App;