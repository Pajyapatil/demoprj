import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Organisation, User, Contact, Campaign, Schedule, Setting } from './models.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'biznotify_secret_key_123';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// INITIAL STATE
router.get('/state', authMiddleware, async (req, res) => {
  try {
    const organisations = await Organisation.find();
    const users = await User.find();
    const contacts = await Contact.find();
    const campaigns = await Campaign.find();
    const schedules = await Schedule.find();
    const settings = await Setting.findOne() || {};

    res.json({
      organisations,
      users,
      contacts,
      campaigns,
      schedules,
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AUTHENTICATION
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    
    // Simplistic plain text check for legacy users, bcrypt for new
    const isMatch = (password === user.password) || (await bcrypt.compare(password, user.password));
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ success: true, user: userObj, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, address, contact, password, role, organisationId } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ success: false, message: 'A user with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email: email.toLowerCase(), address, contact, password: hashedPassword, role, organisationId: organisationId || null
    });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ORGANISATIONS
router.post('/organisations', authMiddleware, async (req, res) => {
  try {
    const org = new Organisation(req.body);
    await org.save();
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.put('/organisations/:id', authMiddleware, async (req, res) => {
  try {
    const org = await Organisation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.delete('/organisations/:id', authMiddleware, async (req, res) => {
  try {
    await Organisation.findByIdAndDelete(req.params.id);
    await User.updateMany({ organisationId: req.params.id }, { organisationId: null });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// USERS
router.post('/users', authMiddleware, async (req, res) => {
  try {
    const hashedPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined;
    const userData = { ...req.body, email: req.body.email.toLowerCase() };
    if (hashedPassword) userData.password = hashedPassword;
    
    const user = new User(userData);
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const userData = { ...req.body };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, userData, { new: true });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Contact.deleteMany({ userId: req.params.id });
    await Campaign.deleteMany({ userId: req.params.id });
    await Schedule.deleteMany({ userId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// CONTACTS
router.post('/contacts', authMiddleware, async (req, res) => {
  try {
    const doc = new Contact(req.body);
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.put('/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.delete('/contacts/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// CAMPAIGNS
router.post('/campaigns', authMiddleware, async (req, res) => {
  try {
    const doc = new Campaign(req.body);
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.put('/campaigns/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.delete('/campaigns/:id', authMiddleware, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// SCHEDULES
router.post('/schedules', authMiddleware, async (req, res) => {
  try {
    const doc = new Schedule(req.body);
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.put('/schedules/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.delete('/schedules/:id', authMiddleware, async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// SETTINGS
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    let doc = await Setting.findOne();
    if (!doc) {
      doc = new Setting(req.body);
      await doc.save();
    } else {
      doc = await Setting.findByIdAndUpdate(doc._id, req.body, { new: true });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
