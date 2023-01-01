const userModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");
const ObjectId = require("mongoose").Types.ObjectId;

const jwt = require("jsonwebtoken");

const testUserController = (req, res) => {
  console.log(req.body);
  res.send({ status: "Hello from userController of vaccination app!" });
};
//  CREATE USER
const create = async (req, res) => {
  const data = req.body;
  const createdUser = await userModel.create(data);
  res.status(201).send({ status: true, user: createdUser });
};
//LOGIN USER
const login = async (req, res) => {
  const isUserAvailable = await userModel.findOne(req.body);
  if (!isUserAvailable) {
    return res
      .status(400)
      .send({ status: false, message: "User not registered" });
  }
  const token = jwt.sign(
    {
      userType: isUserAvailable.Type,
      userId: isUserAvailable._id,
      vaccinationStatus: isUserAvailable.VaccinationStatus,
    },
    "secret",
    {
      expiresIn: "30m",
    }
  );
  return res.status(200).send({ status: true, Token: token });
};
//CREATE BOOKING
const createBooking = async (req, res) => {
    req.body.User=req.user.userId
  const data = req.body;
  const { Doze } = data;
  if (Doze == "Second dose" && req.user.vaccinationStatus == "none") {
    return res
      .status(400)
      .send({
        status: false,
        message: "Get your first doze before applying for the second one",
      });
  }
  let loggedInUser = req.user.userId;
  loggedInUser = ObjectId(loggedInUser);
  const alreadyBooked=await bookingModel.findOne({User:loggedInUser})
  if(alreadyBooked){
    return res.status(400).send({status:false,message:"You already have an incomplete booking"})
  }
  const bookedSlots = await bookingModel.find(data);
  if (bookedSlots.length == 10) {
    return res
      .status(400)
      .send({ status: false, message: "The required slot is not available!" });
  }
  const createdBooking = await bookingModel.create(data);
  res.status(201).send({ status: true, booking: createdBooking });
};

//VIEW ALL AVAILABLE SLOTS ON A GIVEN DATE
const viewAvailableSlots = async (req, res) => {
  let date = req.query.date;
  date = new Date(date);
  let doseLookingFor;
  const availabilty = [];
  const bookedSlots = await bookingModel.find({ Day: date });
  const slots = [
    "10:00AM-10:30AM",
    "10:30AM-11:00AM",
    "11:00AM-11:30AM",
    "11:30AM-12:00PM",
    "12PM-12:30PM",
    "12:30PM-1:00PM",
    "1PM-1:30PM",
    "1:30AM-2:00PM",
    "2:00PM-2:30PM",
    "2:30PM-3:00PM",
    "3:00PM-3:30PM",
    "3:30PM-4:00PM",
    "4:00PM-4:30AM",
    "4:30PM-5:00PM",
  ];
  if (req.user.vaccinationStatus == "none") {
    doseLookingFor = "First dose";
  } else if (req.user.vaccinationStatus == "First dose completed") {
    doseLookingFor = "Second dose";
  } else {
    return res
      .status(400)
      .send({ status: false, message: "You are done with your vaccination" });
  }

  for (let i of slots) {
    const bookings = bookedSlots.filter((e) => {
      return e.Slot == i && e.Doze == doseLookingFor;
    });
    if (bookings.length != 10) {
      const temp = { Slot: i, Vaccine_Available: 10 - bookings.length };
      availabilty.push(temp);
    }
  }
  res
    .status(200)
    .send({
      status: true,
      Dose: doseLookingFor,
      Available_Vacancies: availabilty,
    });
};

// UPDATE TIME SLOT FOR VACCINATION
const updateTimeSlot = async (req, res) => {
  let doseLookingFor;
  let loggedInUser = req.user.userId;
  loggedInUser = ObjectId(loggedInUser);
  if (req.user.vaccinationStatus == "none") {
    doseLookingFor = "First dose";
  } else if (req.user.vaccinationStatus == "First dose completed") {
    doseLookingFor = "Second dose";
  }
  const time = req.body.timeSlot;
  const date=req.body.date;
  if((new Date(date)-new Date())==0){
    return res.status(400).send({status:false,message:"You can only change your slot prior 24 hrs of vaccination"})
  }
  const bookingsInGivenSlot = await bookingModel.find({ Slot: time,Doze:doseLookingFor });
  if (bookingsInGivenSlot.length == 10) {
    return res
      .status(400)
      .send({
        status: false,
        message: "No space available for the given slot",
      });
  }
  const updatedBooking = await bookingModel.findOneAndUpdate(
    { user: req.loggedInUser },
    { Slot: time},
    { new: true }
  );
  res.status(200).send({ status: true, updatedBooking: updatedBooking });
};


module.exports = {
  testUserController,
  create,
  login,
  createBooking,
  viewAvailableSlots,
  updateTimeSlot,
};