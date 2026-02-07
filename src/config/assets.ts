export const ASSETS = {
  avatar: {
    // Default idle video for the D-ID avatar
    // Replace this URL with your hosted video or local public path
    idleVideo: '/assets/avatar/idle.mp4', 
    thumbnail: '/assets/avatar/thumbnail.jpg'
  },
  simulation: {
    preview: '/assets/simulation/preview.jpg'
  }
};

export const CONFIG = {
  did: {
    // Always prioritize environment variable
    apiKey: process.env.NEXT_PUBLIC_DID_API_KEY || '',
    agentId: process.env.NEXT_PUBLIC_DID_AGENT_ID, // Optional: if we want to hardcode a specific agent
    defaultVoice: 'en-US-JennyNeural'
  }
};
