// const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware");
// const getDoctorInfoController = require("../controllers/doctorCtrl");
// const router = express.Router();

// // get single doc info post method
// router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);
// module.exports = router;

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");
const router = require("express").Router();

// get single doc info post method
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// update doctor post
router.post("/updateProfile", authMiddleware, updateProfileController);

// get single doc info || post
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// get appointments
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

router.post("/update-status", authMiddleware, updateStatusController);
module.exports = router;
