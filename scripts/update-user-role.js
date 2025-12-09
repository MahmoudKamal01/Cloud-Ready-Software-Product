/**
 * Script to update a user's role
 * Usage: node scripts/update-user-role.js <email> <role>
 * Example: node scripts/update-user-role.js user@example.com admin
 */

require('dotenv').config();
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'agent'], default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updateUserRole() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = process.argv[2];
    const role = process.argv[3];

    if (!email || !role) {
      console.error('Usage: node scripts/update-user-role.js <email> <role>');
      console.error('Roles: user, admin, agent');
      process.exit(1);
    }

    if (!['user', 'admin', 'agent'].includes(role)) {
      console.error('Invalid role. Must be: user, admin, or agent');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    user.role = role;
    await user.save();

    console.log(`✅ User role updated successfully:`);
    console.log(`   Email: ${email}`);
    console.log(`   New Role: ${role}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating user role:', error);
    process.exit(1);
  }
}

updateUserRole();

