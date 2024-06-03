const userModel = require("../models/userModels");
const bcrypt = require("bcrypt"); // here that .js adding is not working in my case, this should work fine ig
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const loginController = async (req, res) => {
  const appointmentModel = require("../models/appointmentModel");
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    } else {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(200).send({
          message: "Invalid Credentials, please verify",
          success: false,
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({
        message: "User Login Successful",
        success: true,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error in login controller ${error.message} `,
    });
  }
};

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(200).send({
        message: "user already exists",
        success: false,
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({
      message: "Registered Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `register controller ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  // console.log(req.headers);
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(200).send({
        message: "user not found",
        succcess: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
    });
  }
};

const applyDoctorContoller = async (req, res) => {
  try {
    const newDoctor = await doctorModel({
      ...req.body,
      status: "pending",
      userId: req.body.userId,
    });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;

    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for doctor",
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Notification deleted successfully",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notification",
      error,
    });
  }
};

// get all doc

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching doctor",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    // req.body.status = "pending"
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "new-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while booking appointment",
    });
  }
};

const userAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users appointments",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in User application",
    });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    res.status(200).send({
      success: true,
      message: "User fetched sucessfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in User profile",
    });
  }
};

module.exports = {
  applyDoctorContoller,
  loginController,
  registerController,
  authController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  userAppointmentController,
  getUserController,
};
