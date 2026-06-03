// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },
 parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null // 👈 main category has no parent
  },
  image: {
    type: String
  }

}, { timestamps: true });
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});
module.exports = mongoose.model("Category", categorySchema);