const CommissionSlab = require('../model/CommissionModel');

// Create a new commission slab
exports.createCommissionSlab = async (req, res) => {
    const { category, subcategory, commissions } = req.body;

    try {
        const newSlab = new CommissionSlab({
            category,
            subcategory,
            commissions,
        });

        await newSlab.save();
        res.status(201).json(newSlab);
    } catch (error) {
        console.error('Error creating commission slab', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all commission slabs
exports.getCommissionSlabsForAddProduct = async (req, res) => {
    try {
        const slabs = await CommissionSlab.find({ isActive: true });
        res.status(200).json({ result: true, statuscode: 200, CategoryList: slabs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching commission slabs', error });
    }
};

exports.getCommissionSlabs = async (req, res) => {
    try {
        const slabs = await CommissionSlab.find();
        res.status(200).json({ result: true, statuscode: 200, CategoryList: slabs });
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

        res.status(200).json({ result: true, statuscode: 200, CategoryList: slab });
    } catch (error) {
        console.error('Error updating commission slab', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.generateFactoryInvoice = async (req, res) => {
    const { factoryId, startDate, endDate } = req.body;

    try {
        // Parse dates from string to Date object
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Fetch orders for the factory within the date range
        const orders = await Order.find({
            factoryId: factoryId,
            orderDate: { $gte: start, $lte: end },
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found in this date range' });
        }

        // Calculate total commission for the orders
        let totalCommission = 0;
        orders.forEach(order => {
            totalCommission += order.commissionAmount; // Assuming `commissionAmount` is part of each order
        });

        // Generate PDF for the invoice
        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=factory_invoice_${factoryId}.pdf`);
            res.send(pdfData);
        });

        // Start writing PDF content
        doc.fontSize(20).text('Factory Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Factory ID: ${factoryId}`);
        doc.text(`Date Range: ${startDate} to ${endDate}`);
        doc.moveDown();

        // List the orders in the PDF
        orders.forEach((order, index) => {
            doc.text(`${index + 1}. Order ID: ${order._id}, Commission: ${order.commissionAmount}`);
        });

        // Display total commission at the end
        doc.moveDown();
        doc.text(`Total Commission: ${totalCommission}`, { align: 'right' });

        doc.end(); // Finalize the PDF
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};