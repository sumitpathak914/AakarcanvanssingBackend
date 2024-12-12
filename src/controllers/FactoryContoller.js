const factory = require('../model/FactoryListModel');
const Order = require('../model/OrderManagmentandDispatchModel');
const PDFDocument = require('pdfkit'); // Import pdfkit
const fs = require('fs'); // Import fs for file system operations
const path = require('path');
const User = require('../model/userModel');
const ExcelJS = require('exceljs');
const FactoryController = {

    SaveFactory: async (req, res) => {
        const factoryData = req.body;

        try {
            // Create a new Factory document
            const newFactory = new factory({
                factoryName: factoryData.factoryName,
                contactPerson: factoryData.contactPerson,
                contactNo: factoryData.contactNo,
                email: factoryData.email,
                website: factoryData.website,
                CommissionDoneAmount: factoryData.CommissionDoneAmount,
                factoryAddress: factoryData.factoryAddress,
                city: factoryData.city,
                postalCode: factoryData.postalCode,
                country: factoryData.country,
                State: factoryData.State,
                FASSAINumber: factoryData.FASSAINumber,
                GSTNumber: factoryData.GSTNumber,
                products: factoryData.products,
                factoryId: factoryData.factoryId
            });

            // Save the new factory document to the database
            await newFactory.save();

            res.status(201).json({ result: true, statusCode: 201, message: 'Factory data saved successfully.' });
        } catch (error) {
            console.error('Error saving factory data:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to save factory data.' });
        }
    },


    // GET all factories
    getAllFactories: async (req, res) => {
        try {
            const factories = await factory.find();
            res.status(200).json({ result: true, statusCode: 201, factoriesList: factories, message: 'Factory data Get successfully.' });
        } catch (error) {
            console.error('Error fetching factories:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to fetch factories.' });
        }
    },

    // GET single factory by ID
    getFactoryById: async (req, res) => {
        const { id } = req.params;
        try {
            const factory = await factory.findById(id);
            if (!factory) {
                return res.status(404).json({ error: 'Factory not found.' });
            }
            res.status(200).json(factory);
        } catch (error) {
            console.error('Error fetching factory by ID:', error);
            res.status(500).json({ error: 'Failed to fetch factory.' });
        }
    },
    calculateFactoryCommission: async (req, res) => {
        try {
            const orders = await Order.find(); // Fetch all orders
            const commissions = {};

            // Loop through orders to calculate commissions
            for (const order of orders) {
                // Loop through the ProductDetails array
                for (const product of order.ProductDetails) {
                    // Check if the product's dispatch status is completed
                    if (product.dispatchShippingDetails.DispatchStatus === 'Completed') {
                        const factoryId = product.SupplierInfo.FactoryId; // Get the factory ID from the product
                        const commissionRates = product.commission; // Get commission rates for different sizes
                        console.log(commissionRates, "---------commissionRates-------")
                        // Calculate commission based on the size and quantity
                        for (const selection of product.selection) {
                            const size = selection.size; // Get the size of the product
                            const quantity = selection.quantity; // Get the quantity of the product

                            let commissionRate;
                            if (size === '30kg') {
                                commissionRate = commissionRates.supplier30Kg; // Get the supplier commission for 30kg
                            } else if (size === '50kg') {
                                commissionRate = commissionRates.supplier50Kg; // Get the supplier commission for 50kg
                            } else if (size === '25kg') {
                                commissionRate = commissionRates.supplier25Kg; // Get the supplier commission for 70kg
                            }
                            else if (size === '100kg') {
                                commissionRate = commissionRates.supplier100Kg; // Get the supplier commission for 70kg
                            }

                            if (commissionRate) {
                                // Calculate total commission for this product
                                const totalCommission = commissionRate * quantity;

                                // Initialize the commission for this factory if it doesn't exist
                                if (!commissions[factoryId]) {
                                    commissions[factoryId] = 0;
                                }

                                // Add the total commission to the factory's total
                                commissions[factoryId] += totalCommission;
                            }
                        }
                    }
                }
            }

            res.status(200).json({ result: true, statusCode: 200, commissions });
        } catch (error) {
            console.error('Error calculating factory commissions:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to calculate commissions.' });
        }
    },





    // generateFactoryInvoice: async (req, res) => {
    //     const { factoryId, startDate, endDate, factoryName, factoryAddress, factoryContact } = req.body;

    //     try {
    //         const start = new Date(startDate);
    //         const end = new Date(endDate);
    //         end.setHours(23, 59, 59, 999);

    //         const orders = await Order.find({
    //             'ProductDetails.SupplierInfo.FactoryId': factoryId,
    //         });

    //         if (!orders.length) {
    //             return res.status(404).json({ message: 'No orders found for the selected date range.' });
    //         }

    //         const doc = new PDFDocument({ margin: 50 });
    //         res.setHeader('Content-Type', 'application/pdf');
    //         res.setHeader('Content-Disposition', `attachment; filename=invoice_${factoryId}_${Date.now()}.pdf`);
    //         doc.pipe(res);

    //         // Generate an 8-digit random invoice number
    //         const generateInvoiceNumber = () => {
    //             // Generate a random 8-digit number between 10000000 and 99999999
    //             return Math.floor(10000000 + Math.random() * 90000000).toString();
    //         };

    //         const invoiceNumber = generateInvoiceNumber();
    //         doc
    //             .fontSize(20)
    //             .text(`${factoryName}`, { align: 'center' })
    //             .moveDown()
    //             .fontSize(12)
    //             .text(`Factory Address: ${factoryAddress},`, { align: 'center' })
    //             .text(`Contact:${factoryContact}`, { align: 'center' })
    //             .moveDown(2)
    //             .lineWidth(2)
    //             .moveTo(50, doc.y)
    //             .lineTo(550, doc.y)
    //             .stroke()
    //             .moveDown();

    //         // Invoice Details
    //         doc
    //             .fontSize(14)
    //             .text(`Invoice No: ${invoiceNumber}`, { align: 'left' })
    //             .text(`Date Range: ${startDate} to ${endDate}`, { align: 'left' })
    //             .moveDown(1);

    //         let totalCommission = 0;
    //         const productSummary = {}; // Object to consolidate product info


    //         // Loop through orders
    //         orders.forEach(order => {
    //             const orderId = order.orderId; // Store the Order ID for each order
    //             const customerInfo = order.customerInfo; // Get customer info for the order

    //             // Loop through ProductDetails to check each product's OrderDate and supplier's factory ID
    //             order.ProductDetails.forEach(product => {
    //                 const orderDate = new Date(product.OrderDate); // Convert OrderDate to a Date object

    //                 // Check if the OrderDate is within the specified range and factory ID matches
    //                 if (orderDate >= start && orderDate <= end && product.SupplierInfo.FactoryId === factoryId) {
    //                     // Check if the order date is within the range and factory ID matches
    //                     if (product.dispatchShippingDetails?.DispatchStatus === 'Completed') {
    //                         product.selection.forEach(selection => {
    //                             const size = selection.size;
    //                             const quantity = selection.quantity;

    //                             let commissionRate;
    //                             if (size === '30kg') {
    //                                 commissionRate = product.commission.supplier30Kg;
    //                             } else if (size === '50kg') {
    //                                 commissionRate = product.commission.supplier50Kg;
    //                             } else if (size === '70kg') {
    //                                 commissionRate = product.commission.supplier70Kg;
    //                             }

    //                             const commission = commissionRate ? commissionRate * quantity : 0;
    //                             totalCommission += commission;

    //                             // Consolidate product info
    //                             const productKey = `${product.ProductName}-${orderId}`; // Key includes only ProductName and Order ID
    //                             if (!productSummary[productKey]) {
    //                                 productSummary[productKey] = {
    //                                     productName: product.ProductName,
    //                                     sizes: {}, // To hold size and quantity
    //                                     orderId: orderId, // Store the Order ID
    //                                     orderDate: orderDate.toISOString().split('T')[0], // Format order date as YYYY-MM-DD
    //                                     totalCommission: 0, // Initialize total commission for this product
    //                                     customerInfo: customerInfo // Store the customer info
    //                                 };
    //                             }

    //                             // Aggregate size and quantity
    //                             if (!productSummary[productKey].sizes[size]) {
    //                                 productSummary[productKey].sizes[size] = 0;
    //                             }
    //                             productSummary[productKey].sizes[size] += quantity; // Aggregate quantity for the same size

    //                             // Aggregate commission for the same product
    //                             productSummary[productKey].totalCommission += commission;
    //                         });
    //                     }
    //                 }
    //             });
    //         });


    //         doc.moveDown(1);
    //         doc.fontSize(12).fillColor('black');

    //         for (const key in productSummary) {
    //             const { productName, sizes, orderId, orderDate, totalCommission, customerInfo } = productSummary[key];
    //             const sizeQuantityPairs = Object.entries(sizes)
    //                 .map(([size, quantity]) => `${size}: ${quantity}`)
    //                 .join(', '); // Create the "Size-Quantity" string

    //             doc.moveDown(0.5);
    //             doc.fillColor('black').font('Helvetica').fontSize(11);
    //             doc.text(`Order ID: ${orderId}`, { align: 'left' });
    //             doc.text(`Order Date: ${orderDate}`, { align: 'left' }); // Display the order date
    //             doc.text(`Product Name: ${productName}`, { align: 'left' });
    //             doc.text(`Sizes and Quantities: ${sizeQuantityPairs}`, { align: 'left' });
    //             doc.text(`Customer Name: ${customerInfo.CustomerName}`, { align: 'left' });
    //             doc.text(`Shop Name: ${customerInfo.ShopName}`, { align: 'left' });
    //             doc.text(`Email ID: ${customerInfo.EmailID}`, { align: 'left' });
    //             doc.text(`Commission: ${totalCommission.toFixed(2)}`, { align: 'left' });
    //             doc.moveDown(0.5);
    //         }

    //         // Footer Section: Total Commission
    //         doc.moveDown(1) // This creates space before the line
    //             .lineWidth(2)
    //             .moveTo(50, doc.y) // Get the current y position for the line
    //             .lineTo(550, doc.y) // Draw the line across the page
    //             .stroke(); // Render the line

    //         // Add margin from the top
    //         const footerMargin = 20; // Define the margin from the top
    //         doc.moveDown(footerMargin / 14); // Convert margin to PDF points

    //         doc.font('Helvetica-Bold')
    //             .text(`Total Commission: ${totalCommission.toFixed(2)}`, { align: 'right' });

    //         // Finalize PDF file
    //         doc.end();
    //     } catch (error) {
    //         console.error('Error generating PDF invoice:', error);
    //         res.status(500).json({ message: 'An error occurred while generating the invoice.' });
    //     }
    // },

    generateFactoryInvoice: async (req, res) => {
        const { factoryId, startDate, endDate } = req.body;

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            // Fetch orders where the FactoryId exists in the ProductDetails array
            const orders = await Order.find({
                'ProductDetails.SupplierInfo.FactoryId': factoryId,
            });

            if (!orders.length) {
                return res.status(404).json({ message: 'No orders found for the selected date range.' });
            }

            // Filter and map orders while calculating the commission
            const filteredOrders = orders.map(order => {
                let totalCommission = 0; // Initialize total commission for the order

                // Filter the ProductDetails array to match the criteria
                const filteredProductDetails = order.ProductDetails
                    .filter(product => {
                        const orderDate = new Date(product.OrderDate);
                        return (
                            orderDate >= start &&
                            orderDate <= end &&
                            product.SupplierInfo.FactoryId === factoryId &&
                            product.dispatchShippingDetails?.DispatchStatus === 'Completed'
                        );
                    })
                    .sort((a, b) => {
                        // Sorting by OrderDate; modify as needed
                        return new Date(a.OrderDate) - new Date(b.OrderDate);
                    });

                // Calculate commission for each product in the filtered details
                filteredProductDetails.forEach(product => {
                    if (product.selection && Array.isArray(product.selection)) {
                        product.selection.forEach(selection => {
                            const size = selection.size;
                            const quantity = selection.quantity;

                            let commissionRate;
                            if (size === '30kg') {
                                commissionRate = product.commission.supplier30Kg;
                            } else if (size === '50kg') {
                                commissionRate = product.commission.supplier50Kg;
                            } else if (size === '25kg') {
                                commissionRate = product.commission.supplier25Kg;
                            } else if (size === '100kg') {
                                commissionRate = product.commission.supplier100Kg;
                            }

                            const commission = commissionRate ? commissionRate * quantity : 0;
                            totalCommission += commission;
                        });
                    }
                });

                // Only include orders where there are matching ProductDetails
                if (filteredProductDetails.length > 0) {
                    return {
                        orderId: order.orderId,
                        customerInfo: order.customerInfo,
                        totalCommission: totalCommission.toFixed(2), // Add total commission
                        ProductDetails: filteredProductDetails,
                    };
                }

                // Return null if no matching ProductDetails exist
                return null;
            }).filter(order => order !== null); // Remove null values

            // Check if any orders pass the filter and sorting
            if (filteredOrders.length === 0) {
                return res.status(404).json({ message: 'No orders found for the selected date range and criteria.' });
            }

            res.json({ message: "List fetched successfully", orders: filteredOrders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'An error occurred while fetching orders.' });
        }
    },




    calculateSingleFactoryCommission: async (req, res) => {
        const { factoryId } = req.body; // Get the factoryId from the request body
        try {
            // Fetch orders for the requested factory
            const orders = await Order.find({
                'ProductDetails.SupplierInfo.FactoryId': factoryId,
            });

            // Fetch only the specific factory based on factoryId
            const factory = await User.findOne({ factoryId: factoryId }); // Use findOne to get a single factory

            const commissions = {};
            const productCommissionDetails = {}; // Use an object to aggregate product details

            // Loop through orders to calculate commissions
            for (const order of orders) {
                const orderId = order.orderId; // Capture the orderID

                // Filter out only the products with DispatchStatus as 'Completed' and matching FactoryId
                const completedProducts = order.ProductDetails.filter((product) => {
                    return (
                        product.dispatchShippingDetails.DispatchStatus === 'Completed' &&
                        product.SupplierInfo.FactoryId === factoryId // Check if FactoryId matches
                    );
                });

                // If there are no completed products in this order, skip this order
                if (completedProducts.length === 0) {
                    continue; // Move to the next order
                }

                // Process only completed products that match the factory
                for (const product of completedProducts) {
                    const commissionRates = product.commission; // Commission rates for different sizes

                    for (const selection of product.selection) {
                        const size = selection.size; // Product size (e.g., 30kg, 50kg, etc.)
                        const quantity = selection.quantity; // Quantity ordered

                        let commissionRate;
                        // Check commission rate based on size
                        if (size === '30kg') {
                            commissionRate = commissionRates.supplier30Kg;
                        } else if (size === '50kg') {
                            commissionRate = commissionRates.supplier50Kg;
                        } else if (size === '25kg') {
                            commissionRate = commissionRates.supplier25Kg;
                        } else if (size === '100kg') {
                            commissionRate = commissionRates.supplier100Kg;
                        }

                        if (commissionRate) {
                            // Calculate total commission for this product
                            const totalCommission = commissionRate * quantity;

                            // Initialize the commission for this factory if it doesn't exist
                            if (!commissions[factoryId]) {
                                commissions[factoryId] = 0;
                            }

                            // Add total commission to the factory's total commission
                            commissions[factoryId] += totalCommission;

                            // Create a unique key for the combination of orderId, productId, and size
                            const key = `${orderId}-${product.ProductID}-${size}`;

                            // If the product already exists, aggregate quantities
                            if (productCommissionDetails[key]) {
                                productCommissionDetails[key].quantity += quantity; // Aggregate the quantity
                            } else {
                                // Initialize a new entry for this product
                                productCommissionDetails[key] = {
                                    orderId: orderId,
                                    productId: product.ProductID,
                                    productName: product.ProductName,
                                    size: size,
                                    quantity: quantity,
                                    commissionRate: commissionRate,
                                    totalCommission: totalCommission,
                                };
                            }
                        }
                    }
                }
            }

            // Convert the aggregated productCommissionDetails object to an array
            const finalCommissionDetails = Object.values(productCommissionDetails).map(detail => {
                return {
                    orderId: detail.orderId,
                    productId: detail.productId,
                    productName: detail.productName,
                    size: detail.size,
                    quantity: detail.quantity,
                    commissionRate: detail.commissionRate,
                    totalCommission: detail.totalCommission,
                };
            });

            // Check if the factory exists and has CommissionDoneAmount
            const factoryCommissionDoneAmount = factory ? factory.CommissionDoneAmount : 0;

            res.status(200).json({
                result: true,
                statusCode: 200,
                totalFactoryCommission: commissions[factoryId] || 0, // Ensure 0 if no commissions
                productCommissionDetails: finalCommissionDetails,
                factoriesPaymentDoneAmount: factoryCommissionDoneAmount, // Send the specific factory's CommissionDoneAmount
            });
        } catch (error) {
            console.error('Error calculating factory commissions:', error);
            res.status(500).json({
                result: false,
                statusCode: 500,
                error: 'Failed to calculate commissions.',
            });
        }
    },















};
module.exports = FactoryController;