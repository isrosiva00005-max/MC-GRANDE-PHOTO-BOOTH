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
        <input 
          type="text" 
          id="year" 
          name="year" 
          className="form-control" 
          placeholder="e.g. 2020 - 2024"
          value={userData.year}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="batch">Batch</label>
        <input 
          type="text" 
          id="batch" 
          name="batch" 
          className="form-control" 
          placeholder="e.g. Section A"
          value={userData.batch}
          onChange={handleChange}
        />
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
    </div>
  );
};

export default PhotoUploadForm;
