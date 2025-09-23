import React, { useState } from 'react';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const sRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(sRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Image upload: ' + progress + '%');
      },
      (error) => console.error("Image upload error:", error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(url);
        alert('Image uploaded!');
      }
    );
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);

    const sRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(sRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Video upload: ' + progress + '%');
      },
      (error) => console.error("Video upload error:", error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setVideoUrl(url);
        alert('Video uploaded!');
      }
    );
  };

  const saveAndShare = () => {
    if (!imageUrl || !videoUrl) {
      alert('Please upload both image and video first!');
      return;
    }

    // Generate shareable link
    const baseUrl = "https://your-ar-app.com"; // ← REPLACE WITH YOUR 8TH WALL APP URL
    const params = new URLSearchParams();
    params.set('image', imageUrl);
    params.set('video', videoUrl);
    const shareLink = `${baseUrl}?${params.toString()}`;

    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied! Share it with your AR app.');
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Customize Your AR Experience</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Upload Target Image:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Upload Video to Play:</label>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
        {videoUrl && <video src={videoUrl} controls style={{ width: '300px', marginTop: '10px' }} />}
      </div>

      <button onClick={saveAndShare}>
        Save & Share
      </button>
    </div>
  );
}

export default App;