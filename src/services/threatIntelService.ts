import axios from 'axios';

export const fetchShodanDetails = async (ip: string) => {
  const apiKey = localStorage.getItem('sentinel_shodan_key');
  if (!apiKey) return null;

  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error('Shodan API Error:', error);
    return null;
  }
};

export const fetchVirusTotalReport = async (resource: string) => {
  const apiKey = localStorage.getItem('sentinel_vt_key');
  if (!apiKey) return null;

  try {
    const response = await axios.get(`https://www.virustotal.com/api/v3/files/${resource}`, {
      headers: { 'x-apikey': apiKey }
    });
    return response.data;
  } catch (error) {
    console.error('VirusTotal API Error:', error);
    return null;
  }
};
