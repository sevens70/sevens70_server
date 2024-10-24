import mongoose from "mongoose";

const { Schema } = mongoose;

const subcategorySchema = new Schema({
  name: { type: String, required: true },
});

const categorySchema = new Schema({
  // name: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  subcategories: [subcategorySchema],
});

// Virtual ID field for the category
const virtual = categorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Category = mongoose.model("Category", categorySchema);
