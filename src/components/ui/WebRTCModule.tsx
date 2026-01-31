"use client";

import { useEffect, useRef, useState } from "react";

export default function WebRTCModule({ roomId = "lobby" }: { roomId?: string }) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // 1. Get Local Stream
    async function startStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Failed to access media devices:", err);
      }
    }
    startStream();

    return () => {
      // Cleanup
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, []); // Run on mount

  // Simple "Loopback" Peer Connection for Demo
  // In production, this would use a Signaling Server (WebSocket/Socket.io)
  const startCall = async () => {
    const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnectionRef.current = pc;

    // Add local tracks
    if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    // Handle remote track
    pc.ontrack = (event) => {
        const [remote] = event.streams;
        setRemoteStream(remote);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
    };

    // Create Offer (Mock handshake usually requires signaling)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    // Simulating "Remote" answer (Loopback for demo)
    // In real app: Send offer to server -> Server sends to peer -> Peer answers
    console.log("Offer created:", offer);
    alert("WebRTC Handshake Initiated. (Signaling Server Required for P2P connection)");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', color: '#0f0' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
         <div style={{ position: 'relative' }}>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '150px', border: '1px solid #0f0' }} />
            <span style={{ position: 'absolute', bottom: 2, left: 2, background:'black', fontSize:'10px' }}>LOCAL (YOU)</span>
         </div>
         <div style={{ position: 'relative' }}>
             <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '150px', border: '1px solid red' }} />
             <span style={{ position: 'absolute', bottom: 2, left: 2, background:'black', fontSize:'10px' }}>REMOTE (PEER)</span>
         </div>
      </div>
      <button 
        onClick={startCall}
        style={{ 
            background: 'rgba(0, 255, 0, 0.2)', 
            border: '1px solid #0f0', 
            color: '#0f0', 
            padding: '5px',
            fontFamily: 'monospace',
            cursor: 'pointer'
        }}
      >
        INITIATE_HANDSHAKE
      </button>
    </div>
  );
}
