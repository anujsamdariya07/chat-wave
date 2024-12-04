import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be  atleast 6 characters!' });
    }

    // Fetch user
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: 'Invalid User Data!' });
    }

    // Generate JWT token
    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log('Error in the signup controller...', error);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const login = (req, res) => {
  res.send('Login route!');
};

export const logout = (req, res) => {
  res.send('Logout route!');
};
