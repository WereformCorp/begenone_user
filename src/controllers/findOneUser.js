const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const getOneUser = catchAsync(async (req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  const hashedToken = req.body.hashedToken;
  console.log('Request QUERY:', hashedToken);

  try {
    const user = await User.findOne({
      $or: [
        {
          'eAddress.signupAuthToken': hashedToken,
          'eAddress.signupAuthTokenExpiresIn': { $gt: Date.now() },
        },
        {
          'eAddress.resendAuthToken': hashedToken,
          'eAddress.resendAuthTokenExpiresIn': { $gt: Date.now() },
        },
      ],
    });

    console.log(`User from GetOneUser: `, user);

    if (!user) {
      return next(new AppError('User Not Found!', 404));
    }

    // Mark user as verified
    user.eAddress.signupAuthToken = undefined;
    user.eAddress.signupAuthTokenExpiresIn = undefined;
    user.eAddress.verified = true;

    await user.save();

    return res.status(200).json({
      status: 'Success',
      data: user,
    });
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    return next(err);
  }
});

module.exports = { getOneUser };
