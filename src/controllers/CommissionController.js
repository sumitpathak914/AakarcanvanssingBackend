const CommissionSlab = require('../model/CommissionModel');

// Create a new commission slab
exports.createCommissionSlab = async (req, res) => {
    const { category, subcategory, commissionPerKg } = req.body;
    try {
        const newSlab = new CommissionSlab({
            category,
            subcategory,
            commissionPerKg,
            isActive: true, // Set isActive to true by default
        });
        await newSlab.save();
        res.status(201).json(newSlab);
    } catch (error) {
        res.status(500).json({ message: 'Error creating commission slab', error });
    }
};

// Get all commission slabs
exports.getCommissionSlabs = async (req, res) => {
    try {
        const slabs = await CommissionSlab.find();
        res.status(200).json(slabs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching commission slabs', error });
    }
};

exports.deleteCommissionSlab = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSlab = await CommissionSlab.findByIdAndDelete(id);
        if (!deletedSlab) {
            return res.status(404).json({ message: 'Commission slab not found' });
        }
        res.status(200).json({ message: 'Commission slab deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting commission slab', error });
    }
};

exports.updateCommissionSlab = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const slab = await CommissionSlab.findByIdAndUpdate(
            id,
            { isActive },
            { new: true } // Return the updated document
        );

        if (!slab) {
            return res.status(404).json({ message: 'Commission slab not found' });
        }

        res.status(200).json(slab);
    } catch (error) {
        console.error('Error updating commission slab', error);
        res.status(500).json({ message: 'Server error' });
    }
};