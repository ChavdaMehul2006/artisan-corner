const cloudinary = require('../config/cloudinary');

/**
 * Upload a file buffer to Cloudinary (or create data URI in fallback mode)
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @param {string} mimetype 
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = async (fileBuffer, folder = 'artisans_corner', mimetype = 'image/jpeg') => {
  try {
    // If real Cloudinary credentials are provided
    if (
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== '123456789012345' &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud'
    ) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        );
        stream.end(fileBuffer);
      });
    }

    // High-performance Base64 Data-URI fallback for local testing & development without live Cloudinary keys
    const base64Data = fileBuffer.toString('base64');
    const dataUri = `data:${mimetype};base64,${base64Data}`;
    const mockPublicId = `${folder}/local_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      url: dataUri,
      publicId: mockPublicId
    };
  } catch (error) {
    console.error('[Cloudinary Service] Upload Error:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary by public ID
 * @param {string} publicId 
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('http') || publicId.includes('local_')) {
    return; // Skip local/external URLs
  }

  try {
    if (
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== '123456789012345'
    ) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('[Cloudinary Service] Delete Error:', error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
