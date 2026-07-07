import { useState } from 'react';
import PhotoUploadForm from './components/PhotoUploadForm';
import TemplateGenerator from './components/TemplateGenerator';

function App() {
  const [userData, setUserData] = useState({
    name: '',
    year: '',
    department: '',
    eta: '',
    photoScale: 1,
    photoX: 0,
    photoY: 0,
    template: 'template-mca.jpg',
    frameTop: 27,
    frameLeft: 33.5,
    frameWidth: 33,
    frameHeight: 44
  });
  
  const [photoUrl, setPhotoUrl] = useState(null);

  const handleDataChange = (data) => {
    setUserData(data);
  };

  const handlePhotoUpload = (url) => {
    setPhotoUrl(url);
  };

  return (
    <div className="app-container">
      <header>
        <img 
          src="https://res.cloudinary.com/dk2wudmxh/image/upload/v1764009528/mc_logo_semi_trans_x35apl.png" 
          alt="McGrande 2026 Logo" 
          className="logo" 
        />
        <h1>McGrande 2026</h1>
        <p className="subtitle">Alumni Participation & Photo Portal</p>
      </header>

      <main className="main-content">
        <div className="card">
          <PhotoUploadForm 
            userData={userData}
            onDataChange={handleDataChange}
            onPhotoUpload={handlePhotoUpload}
          />
        </div>
        
        <div className="card">
          <TemplateGenerator 
            userData={userData}
            photoUrl={photoUrl}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
