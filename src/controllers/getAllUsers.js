const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.find().populate('eAddress');
    // .populate({
    //   path: 'channel',
    //   select: '-__v',
    // });

    // users.forEach((user) => {
    //   console.log(`USER E_ADDRESS AND MORE.`, user.eAddress);
    // });

    if (!users) return next(new AppError(`Users Not Found!`, 404));

    return res.status(200).json({
      status: 'Success',
      results: users.length,
      data: users,
    });
  } catch (err) {
    console.log(`GET ALL USERS | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllUsers;
