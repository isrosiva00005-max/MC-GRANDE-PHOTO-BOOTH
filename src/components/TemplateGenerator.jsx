import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Send } from 'lucide-react';

const TemplateGenerator = ({ userData, photoUrl }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // REPLACE THIS URL with your deployed Google Apps Script Web App URL
  const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxAvJi5784bMZU1ue-l2l1Acvd6j_9Wirb2EN4EWdHY0lKIhB-Zy8pzWwGMmq7rYJJTiQ/exec";

  const handleDownload = async () => {
    if (!canvasRef.current || !photoUrl) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 3, // High resolution
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `McGrande-2026-${userData.name || 'Alumni'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!canvasRef.current || !photoUrl) return;

    if (!WEBHOOK_URL) {
      alert("Please configure your Google Apps Script Webhook URL in TemplateGenerator.jsx first!");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2, // slightly lower resolution for payload size
        backgroundColor: null,
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      const payload = {
        name: userData.name,
        batch: userData.batch,
        department: userData.department,
        eta: userData.eta,
        image_data_url: dataUrl
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        // using text/plain prevents CORS preflight issues with some basic webhook setups
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.result === 'success') {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error("Failed to submit", err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="canvas-container">
      <h2 style={{ color: 'var(--text-main)', width: '100%' }}>Your Custom Graphic</h2>
      
      <div 
        className="template-preview" 
        ref={canvasRef}
        style={{
          width: '100%', 
          maxWidth: '500px', 
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {photoUrl ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif" }}>
            
            {/* User Photo (Full Canvas) */}
            <div style={{
              width: '100%',
              zIndex: 1
            }}>
              <img 
                src={photoUrl} 
                alt="User" 
                crossOrigin="anonymous" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transform: `scale(${userData.photoScale || 1}) translate(${userData.photoX || 0}%, ${userData.photoY || 0}%)`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
            
            {/* McGrande Logo */}
            <div style={{
              position: 'absolute',
              top: '5%',
              right: '5%',
              zIndex: 3,
              width: '80px',
              height: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
            }}>
              <img 
                src="https://res.cloudinary.com/dk2wudmxh/image/upload/v1764009528/mc_logo_semi_trans_x35apl.png" 
                alt="McGrande Logo"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            
            {/* Year Badge at Top Left */}
            <div style={{
              position: 'absolute',
              top: '6%',
              left: '5%',
              zIndex: 3,
              background: 'rgba(0,0,0,0.6)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                ({userData.year || 'YYYY - YYYY'})
              </span>
            </div>
            
            {/* Text Details (Overlaid on photo) */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 20px 30px',
              zIndex: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 40%, transparent 100%)',
              textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '2.4rem', color: '#fdfbf7', margin: '0 0 5px 0', fontWeight: 'bold', letterSpacing: '1px', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                {userData.name || 'Your Name'}
              </h1>
              <h2 style={{ fontSize: '1rem', color: '#d4af37', margin: '0 0 12px 0', fontWeight: 'normal', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {userData.department || 'DEPARTMENT'} <span style={{ color: '#cbd5e1', margin: '0 5px' }}>|</span> <span style={{ color: '#cbd5e1' }}>CLASS OF {userData.year || 'YYYY'}</span>
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#fdfbf7', fontStyle: 'italic', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  "We are here!"
                </span>
                {userData.eta && (
                  <span style={{ background: 'rgba(0,0,0,0.5)', color: '#d4af37', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid #d4af37', backdropFilter: 'blur(4px)' }}>
                    ETA: {userData.eta}
                  </span>
                )}
              </div>
              
              {/* Footer */}
              <div style={{
                width: '100%',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.75rem',
                borderTop: '1px solid rgba(212,175,55,0.3)',
                paddingTop: '10px',
                marginTop: '5px'
              }}>
                <strong style={{ color: '#e2e8f0', fontWeight: 'normal' }}>Mepco Schlenk Engineering College</strong><br/>
                <span style={{ color: '#d4af37', fontStyle: 'italic' }}>www.mepcoeng.ac.in</span>
              </div>
            </div>
            
          </div>
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#64748b',
            padding: '2rem',
            background: 'rgba(0,0,0,0.5)'
          }}>
            Upload a photo to see it perfectly framed.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <button 
          className="btn" 
          onClick={handleDownload} 
          disabled={!photoUrl || isGenerating || isSubmitting}
          style={{ opacity: (!photoUrl || isGenerating || isSubmitting) ? 0.5 : 1, flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <Download size={20} />
          {isGenerating ? 'Wait...' : 'Download'}
        </button>

        <button 
          className="btn" 
          onClick={handleSubmit} 
          disabled={!photoUrl || isSubmitting || isGenerating}
          style={{ opacity: (!photoUrl || isSubmitting || isGenerating) ? 0.5 : 1, flex: 2 }}
        >
          <Send size={20} />
          {isSubmitting ? 'Submitting...' : 'Register & Submit Photo'}
        </button>
      </div>
      
      {submitStatus === 'success' && (
        <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem', textAlign: 'center' }}>
          ✅ Successfully submitted to Google Sheets!
        </div>
      )}
      {submitStatus === 'error' && (
        <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '0.5rem', textAlign: 'center' }}>
          ❌ Failed to submit. Check configuration.
        </div>
      )}
    </div>
  );
};

export default TemplateGenerator;
