import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../ui/HolographicOS.module.scss';

interface DidAvatarProps {
  isActive: boolean;
  onClose: () => void;
}

export default function DidAvatar({ isActive, onClose }: DidAvatarProps) {
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('did_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const connectToDid = async () => {
    if (!apiKey) return;
    setIsConnecting(true);
    localStorage.setItem('did_api_key', apiKey);

    try {
      // 1. Create Peer Connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }, 
          { urls: 'stun:stun.l.google.com:5349' } // Fallback
        ],
      });

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.play();
        }
      };

      // 2. Create Stream via D-ID API
      // Note: In production, this call should go through a backend proxy to hide the key.
      // For this local demo, we use the key directly.
      const createStreamResp = await fetch('https://api.d-id.com/talks/streams', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: "https://d-id-public-bucket.s3.amazonaws.com/or-roman.jpg", // Default Avatar
        }),
      });

      if (!createStreamResp.ok) throw new Error(`Failed to create stream: ${createStreamResp.statusText}`);
      const { id: newStreamId, offer, sdp, ice_servers, session_id } = await createStreamResp.json();
      
      setStreamId(newStreamId);
      setSessionId(session_id);

      // 3. Set Remote Description (Offer)
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // 4. Create Answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // 5. Send Answer back to D-ID
      const sdpResp = await fetch('https://api.d-id.com/talks/streams/' + newStreamId + '/sdp', {
         method: 'POST',
         headers: {
           Authorization: `Basic ${apiKey}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           answer: answer,
           session_id: session_id
         })
      });

      // 6. Handle ICE Candidates
      if (ice_servers) {
         // If D-ID provided ICE servers, we might want to update our PC config, 
         // but usually the initial STUN is enough for basic connect.
      }
      
      pc.onicecandidate = (event) => {
          if (event.candidate) {
             fetch('https://api.d-id.com/talks/streams/' + newStreamId + '/ice', {
                 method: 'POST',
                 headers: {
                     Authorization: `Basic ${apiKey}`,
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     candidate: event.candidate,
                     session_id: session_id
                 })
             });
          }
      };

      setPeerConnection(pc);
      setIsConnecting(false);

    } catch (err) {
      console.error(err);
      alert("Connection failed. Check API Key/Console.");
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
      if (streamId && sessionId && apiKey) {
          try {
             await fetch(`https://api.d-id.com/talks/streams/${streamId}`, {
                 method: 'DELETE',
                 headers: { Authorization: `Basic ${apiKey}`, 'Content-Type': 'application/json' },
                 body: JSON.stringify({ session_id: sessionId })
             });
          } catch(e) { console.log(e); }
      }
      peerConnection?.close();
      setPeerConnection(null);
      setStreamId(null);
      setSessionId(null);
      onClose();
  };

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '400px',
      background: 'rgba(0,0,0,0.9)',
      border: '1px solid #00ff9d',
      boxShadow: '0 0 20px rgba(0,255,157,0.3)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div className={styles.windowHeader}>
         <h3>PRESENCE_UPLINK</h3>
         <div className={styles.windowControls}>
             <span className={styles.close} onClick={disconnect}>×</span>
         </div>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
         {/* Video Element for Stream */}
         <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: streamId ? 1 : 0.3 }} 
         />
         
         {!streamId && (
             <div style={{ position: 'absolute', width: '80%', textAlign: 'center' }}>
                 <p style={{ color: '#00ff9d', marginBottom: '10px' }}>AUTHENTICATION REQUIRED</p>
                 <input 
                    type="password" 
                    placeholder="Enter D-ID API Key (Basic Auth)" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(0, 50, 20, 0.5)',
                        border: '1px solid #00ff9d',
                        color: '#fff',
                        padding: '8px',
                        marginBottom: '10px',
                        borderRadius: '4px'
                    }}
                 />
                 <button 
                    className={styles.actionLink} 
                    onClick={connectToDid}
                    disabled={isConnecting}
                 >
                    {isConnecting ? 'ESTABLISHING_UPLINK...' : 'INITIALIZE_STREAM'}
                 </button>
             </div>
         )}
      </div>
      
      <div className={styles.statusBox}>
          STATUS: {streamId ? 'STREAM_ACTIVE' : 'AWAITING_UPLINK'}
      </div>
    </div>
  );
}
