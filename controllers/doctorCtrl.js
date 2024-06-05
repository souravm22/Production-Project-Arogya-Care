// const doctorModel = require('../models/doctorModel')

// const getDoctorInfoController = async (req,res) => {

//     try {
//         const doctor = await doctorModel.findOne({userId:req.body.userId})
//         res.status(200).send({
//             success:true,
//             message:"Doctor data fetched",
//             data:doctor
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success:false,
//             error,
//             message:'Error in fetching doctor details'

//         })

//     }
// };

// module.exports = getDoctorInfoController;

const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    // if (!doctor) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "Doctor not found",
    //   });
    // }
    res.status(200).send({
      success: true,
      message: "Doctor data fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor details",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor profile updated",
      error,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor fetched sucessfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor profile issue",
      error,
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      messsage: "Error in appointments",
    });
  }
};

// const updateStatusController = async (req, res) => {
//   try {
//     const { appointmentsId, status, userId } = req.body;
//     const appointments = await appointmentModel.findByIdAndUpdate(
//       appointmentsId,
//       { status }
//     );
//     const user = await userModel.findOne({ _id: userId });
//     const notification = user.notification;
//     notification.push({
//       type: "status-updated",
//       message: `Your appointment has been updated, status is ${status}`,
//       onClickPath: "/doctor-appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment status updated",
//     });
//   } catch (error) {
//     console.error;
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in update status",
//     });
//   }
// };

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status, usersId } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );

    const user = await userModel.findById(usersId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.notification.push({
      type: "status-updated",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/user-appointments",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment status updated and user notified",
    });
  } catch (error) {
    console.error("Error in update status:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating appointment status",
    });
  }
};

module.exports = {
  getDoctorByIdController,
  getDoctorInfoController,
  updateProfileController,
  doctorAppointmentsController,
  updateStatusController,
};
