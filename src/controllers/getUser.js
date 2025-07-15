const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getUser = catchAsync(async (req, res, next) => {
  try {
    console.log(`REQUESTED PARAMS from GET USER FUNCTION: `, req.params.id);

    const user = await User.findById(req.params.id);

    console.log(`USER from GET USER FUNCTION: `, user);

    if (!user) next(new AppError(`User Not Found!`, 404));

    return res.status(200).json({
      status: 'Success',
      data: user,
    });
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getUser;
