import { storage } from '../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

// API to get all available AR campaigns
export const getARCampaigns = async () => {
  try {
    const campaigns = [];
    
    // List all images and videos in storage
    const imagesRef = ref(storage, 'images/');
    const videosRef = ref(storage, 'videos/');
    
    const [imagesList, videosList] = await Promise.all([
      listAll(imagesRef),
      listAll(videosRef)
    ]);
    
    // Get download URLs for all images
    const imageUrls = await Promise.all(
      imagesList.items.map(item => getDownloadURL(item))
    );
    
    // Get download URLs for all videos
    const videoUrls = await Promise.all(
      videosList.items.map(item => getDownloadURL(item))
    );
    
    // Create campaign objects
    const campaignData = imageUrls.map((imageUrl, index) => ({
      id: `campaign-${index + 1}`,
      imageUrl,
      videoUrl: videoUrls[index] || videoUrls[0] // Fallback to first video
    }));
    
    return {
      campaigns: campaignData
    };
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return { campaigns: [] };
  }
};

// API to get specific campaign by ID
export const getCampaignById = async (campaignId) => {
  try {
    const campaigns = await getARCampaigns();
    return campaigns.campaigns.find(camp => camp.id === campaignId) || campaigns.campaigns[0];
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
};