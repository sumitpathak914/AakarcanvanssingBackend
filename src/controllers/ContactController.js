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
        // Find the existing contact document (assuming only one document stores contact info)
        let contactRecord = await Contact.findOne();

        // If no record exists, create one with the first entry
        if (!contactRecord) {
            contactRecord = new Contact({
                contactInfo: [{
                    name,
                    email,
                    phone,
                    subject,
                    message
                }],
                count: "1"
            });

            await contactRecord.save();
            return res.status(201).json({ message: 'Form submitted successfully and new contact created!' });
        }

        // If record exists, push new contact info to the array
        contactRecord.contactInfo.push({
            name,
            email,
            phone,
            subject,
            message
        });

        // Increment the count
        contactRecord.count = (parseInt(contactRecord.count) + 1).toString();

        // Save the updated record
        await contactRecord.save();

        res.status(201).json({ message: 'Form submitted successfully and contact added to the existing record!' });
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


exports.deleteContact = async (req, res) => {
    const { contactId } = req.params; // Get contactInfo._id from params

    try {
        // Find the contact record
        let contactRecord = await Contact.findOne();

        if (!contactRecord) {
            return res.status(404).json({ message: 'No contact record found.' });
        }

        // Find the specific contact within the contactInfo array and remove it
        contactRecord.contactInfo = contactRecord.contactInfo.filter(
            (contact) => contact._id.toString() !== contactId
        );

       

        // Save the updated record
        await contactRecord.save();

        res.status(200).json({ message: 'Contact deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// @desc   Reset count for all contacts to zero
exports.resetCount = async (req, res) => {
    try {
        // Find the contact record
        let contactRecord = await Contact.findOne();

        if (!contactRecord) {
            return res.status(404).json({ message: 'No contact record found.' });
        }

        // Reset count to zero
        contactRecord.count = "0";

        // Save the updated record
        await contactRecord.save();

        res.status(200).json({ message: 'Count reset to 0 successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
