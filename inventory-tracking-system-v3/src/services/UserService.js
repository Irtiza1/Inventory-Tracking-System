const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

const UserService = {
  createUser: async (userData) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const newUser = {
        ...userData,
        password_hash: hashedPassword,
      };
      return await User.createUser(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  getAllUsers: async () => {
    try {
      return await User.findAllUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  getUserById: async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
  },

  getUserByUsername: async (username) => {
    try {
      return await User.findByUsername(username);
    } catch (error) {
      console.error(`Error fetching user with username ${username}:`, error);
      throw new Error(`Failed to fetch user with username ${username}`);
    }
  },

  updateUser: async (id, userData) => {
    try {
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password_hash = await bcrypt.hash(userData.password, salt);
      }
      return await User.updateUser(id, userData);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw new Error(`Failed to update user with ID ${id}`);
    }
  },

  deleteUser: async (id) => {
    try {
      return await User.deleteUser(id);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  },
};

module.exports = UserService;

