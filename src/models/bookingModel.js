const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new mongoose.Schema({
  User: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  Day: {
    type: Date,
    required: true,
    min: "2022-06-1",
    max: "2022-06-30",
  },
  Slot: {
    type: String,
    enum: [
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
    ],
  },
  Doze: {
    type: String,
    enum: ["First dose", "Second dose"],
  },
});

module.exports = mongoose.model("Booking", bookingSchema);