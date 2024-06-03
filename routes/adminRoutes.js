const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
} = require("../controllers/adminCtrl");

const router = require("express").Router();

// get method , users
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// get method for all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

module.exports = router;
