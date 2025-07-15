const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const uploadContentToS3 = catchAsync(async (file, channelId, filetype) => {
  try {
    const response = await axios.post(
      `${process.env.LOCALHOST_AWS_URL}/api/v1/aws/s3/s3-upload-content`,
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
