import mongoose from 'mongoose';

const organisationSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
  address: String,
  contactNo: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  address: String,
  contact: String,
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', default: null },
});

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
});

const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  message: String,
  channel: String,
});

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  date: String,
  time: String,
  channel: String,
});

const settingSchema = new mongoose.Schema({
  platformName: String,
  supportEmail: String,
  timezone: String,
  defaultChannel: String,
  quietHours: String,
  retryLimit: String,
});

export const Organisation = mongoose.model('Organisation', organisationSchema);
export const User = mongoose.model('User', userSchema);
export const Contact = mongoose.model('Contact', contactSchema);
export const Campaign = mongoose.model('Campaign', campaignSchema);
export const Schedule = mongoose.model('Schedule', scheduleSchema);
export const Setting = mongoose.model('Setting', settingSchema);
