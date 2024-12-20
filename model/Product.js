import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      min: [1, "wrong min price"],
      max: [10000, "wrong max price"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max price"],
      default: 0,
    },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
    // brand: { type: String, required: true },
    brand: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String },
    thumbnail: { type: String, required: true },
    model: { type: String, required: true },
    images: { type: [Object] },
    colors: { type: [Schema.Types.Mixed] },
    sizes: { type: [Schema.Types.Mixed] },
    tags: { type: [Schema.Types.Mixed] },
    sku: { type: String },
    type: { type: String, default: "product" },
    discountPrice: { type: Number },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const virtualId = productSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

// Set the schema to output virtuals, but remove the `_id` and `__v` fields
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Product = mongoose.model("Product", productSchema);
