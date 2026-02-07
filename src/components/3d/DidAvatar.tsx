

import React, { useState, useEffect, useRef } from 'react';
import styles from '../ui/HolographicOS.module.scss';
import * as did from '@d-id/client-sdk';
import { ASSETS, CONFIG } from '../../config/assets';

interface DidAvatarProps {
  isActive: boolean;
  onClose: () => void;
}

export default function DidAvatar({ isActive, onClose }: DidAvatarProps) {
  const [agentManager, setAgentManager] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('DISCONNECTED');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  // Auto-connect when active
  useEffect(() => {
    if (isActive && !agentManager && !hasError) {
        connectToAgent();
    }
  }, [isActive, agentManager, hasError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (agentManager) {
        agentManager.disconnect();
      }
    };
  }, [agentManager]);

  const connectToAgent = async () => {
    const apiKey = CONFIG.did.apiKey;
    
    if (!apiKey) {
        setConnectionStatus('ERROR: Missing API Key in .env');
        setHasError(true);
        return;
    }

    setConnectionStatus('SECURING_UPLINK...');

    try {
        // 1. Get Client Key
        // Check local storage first
        let clientKey = localStorage.getItem('did_client_key');
        
        if (!clientKey) {
            // Call our server-side proxy to handle creation/reset securely and avoid CORS
            const response = await fetch("/api/did/key", {
                method: "POST"
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 console.error("D-ID Proxy Error:", errorData);
                 throw new Error(`Auth failed: ${errorData.error || response.statusText}`);
            }
            
            const data = await response.json();
            clientKey = data.client_key;
            localStorage.setItem('did_client_key', clientKey!);
        }

        // 2. Get or Create Agent
        // Ideally we use a persistent ID. For now, we'll try to find one or create one.
        // Simplified: Just create a fresh session for this "Talk" or use a known ID if you have one.
        // NOTE: 'createAgentManager' typically needs an existing Agent ID. 
        // We will try to create a *new* agent if we don't have one stored.
        
        let agentId = localStorage.getItem('did_agent_id');
        
        if (!agentId) {
             setConnectionStatus('PROVISIONING_AVATAR...');
             // Compute auth header once
             let authHeader = apiKey.startsWith('Basic ') ? apiKey : `Basic ${apiKey}`;
             if (apiKey.includes(':') && !apiKey.startsWith('Basic ')) {
                 authHeader = `Basic ${btoa(apiKey)}`;
             }

             const agentResp = await fetch("https://api.d-id.com/agents", {
                 method: "POST",
                 headers: {
                     "Authorization": authHeader,
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                     "presenter": {
                         "type": "talk",
                         "voice": { "type": "microsoft", "voice_id": CONFIG.did.defaultVoice },
                         "thumbnail": "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg",
                         "source_url": "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg"
                     },
                     "llm": {
                         "type": "openai",
                         // We are using our own agent logic, so maybe 'd-id-agent' type or just 'talk'?
                         // Actually for SDK streaming we usually need an ID. 
                         // If this fails, we might need to check the payload structure.
                         "provider": "openai",
                         "model": "gpt-4o-mini",
                         "instructions": "You are Franky, a futuristic holographic interface assistant."
                     }
                 })
             });
             
             if (agentResp.ok) {
                 const agentData = await agentResp.json();
                 agentId = agentData.id;
                 localStorage.setItem('did_agent_id', agentId as string);
             } else {
                 const errorText = await agentResp.text();
                 console.error("Agent Creation Failed:", agentResp.status, errorText);
                 throw new Error(`Failed to provision new avatar agent: ${agentResp.status} ${errorText}`);
             }
        }

        // 3. Initialize SDK
        const callbacks = {
             onSrcObjectReady(value: any) {
               if (videoRef.current) {
                   videoRef.current.srcObject = value;
               }
             },
             onConnectionStateChange(state: string) {
               setConnectionStatus(state);
             },
             onNewMessage(msgs: any[], type: string) {
                const newMsgs = msgs.map(m => ({ role: m.role, content: m.content }));
                setMessages(prev => [...prev, ...newMsgs]);
             },
             onError(error: any) {
                 console.error("Agent Error:", error);
                 setConnectionStatus(`ERROR: ${error.message || 'Stream Failed'}`);
             }
        };

        const agentMgr = await did.createAgentManager(agentId!, { 
             auth: { type: 'key', clientKey: clientKey || '' }, 
             callbacks 
        });

        setAgentManager(agentMgr);
        
        setConnectionStatus('ESTABLISHING_NEURAL_LINK...');
        await agentMgr.connect();
        setConnectionStatus('CONNECTED');
        
        await agentMgr.speak({ type: "text", input: "Systems Online." });

    } catch (err: any) {
        console.error(err);
        setConnectionStatus(`CONNECTION_FAILED: ${err.message}`);
        setHasError(true);
    }
  };

  const handleSendChat = async () => {
      if (!agentManager || !chatInput.trim()) return;
      const text = chatInput;
      setChatInput('');
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      try {
          await agentManager.chat(text);
      } catch (e) {
          console.error(e);
      }
  };

  const handleDisconnect = async () => {
      if (agentManager) {
          await agentManager.disconnect();
          setAgentManager(null);
      }
      onClose();
  };

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '450px',
      height: '600px',
      background: 'rgba(10, 15, 20, 0.95)',
      border: '1px solid #00ff9d',
      boxShadow: '0 0 30px rgba(0,255,157,0.2)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      color: '#00ff9d',
      fontFamily: 'Orbitron, sans-serif'
    }}>
      <div className={styles.windowHeader}>
         <h3>DID_AGENT_AXIOM</h3>
         <div className={styles.windowControls}>
             <span className={styles.close} onClick={handleDisconnect}>×</span>
         </div>
      </div>

      {/* Video Area */}
      <div style={{ 
          height: '300px', 
          background: '#000', 
          position: 'relative',
          borderBottom: '1px solid rgba(0,255,157,0.3)',
          overflow: 'hidden'
      }}>
         {/* Background / Idle Video */}
         <video 
            src={ASSETS.avatar.idleVideo}
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: connectionStatus === 'CONNECTED' ? 0 : 0.5 // Fade out idle when connected? Or keep as backup?
                // Actually D-ID usually replaces the srcObject. 
                // We show this ONLY if stream is not ready yet?
            }} 
         />
         
         {/* Live Stream Video */}
         <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                zIndex: 10,
                opacity: connectionStatus === 'CONNECTED' ? 1 : 0
            }} 
         />

         {connectionStatus !== 'CONNECTED' && (
              <div style={{
                  position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                  background:'rgba(0,0,0,0.7)', padding:'10px', zIndex: 20,
                  whiteSpace: 'nowrap'
              }}>
                  {connectionStatus}
              </div>
         )}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', overflow: 'hidden' }}>
          <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              marginBottom: '10px', 
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
          }}>
              {messages.length === 0 && (
                  <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '20px' }}>
                      <p>SECURE CHANNEL ESTABLISHED.</p>
                      <p>AWAITING INPUT...</p>
                  </div>
              )}
              {messages.map((m, i) => (
                  <div key={i} style={{ 
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      background: m.role === 'user' ? 'rgba(0,255,157,0.2)' : 'rgba(0, 150, 255, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      maxWidth: '80%'
                  }}>
                      <strong>{m.role === 'user' ? 'YOU' : 'AGENT'}:</strong> {m.content}
                  </div>
              ))}
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                 type="text" 
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                 placeholder={agentManager ? "Transmit Message..." : "Authenticating..."}
                 disabled={!agentManager}
                 style={{
                     flex: 1,
                     background: 'rgba(0,0,0,0.5)',
                     border: '1px solid #00ff9d',
                     color: '#fff',
                     padding: '8px'
                 }}
              />
              <button 
                  className={styles.actionLink} 
                  onClick={handleSendChat}
                  disabled={!agentManager}
              >
                  SEND
              </button>
          </div>
      </div>
      
      <div className={styles.statusBox}>
          STATUS: {connectionStatus}
      </div>
    </div>
  );
}
