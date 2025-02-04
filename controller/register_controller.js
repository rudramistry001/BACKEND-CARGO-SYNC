import { User, Customer, Driver, Agency } from '../model/users/authModel.js';

// Customer Registration API
export const registerCustomer = async (req, res) => {
  try {
    const { fullname, email, password, contactno, preferredDeliveryTimes, membershipStatus, specialInstructions } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !contactno) {
      return res.status(401).json({ status: 'Error', error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ status: 'Error', error: 'This email already exists. Try logging in.' });
    }

    const customer = await Customer.create({ fullname, email, password, contactno, preferredDeliveryTimes, membershipStatus, specialInstructions });

    res.status(200).json({
      user: {
        fullname: customer.fullname,
        email: customer.email,
        id: customer._id,
        role: customer.role,
      },
      created: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err, created: false, message: 'Error in Registration' });
  }
};

// Driver Registration API
export const registerDriver = async (req, res) => {
  try {
    const { fullname, email, password, contactno, licenseNumber, vehicleType, availabilityStatus, experienceYears } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !contactno || !licenseNumber || !vehicleType || !experienceYears) {
      return res.status(401).json({ status: 'Error', error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ status: 'Error', error: 'This email already exists. Try logging in.' });
    }

    const driver = await Driver.create({ fullname, email, password, contactno, licenseNumber, vehicleType, availabilityStatus, experienceYears });

    res.status(200).json({
      user: {
        fullname: driver.fullname,
        email: driver.email,
        id: driver._id,
        role: driver.role,
      },
      created: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err, created: false, message: 'Error in Registration' });
  }
};

// Agency Registration API
export const registerAgency = async (req, res) => {
  try {
    const { fullname, email, password, contactno, agencyName, registrationNumber, establishedYear } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !contactno || !agencyName || !registrationNumber || !establishedYear) {
      return res.status(401).json({ status: 'Error', error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ status: 'Error', error: 'This email already exists. Try logging in.' });
    }

    const agency = await Agency.create({ fullname, email, password, contactno, agencyName, registrationNumber, establishedYear });

    res.status(200).json({
      user: {
        fullname: agency.fullname,
        email: agency.email,
        id: agency._id,
        role: agency.role,
      },
      created: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err, created: false, message: 'Error in Registration' });
  }
};
