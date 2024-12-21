// import mongoose from "mongoose";

// const { Schema } = mongoose;
// const sunglassProductSchema = new Schema({
//   title: { type: String, required: true, unique: true },
//   subtitle: { type: String, required: true, unique: true },
//   price: { type: String, required: true },
//   image: { type: String, required: true },
// });

// const virtual = sunglassProductSchema.virtual("id");
// virtual.get(function () {
//   return this._id;
// });
// sunglassProductSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });

// export const sunglassProduct = mongoose.model(
//   "sunglassProduct",
//   sunglassProductSchema
// );
