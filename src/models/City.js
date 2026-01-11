const mongoose = require("mongoose");
const citySchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
});
module.exports = mongoose.model("City", citySchema);
