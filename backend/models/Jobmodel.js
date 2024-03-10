const mongoose = require("mongoose");

const jobOfferSchema = new mongoose.Schema({
  ProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  // location: {
  //   type: {
  //     type: String,
  //     default: 'Point',
  //   },
  //   coordinates: [Number],
  // },
  Description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Job", jobOfferSchema);
