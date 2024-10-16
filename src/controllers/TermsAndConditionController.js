// controllers/termsController.js
const Term = require('../model/TermsAndConditionModel');

// Add a new term
const addTerm = async (req, res) => {
    const newTerm = new Term({ content: req.body.content });

    try {
        const savedTerm = await newTerm.save();
        res.status(201).json(savedTerm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all terms
const getTerms = async (req, res) => {
    try {
        const terms = await Term.find();
        res.status(200).json(terms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a term
const updateTerm = async (req, res) => {
    try {
        const updatedTerm = await Term.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
        if (!updatedTerm) return res.status(404).json({ message: 'Term not found' });
        res.status(200).json(updatedTerm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a term
const deleteTerm = async (req, res) => {
    try {
        const deletedTerm = await Term.findByIdAndDelete(req.params.id);
        if (!deletedTerm) return res.status(404).json({ message: 'Term not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    addTerm,
    getTerms,
    updateTerm,
    deleteTerm,
};
