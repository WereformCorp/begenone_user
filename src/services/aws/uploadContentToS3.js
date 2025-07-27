const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const awsUrlPath = isProd
  ? process.env.PRODUCTION_APP_AWS_API_URL_PRODUCTION
  : process.env.LOCALHOST_AWS_URL;

const uploadContentToS3 = catchAsync(async (file, channelId, filetype) => {
  try {
    const response = await axios.post(
      `${awsUrlPath}/api/v1/aws/s3/s3-upload-content`,
      {
        file,
        channelId,
        filetype,
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

module.exports = { uploadContentToS3 };
