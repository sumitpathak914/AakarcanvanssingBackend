// controllers/testimonialController.js
const Testimonial = require('../model/TestimonialsModel');

// Add a new testimonial
exports.addTestimonial = async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json({statusCode:201,result:true, testimonial:testimonial });
    } catch (error) {
        res.status(400).json({ statusCode: 400, result: true, message: error.message });
    }
};

// Get all testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json({ statusCode: 200, result: true, testimonial: testimonials });
    } catch (error) {
        res.status(500).json({ statusCode: 500, result: true, message: error.message });
    }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
