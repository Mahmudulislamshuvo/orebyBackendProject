const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoryModel = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: [
    {
      type: Schema.Types.ObjectId,
      hef: "subcategory",
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("category", categoryModel);
