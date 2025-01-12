const mongoose = require("mongoose");
const { Schema } = mongoose;

const flashSaleSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = mongoose.model("flashsale", flashSaleSchema);
