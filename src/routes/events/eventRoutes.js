const express = require('express');

// const forgotPassword = require('../../services/password/forgetPassword');
// const resetPassword = require('../../services/password/resetPassword');
// const protect = require('../../middlewares/protectMiddleware');
// const updatePassword = require('../../services/password/updatePassword');

const router = express.Router({ mergeParams: true });

// router.post('/forgotPassword', forgotPassword);
// router.patch('/resetPassword/:token', resetPassword);
// router.patch('/updateMyPassword', protect, updatePassword);

module.exports = router;
