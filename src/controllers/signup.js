const crypto = require('crypto');

const User = require('../models/userModel');
// const createUser = require('../../services/user/createUser');
const getAllPricings = require('../services/subscription/getAllPricings');
const createSubscription = require('../services/subscription/createSubscription');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

const signup = catchAsync(async (req, res, next) => {
  try {
    // Step 1: Create the new user first, without the subscription

    const newUser = await User.create(req.body);

    if (!newUser) return next(new AppError('User creation failed', 404));
    console.log(`NEW USER CREATED:`, newUser);

    // Step 2: Now, fetch the pricing information
    const PricingsData = await getAllPricings();

    // console.log(`PricingsData: `, PricingsData.data);
    const Pricings = PricingsData.data.data;
    console.log(`Pricings from Sign Up Function: `, Pricings);
    const newUserPricing = Pricings.find(
      (pricing) => pricing.name === 'signup' && pricing.active === true
    );

    if (!newUserPricing)
      return next(new AppError('Default PRICING not found', 404));
    console.log(`SIGNUP pricing:`, newUserPricing);

    // Step 3: Create the subscription using the newly created user's ID
    const newSubscriptionData = await createSubscription({
      user: newUser._id,
      pricings: newUserPricing._id,
      pricingName: 'signup',
      status: 'active',
      autoRenew: true,
    });

    const newSubscription = newSubscriptionData.data;
    console.log(`NEW USER ID:`, newUser._id.toString());
    console.log(`NEW SUBSCRIPTION CREATED:`, newSubscription);

    // Step 4: Update the user with the new subscription IDs
    await User.findByIdAndUpdate(newUser._id, {
      subscriptions: newSubscription._id,
      currentActiveSubscription: newSubscription._id,
    });

    await newUser.save(); // Save the updated user with the new subscription
    console.log(`NEW USER AFTER ALL THE CHANGES`, newUser);

    const message = `A new user has signed up! Name: ${newUser.name.firstName} ${newUser.name.secondName} and email address: ${newUser.eAddress.email}`;

    await sendMail({
      email: `areeshpersonal5@gmail.com`,
      subject: `A New User Signed Up!`,
      message,
    });

    // Step 5: Proceed with the rest of your flow
    req.newUser = newUser;
    next();
  } catch (err) {
    console.log(err.message);
  }
});

const signupAuth = catchAsync(async (req, res, next) => {
  console.log(`SIGN UP AUTHENTICATION BEGINS HERE`);

  // 1) Get User based on Posted EMAIL
  const { newUser } = req;
  // console.log(`NEW USER:`, newUser);
  const resetToken = crypto.randomBytes(32).toString('hex');

  const signUpAuthToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  if (!newUser) return next(new AppError(`Data Not Found!`, 404));

  // 2) Generate random reset token
  // newUser.signupAuthToken = signUpAuthToken;
  // const updatedUser = await User.findByIdAndUpdate(newUser._id, {
  //   eAddress: {
  //     signupAuthToken: signUpAuthToken,
  //     signupAuthTokenExpiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
  //   },
  // });

  const updatedUser = await User.findByIdAndUpdate(
    newUser._id,
    {
      $set: {
        'eAddress.signupAuthToken': signUpAuthToken,
        'eAddress.signupAuthTokenExpiresIn':
          Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    },
    { new: true } // Return the updated document
  );

  console.log(`SIGN UP TOKEN:`, signUpAuthToken);
  console.log(`UPDATED USER before sending EMAIL:`, updatedUser);

  // 3) Send it to user's email
  const authURL = `${req.protocol}://${req.get(
    'host'
  )}/verify-email/${signUpAuthToken}`;

  const message = `Please confirm your email here: ${authURL}`;
  console.log(`Message from SIGN UP: `, message);

  try {
    await sendMail({
      email: newUser.eAddress.email,
      subject: `Your Sign Up Authentication Email (Valid for 10 minutes)`,
      message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (err) {
    console.log(`SIGNUP | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    // throw err;
  }
});

module.exports = {
  signup,
  signupAuth,
};
