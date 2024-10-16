// routes/termsRoutes.js
const express = require('express');
const TermsAndConditionrouter = express.Router();
const {
    addTerm,
    getTerms,
    updateTerm,
    deleteTerm,
} = require('../controllers/TermsAndConditionController');

// Add a new term
TermsAndConditionrouter.post('/AddTermsAndCondition', addTerm);

// Get all terms
TermsAndConditionrouter.get('/GetTermsAndcondition', getTerms);

// Update a term
TermsAndConditionrouter.put('/UpdateTermsAndCondition/:id', updateTerm);

// Delete a term
TermsAndConditionrouter.delete('/DeleteTermsAndCondition/:id', deleteTerm);

module.exports = TermsAndConditionrouter;
