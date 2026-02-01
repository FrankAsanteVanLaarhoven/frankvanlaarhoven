import React, { useState, useEffect, useRef } from 'react';
import styles from '../ui/HolographicOS.module.scss';
// Dynamically import SDK to avoid SSR issues if necessary, or just import if client-only
import * as did from '@d-id/client-sdk';

interface DidAvatarProps {
  isActive: boolean;
  onClose: () => void;
}

export default function DidAvatar({ isActive, onClose }: DidAvatarProps) {
  const [apiKey, setApiKey] = useState('');
  const [clientKey, setClientKey] = useState('');
  const [agentManager, setAgentManager] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('DISCONNECTED');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('did_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (agentManager) {
        agentManager.disconnect();
      }
    };
  }, [agentManager]);

  const generateClientKey = async () => {
    if (!apiKey) return;
    setConnectionStatus('GENERATING_KEY');
    localStorage.setItem('did_api_key', apiKey);

    try {
      // Exchange Basic Auth API Key for restricted Client Key
      // NOTE: In a production app, this should be done on a secure backend!
      const response = await fetch("https://api.d-id.com/agents/client-key", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          allowed_domains: [window.location.origin] 
        })
      });

      if (!response.ok) throw new Error(`Failed to get client key: ${response.statusText}`);
      
      const data = await response.json();
      if (data.client_key) {
        setClientKey(data.client_key);
        initializeAgent(data.client_key);
      } else {
        throw new Error("No client_key returned");
      }
    } catch (err: any) {
      console.error(err);
      setConnectionStatus(`ERROR: ${err.message}`);
    }
  };

  const initializeAgent = async (cKey: string) => {
    if (!videoRef.current) return;
    setConnectionStatus('INITIALIZING_SDK');

    try {
        // Hardcoded Agent ID for demo - user might need to create one first or we use a public one if available?
        // The user docs say: "const agentId = 'agt_abc123';"
        // We probably need to CREATE an agent first or ask user for Agent ID. 
        // For the "Avatar Scenario", let's assume we need to create one or user has one.
        // Actually, let's try to CREATE an agent on the fly if we don't have one, 
        // or asking the user might be too complex. 
        // Let's use a known default or create one. 
        // Docs: "Create an agent... POST /agents" -> Returns agent_id.
        // Let's allow user to input Agent ID or use a default one I can try to create.
        
        // Wait, for V2 streams/Talks we didn't need Agent ID. 
        // But SDK says "createAgentManager(agentId, ...)"
        // Let's try to create a standard agent first.
        
        let agentId = localStorage.getItem('did_agent_id');
        
        if (!agentId) {
             setConnectionStatus('CREATING_AGENT');
             // Create a new Agent
             const agentResp = await fetch("https://api.d-id.com/agents", {
                 method: "POST",
                 headers: {
                     "Authorization": `Basic ${apiKey}`,
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                     "presenter": {
                         "type": "talk",
                         "voice": { "type": "microsoft", "voice_id": "en-US-JennyNeural" },
                         "thumbnail": "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg",
                         "source_url": "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg"
                     },
                     "llm": {
                         "type": "openai",
                         "provider": "openai",
                         "model": "gpt-3.5-turbo",
                         "instructions": "You are a futuristic holographic interface assistant named Franky. Keep answers short and technical."
                     }
                 })
             });
             if (agentResp.ok) {
                 const agentData = await agentResp.json();
                 agentId = agentData.id;
                 localStorage.setItem('did_agent_id', agentId as string);
             } else {
                 console.warn("Failed to create agent, trying connection anyway if ID exists...");
             }
        }

        if (!agentId) throw new Error("Could not obtain Agent ID");

        const callbacks = {
          onSrcObjectReady(value: any) {
            if (videoRef.current) {
                videoRef.current.srcObject = value;
            }
          },
          onConnectionStateChange(state: string) {
            setConnectionStatus(state);
          },
          onNewMessage(messages: any[], type: string) {
             // D-ID sends array of messages
             const newMsgs = messages.map(m => ({
                 role: m.role, 
                 content: m.content
             }));
             setMessages(prev => [...prev, ...newMsgs]);
          },
          onError(error: any) {
              console.error("Agent Error:", error);
              setConnectionStatus(`ERROR: ${error.message || 'Unknown'}`);
          }
        };

        const agentMgr = await did.createAgentManager(agentId, { 
            auth: { type: 'key', clientKey: cKey }, 
            callbacks 
        });

        setAgentManager(agentMgr);
        
        setConnectionStatus('CONNECTING_RTC');
        await agentMgr.connect();
        setConnectionStatus('CONNECTED');
        
        await agentMgr.speak({ type: "text", input: "Holographic Interface Online. Ready." });

    } catch (err: any) {
        console.error(err);
        setConnectionStatus(`SDK ERROR: ${err.message}`);
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
      setConnectionStatus('DISCONNECTED');
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
         <h3>D-ID_AGENT_UPLINK</h3>
         <div className={styles.windowControls}>
             <span className={styles.close} onClick={handleDisconnect}>×</span>
         </div>
      </div>

      {/* Video Area */}
      <div style={{ 
          height: '300px', 
          background: '#000', 
          position: 'relative',
          borderBottom: '1px solid rgba(0,255,157,0.3)'
      }}>
         <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
         />
         {!agentManager && connectionStatus === 'DISCONNECTED' && (
             <div style={{
                 position: 'absolute', top:0, left:0, width:'100%', height:'100%',
                 display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
                 padding: '20px'
             }}>
                 <p style={{marginBottom: '10px'}}>SECURE_KEY REQUIRED</p>
                 <input 
                    type="password" 
                    placeholder="D-ID API Key (Basic Auth)" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid #00ff9d',
                        color: '#fff',
                        padding: '8px',
                        marginBottom: '10px'
                    }}
                 />
                 <button className={styles.actionLink} onClick={generateClientKey}>
                    INITIALIZE_AGENT
                 </button>
             </div>
         )}
         {connectionStatus !== 'DISCONNECTED' && connectionStatus !== 'CONNECTED' && (
              <div style={{
                  position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                  background:'rgba(0,0,0,0.7)', padding:'10px'
              }}>
                  {connectionStatus}...
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
                 placeholder="Transmit Message..."
                 disabled={connectionStatus !== 'CONNECTED'}
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
                  disabled={connectionStatus !== 'CONNECTED'}
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
