import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const verifyCloudinary = () => {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  };

  if (!config.api_key || !config.api_secret) {
    throw new Error('Missing Cloudinary credentials in environment variables');
  }

  cloudinary.config(config);
  
  // Test configuration
  return cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', {
    folder: 'config-test',
    overwrite: false
  })
  .then(() => true)
  .catch(error => {
    console.error('Cloudinary verification failed:', error);
    throw new Error('Cloudinary configuration test failed');
  });
};

export { cloudinary, verifyCloudinary };