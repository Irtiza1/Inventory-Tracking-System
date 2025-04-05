const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

const UserService = {
  createUser: async (userData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      ...userData,
      password_hash: hashedPassword,
    };
    return User.create(newUser);
  },
  getAllUsers: async () => {
    return User.findAll();
  },
  getUserById: async (id) => {
    return User.findById(id);
  },
  getUserByUsername: async (username) => {
    return User.findByUsername(username);
  },
  updateUser: async (id, userData) => {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password_hash = await bcrypt.hash(userData.password, salt);
    }
    return User.update(id, userData);
  },
  deleteUser: async (id) => {
    return User.delete(id);
  },
};

module.exports = UserService;
