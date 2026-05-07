import { Schema, model, models, type InferSchemaType } from "mongoose";

const settingsSchema = new Schema(
  {
    siteName: { type: String },
    tagline: { type: String },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    socialLinks: {
      twitter: { type: String },
      github: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
    },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    accentColor: { type: String },
  },
  { versionKey: false }
);

export type SettingsDocument = InferSchemaType<typeof settingsSchema>;
export const Settings = models.Settings || model("Settings", settingsSchema);

export async function upsertSettings(payload: Partial<SettingsDocument>) {
  return Settings.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
}
