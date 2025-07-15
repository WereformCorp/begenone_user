const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const updateUser = catchAsync(async (req, res, next) => {
  try {
    console.log(`REQUESTS from Update User: `, req.params.id, req.body);

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    console.log(`Updated User from updateUser.js: `, user);

    if (!user) {
      return next(new AppError('No document Found with that ID', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    console.log(`UPDATE USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateUser;
