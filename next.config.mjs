import { URL } from 'url';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
let remotePatterns = [];

try {
  const u = new URL(apiUrl);
  remotePatterns.push({
    protocol: u.protocol.replace(':', ''),
    hostname: u.hostname,                 
    port: u.port || '',                    
    pathname: '/**',                      
  });
} catch {
  console.warn('NEXT_PUBLIC_API_URL is missing or invalid:', apiUrl);
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;

