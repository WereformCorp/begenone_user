const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const videoUrlPath = isProd
  ? process.env.PRODUCTION_APP_VIDEO_API_URL_PRODUCTION
  : process.env.LOCALHOST_VIDEO_URL;

const getAllVideos = catchAsync(async () => {
  try {
    const data = await axios.get(`${videoUrlPath}/api/v1/videos`);

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = getAllVideos;
