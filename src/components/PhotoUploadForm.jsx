import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { templates } from '../templates';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

const PhotoUploadForm = ({ userData, onDataChange, onPhotoUpload }) => {
  const fileInputRef = useRef(null);

  const [isDetecting, setIsDetecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ ...userData, [name]: value });
  };

  const autoCenterFace = async (imageUrl) => {
    setIsDetecting(true);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "CPU"
        },
        runningMode: "IMAGE"
      });

      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const detections = faceDetector.detect(img);
      
      if (detections.detections.length > 0) {
        // Get the most prominent face (first one)
        const face = detections.detections[0].boundingBox;
        
        const faceCenterX = face.originX + (face.width / 2);
        const faceCenterY = face.originY + (face.height / 2);
        
        // Calculate percentage offsets from center (50%)
        const pctX = (faceCenterX / img.width) * 100;
        const pctY = (faceCenterY / img.height) * 100;
        
        // Our TemplateGenerator expects photoX and photoY to be added to 50
        const photoX = Math.round(pctX - 50);
        const photoY = Math.round(pctY - 50);

        // User requested zoom to always start at 1
        const targetScale = 1;

        onDataChange({
          ...userData,
          photoX: photoX.toString(),
          photoY: photoY.toString(),
          photoScale: targetScale.toString()
        });
      } else {
        console.warn("No faces detected. Applying fallback.");
        onDataChange({
          ...userData,
          photoY: "-25"
        });
      }
    } catch (err) {
      console.error("Face detection failed, falling back to default.", err);
      // Fallback heuristic: If it's a portrait photo, faces are usually near the top.
      onDataChange({
        ...userData,
        photoY: "-25"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onPhotoUpload(imageUrl);
      
      // Instantly set a better default (top-heavy) while AI loads
      onDataChange({
        ...userData,
        photoX: "0",
        photoY: "-25",
        photoScale: "1"
      });
      
      // Auto detect and center face
      autoCenterFace(imageUrl);
    }
  };

  const yearStr = userData.year || '';
  const [fromY, toY] = yearStr.includes(' - ') ? yearStr.split(' - ') : ['', ''];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Your Details</h2>
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="form-control" 
          placeholder="e.g. Jane Doe"
          value={userData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Batch Year (From - To)</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            className="form-control" 
            value={fromY}
            onChange={(e) => {
              const newToY = toY || (parseInt(e.target.value) + 4).toString();
              onDataChange({ ...userData, year: `${e.target.value} - ${newToY}` });
            }}
          >
            <option value="" disabled>From Year</option>
            {Array.from({ length: 2027 - 1970 }, (_, i) => 2026 - i).map(year => (
              <option key={`from-${year}`} value={year}>{year}</option>
            ))}
          </select>
          <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>-</span>
          <select 
            className="form-control" 
            value={toY}
            onChange={(e) => {
              const newFromY = fromY || (parseInt(e.target.value) - 4).toString();
              onDataChange({ ...userData, year: `${newFromY} - ${e.target.value}` });
            }}
          >
            <option value="" disabled>To Year</option>
            {Array.from({ length: 2031 - 1974 }, (_, i) => 2030 - i).map(year => (
              <option key={`to-${year}`} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input 
          type="text" 
          id="department" 
          name="department" 
          className="form-control" 
          placeholder="e.g. Computer Science"
          value={userData.department}
          onChange={handleChange}
        />
      </div>





      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>Upload Photo</label>
        <div className="file-upload-wrapper" style={{ position: 'relative' }}>
          <UploadCloud className="upload-icon" size={48} />
          <p style={{ color: 'var(--text-muted)' }}>
            {isDetecting ? 'Scanning for faces... 🤖' : 'Click to browse or drag & drop'}
          </p>
          <input 
            type="file" 
            className="file-upload-input" 
            onChange={handleFileChange}
            accept="image/*"
            disabled={isDetecting}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              opacity: 0, 
              cursor: isDetecting ? 'wait' : 'pointer',
              zIndex: 10
            }}
          />
        </div>
      </div>

      {/* Photo Adjustments */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: '#f8fafc' }}>Photo Adjustments</h3>
        
        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Zoom</span>
            <span style={{ color: '#38bdf8' }}>{userData.photoScale}x</span>
          </label>
          <input 
            type="range" 
            name="photoScale" 
            min="1" 
            max="3" 
            step="0.1" 
            value={userData.photoScale || 1} 
            onChange={handleChange} 
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Horizontal Position</span>
            <span style={{ color: '#38bdf8' }}>{userData.photoX}%</span>
          </label>
          <input 
            type="range" 
            name="photoX" 
            min="-100" 
            max="100" 
            step="1" 
            value={userData.photoX || 0} 
            onChange={handleChange} 
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Vertical Position</span>
            <span style={{ color: '#38bdf8' }}>{userData.photoY}%</span>
          </label>
          <input 
            type="range" 
            name="photoY" 
            min="-100" 
            max="100" 
            step="1" 
            value={userData.photoY || 0} 
            onChange={handleChange} 
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadForm;
