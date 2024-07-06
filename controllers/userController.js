const User = require('../models/User');

const updateProfile = async (req, res) => {
  const { name, username,  bio, interestedCountries } = req.body;


  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    
    const existingUser = await User.findOne({ username });
    if(existingUser.username!==username) {
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
   

 
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, username, profilePicture:image, bio, interestedCountries },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
  
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile,getProfile };
