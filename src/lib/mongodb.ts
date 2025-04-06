import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/eco-friendly-living';
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  retryWrites: true,
  w: 'majority',
  ssl: true,
  appName: 'users'
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(error => {
  console.error('MongoDB connection error:', error);
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'provider'],
    required: true,
  },
  userName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'user';
    }
  },
  companyName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'provider';
    }
  },
  serviceType: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'provider';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  profile: {
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    website: String,
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// User Model Methods
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({
    userId: this._id,
    email: this.email,
    role: this.role,
    userName: this.userName,
    companyName: this.companyName,
    serviceType: this.serviceType,
    profile: this.profile
  }, JWT_SECRET, { expiresIn: '7d' });
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findByCredentials = async function(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();
  
  return user;
};

export const User = mongoose.model('User', userSchema);

// Types
export interface UserProfile {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  role: 'user' | 'provider';
  userName?: string;
  companyName?: string;
  serviceType?: string;
  profile?: UserProfile;
}

// Auth functions
export const signUp = async (data: SignUpData) => {
  try {
    // Validate required fields based on role
    if (data.role === 'user' && !data.userName) {
      throw new Error('User name is required for service users');
    }
    if (data.role === 'provider' && (!data.companyName || !data.serviceType)) {
      throw new Error('Company name and service type are required for service providers');
    }

    const user = new User(data);
    await user.save();
    const token = user.generateAuthToken();
    return { user: user.toJSON(), token };
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();
    return { user: user.toJSON(), token };
  } catch (error) {
    throw new Error('Invalid login credentials');
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// User management functions
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { profile } },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (userId: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: false } },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  } catch (error) {
    throw error;
  }
};