import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentMethods = {
  values: ["card", "cash"],
  message: "enum validator failed for payment Methods",
};

// Define the schema for orders
const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true }, // List of order items
    totalAmount: { type: Number, required: true }, // Total order amount
    totalItems: { type: Number, required: true }, // Total number of items
    paymentMethod: {
      type: String,
      required: true,
      enum: paymentMethods,
    }, // Payment method (card, cash)
    paymentStatus: {
      type: String,
      default: "pending",
    }, // Payment status
    status: {
      type: String,
      default: "pending",
    }, // Order status
    selectedAddress: {
      type: Schema.Types.Mixed,
      required: true,
    }, // Delivery address
  },
  { timestamps: true }
);

// Virtual field for `id` (uses `_id` internally)
const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

// Adjust toJSON output
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id; // Remove `_id` when converting to JSON
  },
});

// Export the model, checking if it already exists
export const LandingPageOrder =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
