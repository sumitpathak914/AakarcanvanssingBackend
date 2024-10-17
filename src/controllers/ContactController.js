// controllers/contactController.js
const Contact = require('../model/ContactModel');

// @desc   Handle form submission and store data in database
exports.submitContactForm = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Validate inputs
    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Validate phone number
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    try {
        // Create and save new contact entry
        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();

        res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
// @desc   Get all contact form submissions
exports.getContacts = async (req, res) => {
    try {
        // Fetch all contact entries from the database
        const contacts = await Contact.find();

        // If no contacts found
        if (contacts.length === 0) {
            return res.status(404).json({ message: 'No contact submissions found.' });
        }

        // Send the list of contacts
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
