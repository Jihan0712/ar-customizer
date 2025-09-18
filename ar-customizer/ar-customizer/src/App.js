import React, { useState } from 'react';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function App() {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error("Error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageUrl(url);
          alert('Image uploaded!');
        });
      }
    );
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideo(file);

    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error("Error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setVideoUrl(url);
          alert('Video uploaded!');
        });
      }
    );
  };

  return (
    <div>
      <h1>Customize Your AR Experience</h1>

      <label>Upload Target Image:</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: 200 }} />}

      <label>Upload Video to Play:</label>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      {videoUrl && <video src={videoUrl} controls style={{ width: 300 }} />}

      <button onClick={() => {
        // Save to database or localStorage
        localStorage.setItem('client-image', imageUrl);
        localStorage.setItem('client-video', videoUrl);
        alert('Saved! Share this link with your AR app.');
      }}>
        Save & Share
      </button>
    </div>
  );
}

export default App;