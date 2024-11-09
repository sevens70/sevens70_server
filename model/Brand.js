import mongoose from "mongoose";

const { Schema } = mongoose;
const brandSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
});

const virtual = brandSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// exports.Brand = mongoose.model("Brand", brandSchema);
export const Brand = mongoose.model("Brand", brandSchema);
