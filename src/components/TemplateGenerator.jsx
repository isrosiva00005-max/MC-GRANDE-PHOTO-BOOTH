import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Send } from 'lucide-react';

const TemplateGenerator = ({ userData, photoUrl }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [previewScale, setPreviewScale] = useState(1);

  React.useEffect(() => {
    const handleResize = () => {
      const wrapper = document.getElementById('canvas-wrapper');
      if (wrapper) {
        const width = wrapper.offsetWidth;
        if (width < 400) {
          setPreviewScale(width / 400);
        } else {
          setPreviewScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleShare = async () => {
    if (!canvasRef.current || !photoUrl) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2, 
        backgroundColor: null,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `McGrande-2026-${userData.name || 'Alumni'}.png`, { type: 'image/png' });
        
        // Use Native Web Share API (Works beautifully on mobile iOS/Android for Whatsapp/Insta/FB)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'McGrande 2026',
              text: "Let's meet at Mc Grande 2026! 🎓",
              files: [file]
            });
          } catch (shareErr) {
            console.log("User cancelled share or share failed:", shareErr);
          }
        } else {
          // Fallback if browser doesn't support file sharing (e.g. some desktops)
          const link = document.createElement('a');
          link.download = file.name;
          link.href = URL.createObjectURL(blob);
          link.click();
          alert("Your image was downloaded! You can now manually share it to WhatsApp, Instagram, or Facebook.");
        }
      }, 'image/png');
    } catch (err) {
      console.error("Failed to share", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="canvas-container" style={{ width: '100%' }}>
      <h2 style={{ color: 'var(--text-main)', width: '100%', textAlign: 'center' }}>Your Custom Graphic</h2>
      
      <div id="canvas-wrapper" style={{ width: '100%', maxWidth: '100vw', display: 'flex', justifyContent: 'center', height: 500 * previewScale, marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center', width: '400px', height: '500px' }}>
          <div 
            className="template-preview" 
            ref={canvasRef}
            style={{
              width: '400px', 
              height: '500px', 
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#000',
              borderRadius: '16px'
            }}
          >
        {photoUrl ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif" }}>
            
            {/* User Photo (Full Canvas) */}
            <div style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              overflow: 'hidden'
            }}>
              <img 
                src={photoUrl} 
                alt="User" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${50 + Number(userData.photoX || 0)}% ${50 + Number(userData.photoY || 0)}%`,
                  display: 'block',
                  transform: `scale(${Math.max(1, Number(userData.photoScale || 1))})`,
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
              <div style={{ 
                fontSize: (userData.name || 'Your Name').length > 10 
                  ? `${Math.max(1.6, 2.8 - ((userData.name || 'Your Name').length - 10) * 0.15)}rem` 
                  : '2.8rem', 
                color: '#d4af37', 
                margin: '0 0 2px 0', 
                fontWeight: 'normal', 
                fontStyle: 'italic', 
                letterSpacing: '1px', 
                textShadow: '0 2px 4px rgba(0,0,0,0.9)' 
              }}>
                {userData.name || 'Your Name'}
              </div>
              
              {userData.year && userData.year !== ' - ' && (
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 15px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  {userData.year}
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#fdfbf7', fontStyle: 'italic', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  Let's meet at Mc Grande 2026
                </span>
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
      </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <button 
          className="btn" 
          onClick={handleDownload} 
          disabled={!photoUrl || isGenerating}
          style={{ opacity: (!photoUrl || isGenerating) ? 0.5 : 1, flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <Download size={20} />
          {isGenerating ? 'Wait...' : 'Download'}
        </button>

        <button 
          className="btn" 
          onClick={handleShare} 
          disabled={!photoUrl || isGenerating}
          style={{ opacity: (!photoUrl || isGenerating) ? 0.5 : 1, flex: 2 }}
        >
          <Send size={20} />
          {isGenerating ? 'Wait...' : 'Share to App (WhatsApp, Insta)'}
        </button>
      </div>
    </div>
  );
};

export default TemplateGenerator;
