const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const subscriptionUrlPath = isProd
  ? process.env.PRODUCTION_APP_SUBSCRIPTION_API_URL_PRODUCTION
  : process.env.LOCALHOST_SUBSCRIPTION_URL;

const getAllPricings = catchAsync(async () => {
  try {
    const pricings = await axios.get(
      `${subscriptionUrlPath}/api/v1/subscription/route-pricings/`
    );

    const pricingsData = pricings || pricings.data;

    return pricingsData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllPricings;
