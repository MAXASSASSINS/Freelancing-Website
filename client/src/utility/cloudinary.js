import axios from 'axios';
import { generateBlurHash } from './blurHash';


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
    // console.log(data);
    const obj = {};
    if (item.type.includes("video")) {
      obj.videoPublicId = data.data.public_id;
      obj.videoUrl = data.data.secure_url;
      obj.videoName = data.data.original_filename;
      obj.mimeType = data.data.format;
    }
    else if (item.type.includes('image')) {
      obj.imgPublicId = data.data.public_id
      obj.imgUrl = data.data.secure_url
      obj.imgName = data.data.original_filename
    }
    else {
      obj.public_id = data.data.public_id
      obj.url = data.data.secure_url
      obj.name = data.data.original_filename
    }

    urls.push(obj);
  }
  return urls;
}

const uploadToCloudinarySingle = async (item, maxSize) => {
  const cloudName = 'dyod45bn8';
  const formData = new FormData();
  formData.append('file', item);
  formData.append('upload_preset', 'syxrot1t');
  formData.append('cloud_name', cloudName);

  if (maxSize && item.size > maxSize) {
    return Promise.reject('File size is too big');
  }


  try {
    const data = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    })


    // creating blur hash
    const blurhash = await generateBlurHash(item, data.data.secure_url);
    console.log(blurhash);
    // const url = URL.createObjectURL(item);
    // console.log(url);
    // const blurhash = await encodeImageToBlurhash(url);
    // console.log(blurhash);

    console.log(data);
    const obj = {
      publicId: data.data.public_id,
      url: data.data.secure_url,
      name: data.data.original_filename,
      type: data.data.resource_type.toString() + '/' + data.data.format.toString(),
      size: data.data.bytes,
      blurhash: blurhash,
      height: data.data.height,
      width: data.data.width,
    }

    console.log(obj);

    return obj;
  }
  catch (error) {
    return Promise.reject(error);
  }

}

export const uploadToCloudinaryV2 = async (arr, maxSize) => {

  const requests = arr.map(item => {
    return uploadToCloudinarySingle(item, maxSize)
  })

  try {
    const ans = await Promise.all(requests);
    return ans;
  }
  catch (error) {
    console.log(error);
    return Promise.reject(error);
  }

}

