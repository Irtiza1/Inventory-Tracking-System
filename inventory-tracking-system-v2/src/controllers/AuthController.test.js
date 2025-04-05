// src/controllers/AuthController.test.js

// Mock the Sequelize instance
jest.mock('../db/database', () => {
    return {
      authenticate: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
    };
  });
  
  // Mock the UserService
  jest.mock('../services/UserService', () => ({
    findUserByUsername: jest.fn(),
  }));
  
  // Mock the response object
  const mockResponse = () => {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  };
  
  const { findUserByUsername } = require('../services/UserService');
  const authController = require('../controllers/AuthController');
  
  describe('Auth Controller', () => {
    beforeAll(async () => {
      // Ensure DB connection is set up before tests
      const sequelize = require('../db/database');
      await sequelize.authenticate();
    });
  
    afterAll(async () => {
      // Clean up after tests
      const sequelize = require('../db/database');
      await sequelize.close();
    });
  
    it('should return a user if the username exists', async () => {
      const mockUser = { id: 1, username: 'admin', password: 'password', role: 'admin' };
      findUserByUsername.mockResolvedValue(mockUser); // Mock service call
  
      const req = { body: { username: 'admin' } };
      const res = mockResponse();
  
      await authController.login(req, res); // Call your login method
  
      expect(res.json).toHaveBeenCalledWith(mockUser); // Verify the response
    });
  
    it('should return an error if user not found', async () => {
      findUserByUsername.mockResolvedValue(null); // Mock service call for nonexistent user
  
      const req = { body: { username: 'nonexistent' } };
      const res = mockResponse();
  
      await authController.login(req, res); // Call your login method
  
      expect(res.status).toHaveBeenCalledWith(404); // Check for 404 error
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
  