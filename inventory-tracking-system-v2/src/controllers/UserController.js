const UserService = require('../services/UserService');
const { validateUser } = require('../validations/UserValidation');

const UserController = {
  createUser: async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const existingUser = await UserService.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  },
  updateUser: async (req, res) => {
    const { error } = validateUser(req.body, true);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const deleted = await UserService.deleteUser(req.params.id);
      if (deleted === 0) return res.status(404).json({ error: 'User not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },
};

module.exports = UserController;
