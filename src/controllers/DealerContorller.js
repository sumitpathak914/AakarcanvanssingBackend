const Dealer = require('../model/DealerModel');
const Order = require('../model/OrderManagmentandDispatchModel');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit'); // Import pdfkit
const fs = require('fs'); // Import fs for file system operations
const path = require('path');
const FactoryController = {

    SaveDealer: async (req, res) => {
        const { shopName, contactPerson, email, gstNumber, password, confirmPassword, FSSAINumber, contactNumber } = req.body;

        // Check for missing fields
        if (!shopName) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Shop name is required' });
        }
        if (!contactPerson) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Contact person is required' });
        }
        if (!email) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Email is required' });
        }
        if (!gstNumber) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'GST number is required' });
        }
        if (!password) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Password is required' });
        }
        if (!confirmPassword) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Confirm password is required' });
        }
        if (!contactNumber) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Contact number is required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Passwords do not match' });
        }

        try {
            // Check if dealer already exists
            const existingDealer = await Dealer.findOne({ email });
            if (existingDealer) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Email is already in use' });
            }




            // Create a new dealer instance
            const dealer = new Dealer({
                shopName,
                contactPerson,
                email,
                gstNumber,
                password,
                confirmPassword, FSSAINumber,
                contactNumber
            });

            // Save new dealer
            await dealer.save();

            res.status(201).json({ result: true, statusCode: 201, message: 'Dealer registered successfully' });
        } catch (error) {
            console.error('Error saving dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    LoginDealer: async (req, res) => {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Password is required' });
        }

        try {
            // Check if dealer exists
            const dealer = await Dealer.findOne({ email });
            if (!dealer) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Dealer not found' });
            }
            if (password !== dealer.password) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Invalid password' });
            }

            if (!dealer.isAllowLogin) {
                return res.status(403).json({ result: false, statusCode: 403, message: 'Login not allowed. Please contact support.' });
            }
            // Validate password

            // Generate JWT token
            const token = jwt.sign({ id: dealer._id, email: dealer.email }, "AakaarCanvansing@#123", { expiresIn: '2 days' });

            const { password: _, confirmPassword: __, ...dealerInformation } = dealer._doc;

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Login successful',
                token,
                DealerInformation: dealerInformation
            });
        } catch (error) {
            console.error('Error logging in dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    GetAllDealers: async (req, res) => {
        try {
            // Fetch all dealers from the database
            const dealers = await Dealer.find({});

            // If no dealers are found
            if (!dealers || dealers.length === 0) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'No dealers found' });
            }

            // Return dealer information, excluding sensitive data like password
            // const dealerInformation = dealers.map(({ password, confirmPassword, ...dealerData }) => dealerData);

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Dealers retrieved successfully',
                data: dealers
            });
        } catch (error) {
            console.error('Error retrieving dealers:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },
    UpdateIsAllowLogin: async (req, res) => {
        const { shopId, isAllowLogin } = req.body;

        // Validate the shopId input
        if (!shopId) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Shop ID is required' });
        }

        try {
            // Find the dealer by shopId
            const dealer = await Dealer.findOne({ shopId });

            // Check if dealer exists
            if (!dealer) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Dealer not found' });
            }

            // Update isAllowLogin with the provided value
            dealer.isAllowLogin = isAllowLogin;
            await dealer.save();

            res.status(200).json({ result: true, statusCode: 200, message: `Login access ${isAllowLogin ? 'granted' : 'revoked'} successfully`, data: dealer });
        } catch (error) {
            console.error('Error updating isAllowLogin:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    calculateDealerCommission: async (req, res) => {
        try {
            const orders = await Order.find(); // Fetch all orders
            const commissions = {};

            // Loop through orders to calculate commissions
            for (const order of orders) {
                const shopId = order.ShopId; // Get ShopId from the order

                // Loop through the ProductDetails array
                for (const product of order.ProductDetails) {
                    // Check if the product's dispatch status is completed
                    if (product.dispatchShippingDetails.DispatchStatus === 'Completed') {
                        const factoryId = product.SupplierInfo.FactoryId; // Get the factory ID from SupplierInfo
                        const commissionRates = product.commission; // Get commission rates for different sizes

                        // Calculate commission based on the size and quantity
                        for (const selection of product.selection) {
                            const size = selection.size; // Get the size of the product
                            const quantity = selection.quantity; // Get the quantity of the product

                            let commissionRate;
                            if (size === '30kg') {
                                commissionRate = commissionRates.dealer30Kg; // Get the dealer commission for 30kg
                            } else if (size === '50kg') {
                                commissionRate = commissionRates.dealer50Kg; // Get the dealer commission for 50kg
                            } else if (size === '70kg') {
                                commissionRate = commissionRates.dealer70Kg; // Get the dealer commission for 70kg
                            }

                            if (commissionRate) {
                                // Calculate total commission for this product
                                const totalCommission = commissionRate * quantity;

                                // Initialize the commission for this shop or factory if it doesn't exist
                                if (!commissions[shopId]) {
                                    commissions[shopId] = 0;
                                }

                                // Add the total commission to the shop's or factory's total
                                commissions[shopId] += totalCommission;
                            }
                        }
                    }
                }
            }

            res.status(200).json({ result: true, statusCode: 200, commissions });
        } catch (error) {
            console.error('Error calculating commissions:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to calculate commissions.' });
        }
    },

    GetDealerByShopId: async (req, res) => {
        try {
            const { shopId } = req.params; // Extract shopId from the request parameters

            // Fetch the dealer from the database using shopId
            const dealer = await Dealer.findOne({ shopId });

            // If no dealer is found with the provided shopId
            if (!dealer) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: `Dealer with shopId ${shopId} not found`
                });
            }

            // Return dealer information, excluding sensitive data like password
            const { password, confirmPassword, ...dealerData } = dealer._doc;

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Dealer retrieved successfully',
                data: dealerData
            });
        } catch (error) {
            console.error('Error retrieving dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    DeleteDealer: async (req, res) => {
        const { shopId } = req.params; // Extract shopId from the request parameters

        // Check if shopId is provided
        if (!shopId) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Shop ID is required' });
        }

        try {
            // Find the dealer by shopId
            const dealer = await Dealer.findOne({ shopId });

            // Check if dealer exists
            if (!dealer) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Dealer not found' });
            }

            // Delete the dealer
            await Dealer.deleteOne({ shopId });

            res.status(200).json({ result: true, statusCode: 200, message: 'Dealer deleted successfully' });
        } catch (error) {
            console.error('Error deleting dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

     UpdateDealer :async (req, res) => {
        const { shopId } = req.params; // Get shopId from request parameters
        const { shopName, contactPerson, email, gstNumber, FSSAINumber, contactNumber, password, isAllowLogin } = req.body;

        // Validate the shopId input
        if (!shopId) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Shop ID is required' });
        }

        try {
            // Find the dealer by shopId
            const dealer = await Dealer.findOne({ shopId });

            // Check if dealer exists
            if (!dealer) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Dealer not found' });
            }

            // Update only the fields provided in the request
            if (shopName) dealer.shopName = shopName;
            if (contactPerson) dealer.contactPerson = contactPerson;
            if (email) dealer.email = email;
            if (gstNumber) dealer.gstNumber = gstNumber;
            if (FSSAINumber) dealer.FSSAINumber = FSSAINumber;
            if (contactNumber) dealer.contactNumber = contactNumber;
            if (password) dealer.password = password; // Update password
            if (typeof isAllowLogin !== 'undefined') dealer.isAllowLogin = isAllowLogin;

            // Save the updated dealer information
            await dealer.save();

            // Return the updated dealer data
            const { password: omittedPassword, ...updatedDealer } = dealer._doc; // Exclude sensitive fields
            res.status(200).json({ result: true, statusCode: 200, message: 'Dealer updated successfully', data: updatedDealer });
        } catch (error) {
            console.error('Error updating dealer:', error);
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    generateDealerInvoice: async (req, res) => {
        const { shopId, startDate, endDate, shopName, shopContact } = req.body;
        console.log(startDate)
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            // Fetch all orders with the matching ShopId
            const orders = await Order.find({
                ShopId:shopId,
            });
           
            if (!orders.length) {
                return res.status(404).json({ message: 'No orders found for the selected date range.' });
            }

            const doc = new PDFDocument({ margin: 50 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice_${shopId}_${Date.now()}.pdf`);
            doc.pipe(res);

            // Generate an 8-digit random invoice number
            const generateInvoiceNumber = () => {
                return Math.floor(10000000 + Math.random() * 90000000).toString();
            };

            const invoiceNumber = generateInvoiceNumber();
            doc
                .fontSize(20)
                .text(`${shopName}`, { align: 'center' })
                .moveDown()
                .fontSize(12)
                .text(`Dealer Address:`, { align: 'center' })
                .text(`Contact: ${shopContact}`, { align: 'center' })
                .moveDown(2)
                .lineWidth(2)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke()
                .moveDown();

            // Invoice Details
            doc
                .fontSize(14)
                .text(`Invoice No: ${invoiceNumber}`, { align: 'left' })
                .text(`Date Range: ${startDate} to ${endDate}`, { align: 'left' })
                .moveDown(1);

            let totalCommission = 0;
            const productSummary = {};

            // Loop through orders
            // Loop through orders
            orders.forEach(order => {
                const orderId = order.orderId;

                order.ProductDetails.forEach(product => {
                    const orderDate = new Date(product.OrderDate);

                    // Only include products where the dispatch status is "Completed" and the shopId matches
                    if (orderDate >= start && orderDate <= end && product.dispatchShippingDetails?.DispatchStatus === 'Completed') {
                        product.selection.forEach(selection => {
                            const size = selection.size;
                            const quantity = selection.quantity;

                            let commissionRate;
                            if (size === '30kg') {
                                commissionRate = product.commission.dealer30Kg;
                            } else if (size === '50kg') {
                                commissionRate = product.commission.dealer50Kg;
                            } else if (size === '70kg') {
                                commissionRate = product.commission.dealer70Kg;
                            }

                            const commission = commissionRate ? commissionRate * quantity : 0;
                            totalCommission += commission;

                            const productKey = `${product.ProductName}-${orderId}`;
                            if (!productSummary[productKey]) {
                                productSummary[productKey] = {
                                    productName: product.ProductName,
                                    sizes: {},
                                    orderId: orderId,
                                    orderDate: orderDate.toISOString().split('T')[0],
                                    totalCommission: 0,
                                    supplierInfo: product.SupplierInfo // Use SupplierInfo from the product
                                };
                            }

                            if (!productSummary[productKey].sizes[size]) {
                                productSummary[productKey].sizes[size] = 0;
                            }
                            productSummary[productKey].sizes[size] += quantity;
                            productSummary[productKey].totalCommission += commission;
                        });
                    }
                });
            });

            // Document generation logic
            doc.moveDown(1);
            doc.fontSize(12).fillColor('black');

            for (const key in productSummary) {
                const { productName, sizes, orderId, orderDate, totalCommission, supplierInfo } = productSummary[key];

               

                const sizeQuantityPairs = Object.entries(sizes)
                    .map(([size, quantity]) => `${size}: ${quantity}`)
                    .join(', ');

                doc.moveDown(0.5);
                doc.fillColor('black').font('Helvetica').fontSize(11);
                doc.text(`Order ID: ${orderId}`, { align: 'left' });
                doc.text(`Order Date: ${orderDate}`, { align: 'left' });
                doc.text(`Product Name: ${productName}`, { align: 'left' });
                doc.text(`Sizes and Quantities: ${sizeQuantityPairs}`, { align: 'left' });

                if (supplierInfo) { // Ensure supplierInfo is checked
                    doc.text(`Supplier Name: ${supplierInfo.FactoryName || 'N/A'}`, { align: 'left' });
                    doc.text(`Supplier Contact: ${supplierInfo.FactoryContact || 'N/A'}`, { align: 'left' });
                } else {
                    doc.text(`Supplier Information: Not available`, { align: 'left' });
                }

                doc.text(`Commission: ${totalCommission.toFixed(2)}`, { align: 'left' });
                doc.moveDown(0.5);
            }



            doc.moveDown(1)
                .lineWidth(2)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();

            const footerMargin = 20;
            doc.moveDown(footerMargin / 14);

            doc.font('Helvetica-Bold')
                .text(`Total Commission: ${totalCommission.toFixed(2)}`, { align: 'right' });

            doc.end();
        } catch (error) {
            console.error('Error generating PDF invoice:', error);
            res.status(500).json({ message: 'An error occurred while generating the invoice.' });
        }
    },



};
module.exports = FactoryController;