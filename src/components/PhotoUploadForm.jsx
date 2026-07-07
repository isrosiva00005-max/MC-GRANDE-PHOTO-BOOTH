import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { templates } from '../templates';

const PhotoUploadForm = ({ userData, onDataChange, onPhotoUpload }) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onPhotoUpload(imageUrl);
    }
  };

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
        <label htmlFor="year">Batch Year (From - To)</label>
        <select 
          id="year" 
          name="year" 
          className="form-control" 
          value={userData.year}
          onChange={handleChange}
          style={{ appearance: 'auto', paddingRight: '2rem' }}
        >
          <option value="" disabled>Select Batch Year</option>
          <option value="2018 - 2022">2018 - 2022</option>
          <option value="2019 - 2023">2019 - 2023</option>
          <option value="2020 - 2024">2020 - 2024</option>
          <option value="2021 - 2025">2021 - 2025</option>
          <option value="2022 - 2026">2022 - 2026</option>
        </select>
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

      <div className="form-group">
        <label htmlFor="eta">Expected Time of Arrival (ETA)</label>
        <select 
          id="eta" 
          name="eta" 
          className="form-control" 
          value={userData.eta}
          onChange={handleChange}
          style={{ appearance: 'auto', paddingRight: '2rem' }}
        >
          <option value="" disabled>Select Arrival Time</option>
          <option value="17 July 6 PM">17 July 6 PM</option>
          <option value="18th July 10 AM">18th July 10 AM</option>
        </select>
      </div>



      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>Upload Photo</label>
        <div className="file-upload-wrapper" onClick={() => fileInputRef.current.click()}>
          <UploadCloud className="upload-icon" size={48} />
          <p style={{ color: 'var(--text-muted)' }}>Click to browse or drag & drop</p>
          <input 
            type="file" 
            className="file-upload-input" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            title=""
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
            min="0.5" 
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
