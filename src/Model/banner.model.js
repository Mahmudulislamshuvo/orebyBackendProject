const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("banner", bannerSchema);
