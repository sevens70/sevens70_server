import mongoose from "mongoose";

const { Schema } = mongoose;

const topBannerSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    bannerImage: { type: String, required: true },
  },
  { timestamps: true }
);

const virtualId = topBannerSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

// Set the schema to output virtuals, but remove the `_id` and `__v` fields
topBannerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const TopBanner = mongoose.model("TopBanner", topBannerSchema);
