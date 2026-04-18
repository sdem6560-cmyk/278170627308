import axios from 'axios';

export const fetchShodanDetails = async (ip: string) => {
  const apiKey = localStorage.getItem('sentinel_shodan_key');
  if (!apiKey) {
    return { error: '⚠️ مفتاح Shodan API مفقود. يرجى إضافته في الإعدادات.' };
  }

  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`);
    return response.data;
  } catch (error: any) {
    console.error('Shodan API Error:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      return { error: '⚠️ مفتاح Shodan API غير صالح.' };
    }
    return { error: '⚠️ فشل الاتصال بخدمة Shodan.' };
  }
};

export const fetchVirusTotalReport = async (resource: string) => {
  const apiKey = localStorage.getItem('sentinel_vt_key');
  if (!apiKey) {
    return { error: '⚠️ مفتاح VirusTotal API مفقود. يرجى إضافته في الإعدادات.' };
  }

  try {
    const response = await axios.get(`https://www.virustotal.com/api/v3/files/${resource}`, {
      headers: { 'x-apikey': apiKey }
    });
    return response.data;
  } catch (error: any) {
    console.error('VirusTotal API Error:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      return { error: '⚠️ مفتاح VirusTotal API غير صالح.' };
    }
    return { error: '⚠️ فشل الاتصال بخدمة VirusTotal.' };
  }
};
