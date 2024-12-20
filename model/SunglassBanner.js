import mongoose from "mongoose";

const { Schema } = mongoose;
const sunglassBannerSchema = new Schema({
  title: { type: String, required: true, unique: true },
  subtitle: { type: String, required: true, unique: true },
  image: { type: String },
});

const virtual = sunglassBannerSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
sunglassBannerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const SunglassBanner = mongoose.model(
  "SunglassBanner",
  sunglassBannerSchema
);
