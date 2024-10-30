import mongoose from "mongoose";

const WebsiteSettingsSchema = new mongoose.Schema({
  logoUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: true,
    // match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
  },
});

const WebsiteSettings = mongoose.model(
  "WebsiteSettings",
  WebsiteSettingsSchema
);
export default WebsiteSettings;
