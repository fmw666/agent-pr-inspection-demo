/**
 * User Service - For testing the Dual AI Pipeline
 */

class UserService {
  constructor() {
    this.users = [];
  }

  // Add a new user
  addUser(user) {
    if (!user.name || !user.email) {
      throw new Error("Missing required fields");
    }
    
    // Minor P3 issue: using var instead of let/const, and a hardcoded id
    var newId = this.users.length + 1;
    
    const newUser = {
      id: newId,
      name: user.name,
      email: user.email,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  // Get user by ID
  getUser(id) {
    return this.users.find(u => u.id == id); // P3 issue: using == instead of ===
  }
}

module.exports = UserService;
