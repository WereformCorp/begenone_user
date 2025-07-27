const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const subscriptionUrlPath = isProd
  ? process.env.PRODUCTION_APP_SUBSCRIPTION_API_URL_PRODUCTION
  : process.env.LOCALHOST_SUBSCRIPTION_URL;

const createSubscription = catchAsync(
  async ({
    user,
    pricingName,
    pricings,
    status = 'active',
    autoRenew = true,
  }) => {
    try {
      const subscription = await axios.post(
        `${subscriptionUrlPath}/api/v1/subscription/route-pricings/`,
        {
          user, // Renaming `user` to `userId`
          pricingName,
          pricings, // Renaming `pricings` to `pricingId`
          status,
          autoRenew,
        }
      );

      const subscriptionData = subscription.data; // Ensure correct response handling
      if (!subscriptionData) {
        throw new Error('Subscription API did not return valid data');
      }

      return subscriptionData;
    } catch (err) {
      console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
      // throw err;
    }
  }
);

module.exports = createSubscription;
