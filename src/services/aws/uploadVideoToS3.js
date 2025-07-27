const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const awsUrlPath = isProd
  ? process.env.PRODUCTION_APP_AWS_API_URL_PRODUCTION
  : process.env.LOCALHOST_AWS_URL;

const uploadVideoToS3 = catchAsync(async (file, channelId) => {
  try {
    const response = await axios.post(
      `${awsUrlPath}/api/v1/aws/s3/s3-upload-video`,
      {
        file,
        channelId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { uploadVideoToS3 };
