import React, { useState, useRef, useEffect } from 'react';
import './VirtualTryOn.css';

const BACKEND_URL = 'http://localhost:3001'; // your locally deployed backend
const POLL_INTERVAL = 3000;
const MAX_POLLS = 30;

function VirtualTryOn({ productImageUrl, productName, onClose }) {
  const [phase, setPhase] = useState('upload'); // 'upload' | 'loading' | 'result' | 'error'
  const [previewSrc, setPreviewSrc] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const selectedFile = useRef(null);
  const pollRef = useRef(null);
  const pollCount = useRef(0);

  // Cleanup polling on unmount
  useEffect(() => () => clearInterval(pollRef.current), []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Please upload a JPEG or PNG image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image too large — max 10MB.');
      return;
    }
    selectedFile.current = file;
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile.current) return;

    setPhase('loading');
    setProgress(5);
    pollCount.current = 0;

    // Build multipart form — matches backend: upload.single('human_image') + body.cloth_image_url
    const formData = new FormData();
    formData.append('human_image', selectedFile.current);
    formData.append('cloth_image_url', productImageUrl);

    try {
      const res = await fetch(`${BACKEND_URL}/api/tryon`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.task_id) {
        throw new Error(data.error || 'Failed to start try-on task.');
      }

      // Start polling
      setProgress(15);
      startPolling(data.task_id);

    } catch (err) {
      setPhase('error');
      setErrorMsg(err.message);
    }
  };

  const startPolling = (taskId) => {
    pollRef.current = setInterval(async () => {
      pollCount.current += 1;

      // Animate progress bar
      setProgress((p) => Math.min(p + 3, 90));

      if (pollCount.current > MAX_POLLS) {
        clearInterval(pollRef.current);
        setPhase('error');
        setErrorMsg('Timed out. Please try again.');
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/tryon/${taskId}`);
        const data = await res.json();

        if (data.status === 'done') {
          clearInterval(pollRef.current);
          setProgress(100);
          setResultUrl(data.image_url);
          setPhase('result');
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current);
          setPhase('error');
          setErrorMsg(data.reason || 'Try-on failed. Try a different photo.');
        }
        // status === 'processing' → keep polling
      } catch {
        // Network glitch — keep polling, don't abort
      }
    }, POLL_INTERVAL);
  };

  const reset = () => {
    clearInterval(pollRef.current);
    selectedFile.current = null;
    setPreviewSrc(null);
    setResultUrl(null);
    setErrorMsg('');
    setProgress(0);
    setPhase('upload');
  };

  return (
    <div className="vton-wrapper" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="vton-modal">
        <button className="vton-close" onClick={onClose}>✕</button>

        <div className="vton-header">
          <h2>👗 Virtual Try-On</h2>
          <p>See how this item looks on you before you buy</p>
        </div>

        {/* Garment preview strip */}
        <div className="vton-product-strip">
          <img src={productImageUrl} alt={productName} className="vton-garment-thumb" />
          <div>
            <strong>{productName}</strong>
            <span>Upload your photo to try it on</span>
          </div>
        </div>

        {/* ── UPLOAD PHASE ── */}
        {phase === 'upload' && (
          <div className="vton-upload-section">
            {!previewSrc ? (
              <div className="vton-drop-zone" onClick={() => fileRef.current.click()}>
                <span>📷</span>
                <p>Click or drag &amp; drop your photo</p>
                <small>JPEG or PNG · max 10MB</small>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            ) : (
              <div className="vton-preview">
                <img src={previewSrc} alt="Your photo" />
                <button className="vton-btn-secondary" onClick={() => fileRef.current.click()}>
                  Change Photo
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            )}

            <p className="vton-tip">💡 Stand straight, full body visible · plain background · good lighting</p>

            {errorMsg && <p className="vton-error">{errorMsg}</p>}

            <button className="vton-btn-primary" onClick={handleSubmit} disabled={!previewSrc}>
              Generate Try-On
            </button>
          </div>
        )}

        {/* ── LOADING PHASE ── */}
        {phase === 'loading' && (
          <div className="vton-loading-section">
            <div className="vton-spinner" />
            <p>Creating your try-on image…</p>
            <small>This takes about 10–30 seconds</small>
            <div className="vton-progress-bar">
              <div className="vton-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── RESULT PHASE ── */}
        {phase === 'result' && (
          <div className="vton-result-section">
            <p className="vton-result-label">✨ Your Try-On Result</p>
            <img src={resultUrl} alt="Virtual try-on result" className="vton-result-img" />
            <a href={resultUrl} download="tryon-result.jpg" className="vton-btn-primary" target="_blank" rel="noreferrer">
              ⬇ Download
            </a>
            <button className="vton-btn-secondary" onClick={reset}>🔄 Try Another Photo</button>
          </div>
        )}

        {/* ── ERROR PHASE ── */}
        {phase === 'error' && (
          <div className="vton-error-section">
            <p>❌ {errorMsg}</p>
            <button className="vton-btn-primary" onClick={reset}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualTryOn;
