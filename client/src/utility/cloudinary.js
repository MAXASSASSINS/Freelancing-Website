import axios from 'axios';


export const uploadToCloudinary = async (arr) => {
    const urls = [];

    for (const item of arr) {
      if (!item.type) {
        urls.push(item);
        continue;
      }
      const cloudName = 'dyod45bn8';
      const formData = new FormData();
      formData.append('file', item);
      formData.append('upload_preset', 'syxrot1t');
      formData.append('cloud_name', cloudName);
      const data = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      })
      console.log(data);
      const obj = {};
      if (item.type.includes("video")) {
        obj.videoPublicId = data.data.public_id;
        obj.videoUrl = data.data.secure_url;
        obj.videoName = data.data.original_filename;
        obj.mimeType = data.data.format;
      }
      else {
        obj.imgPublicId = data.data.public_id
        obj.imgUrl = data.data.secure_url
      }

      urls.push(obj);
    }
    return urls;
  }