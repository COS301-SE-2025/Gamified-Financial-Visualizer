import { Router } from 'express';
import {
  createUser,
  authenticateUser,
  verifyUserEmail,
  setTwoFactorEnabled,
  updateUserProfile,
  updatePassword,
  getUserPreferences,
  updateUserPreferences
} from '@shared-services/auth.service';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Authentication failed' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    await verifyUserEmail(req.body.user_id);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/2fa', async (req, res) => {
  try {
    await setTwoFactorEnabled(req.body.user_id, req.body.enabled);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const result = await updateUserProfile(Number(req.params.id), req.body);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/password/:id', async (req, res) => {
  try {
    await updatePassword(Number(req.params.id), req.body.new_password);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/preferences/:id', async (req, res) => {
  try {
    const prefs = await getUserPreferences(Number(req.params.id));
    res.status(200).json({ status: 'success', data: prefs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/preferences/:id', async (req, res) => {
  try {
    await updateUserPreferences(Number(req.params.id), req.body.theme, req.body.notificationsEnabled, req.body.avatar_id);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
