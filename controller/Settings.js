import WebsiteSettings from "../model/Settings.js";

export async function fetchSettingsWebsiteInfo(req, res) {
  try {
    const websiteInfo = await WebsiteSettings.find({}).exec();
    res.status(200).json(websiteInfo);
  } catch (err) {
    res.status(400).json(err);
  }
}

export async function settingsWebsiteInfoCreate(req, res) {
  try {
    const { email, phoneNumber, logoUrl } = req.body;

    // Check if a settings document already exists
    const existingSettings = await WebsiteSettings.findOne({});
    if (existingSettings) {
      // updating the existing document
      existingSettings.email = email;
      existingSettings.phoneNumber = phoneNumber;
      existingSettings.logoUrl = logoUrl;
      await existingSettings.save();
      return res
        .status(200)
        .json({ message: "Website settings updated", data: existingSettings });
    } else {
      const newSettings = new WebsiteSettings({ email, phoneNumber, logoUrl });
      await newSettings.save();
      res
        .status(201)
        .json({ message: "Website settings created", data: newSettings });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating or updating website settings", error });
  }
}
// export async function settingsWebsiteInfoCreate(req, res) {
//   try {
//     const newSettings = new WebsiteSettings(req.body);
//     const savedSettings = await newSettings.save();
//     res.status(201).json(savedSettings);
//   } catch (error) {
//     res.status(400).json({ message: "Error creating website settings", error });
//   }
// }
// export async function settingsWebsiteInfoUpdate(req, res) {
//   try {
//     const updatedSettings = await WebsiteSettings.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updatedSettings);
//   } catch (error) {
//     res.status(400).json({ message: "Error updating website settings", error });
//   }
// }
