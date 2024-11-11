import mongoose from "mongoose";

const { Schema } = mongoose;

const ratingsSchema = new Schema({
  comment: { type: String },
  rating: {type: Number},
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const virtual = ratingsSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
ratingsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Ratings = mongoose.model("Ratings", ratingsSchema);
