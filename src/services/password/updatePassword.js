const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const updatePassword = catchAsync((async) => {
  try {
    const data = axios.patch(
      `${process.env.AUTH_URL}/api/v1/authentication/route-password/updateMyPassword`
    );
  } catch (err) {
    throw new Error({
      Error: err,
      message: "Something didn't work as expected.",
    });
  }
});

module.exports = { updatePassword };
