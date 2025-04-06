import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

let client;
let database;
let users;
let comments;

async function connectDB() {
  try {
    client = new MongoClient(process.env.VITE_MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    database = client.db('users');
    users = database.collection('users');
    comments = database.collection('comments');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Connect to MongoDB before starting the server
connectDB().catch(console.error);

// Comments API endpoints
app.post('/api/comments', async (req, res) => {
  try {
    if (!comments) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const { articleId, content, userEmail } = req.body;

    if (!articleId || !content || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await users.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const comment = {
      articleId,
      content,
      userEmail,
      userName: user.userName || user.companyName,
      userRole: user.role,
      createdAt: new Date(),
    };

    const result = await comments.insertOne(comment);
    return res.status(201).json({ ...comment, _id: result.insertedId });
  } catch (error) {
    console.error('Comment creation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/comments/:articleId', async (req, res) => {
  try {
    if (!comments) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const { articleId } = req.params;
    const articleComments = await comments
      .find({ articleId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json(articleComments);
  } catch (error) {
    console.error('Comments retrieval error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// New endpoint for deleting comments
app.delete('/api/comments/:commentId', async (req, res) => {
  try {
    if (!comments) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const { commentId } = req.params;
    const { userEmail } = req.query;

    if (!commentId || !userEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Find the comment first to verify ownership
    const comment = await comments.findOne({ _id: new ObjectId(commentId) });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await comments.deleteOne({ _id: new ObjectId(commentId) });
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Comment deletion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Existing routes...
app.post('/api/signup', async (req, res) => {
  try {
    if (!users) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const { email, password, role, userName, companyName, serviceType } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    await users.insertOne({ 
      email: email.toLowerCase(), 
      password: password,
      role: role,
      userName: userName,
      companyName: companyName,
      serviceType: serviceType,
      lastLogin: new Date()
    });

    return res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    if (!users) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await users.findOne({ email: email.toLowerCase(), password: password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    return res.status(200).json({ 
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role,
        userName: user.userName,
        companyName: user.companyName,
        serviceType: user.serviceType
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API routes should be before the static file serving
app.use('/api', (req, res, next) => {
  if (req.path === '/signup' || req.path === '/signin' || req.path.startsWith('/comments')) {
    next();
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;

// Only start server after MongoDB connection is established
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});