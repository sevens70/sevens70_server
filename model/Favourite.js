import mongoose from "mongoose";

const { Schema } = mongoose;

const favouriteSchema = new Schema({
  // category: { type: String, required: true },
  category: { type: String },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const virtual = favouriteSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
favouriteSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Favourite = mongoose.model("Favourite", favouriteSchema);
