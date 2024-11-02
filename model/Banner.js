import mongoose from "mongoose";

const { Schema } = mongoose;

const bannerSchema = new Schema({
  title: { type: String, required: true, unique: true },
  subtitle: { type: String, required: true },
  bannerImage: { type: String, required: true },
  tag: { type: String, required: true },
  offer: { type: String },
  deleted: { type: Boolean, default: false },
});

const virtualId = bannerSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

// Set the schema to output virtuals, but remove the `_id` and `__v` fields
bannerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Banner = mongoose.model("Banner", bannerSchema);
