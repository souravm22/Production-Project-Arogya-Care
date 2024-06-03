const express = require("express");
const {
  loginController,
  registerController,
  authConroller,
  authController,
  applyDoctorContoller,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  userAppointmentController,
  getUserController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

//routes
router.post("/", loginController);
// login post
router.post("/login", loginController);

// register post

router.post("/register", registerController);

// auth post
router.post("/getUserData", authMiddleware, authController);

// applydoctor post
router.post("/apply-doctor", authMiddleware, applyDoctorContoller);

// get not
// router.post(
//   "/get-all-notification",
//   authMiddleware,
//   getAllNotificationController
// );

// delete all notif, post
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// book appointment , post
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// appointments list user, post
router.get("/user-appointments", authMiddleware, userAppointmentController);

router.post("/getUser", authMiddleware, getUserController);
module.exports = router;
