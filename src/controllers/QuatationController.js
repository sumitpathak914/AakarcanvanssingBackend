const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const Quotation = require('../model/QuatationModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 465 for Gmail with SSL/TLS
    secure: true, // Set secure to true for port 465
    auth: {
        user: 'sumitpathakofficial914@gmail.com',
        pass: 'awtiquudehddpias' // Use an app password, not your Gmail password
    }
});


const QuotationController = {
    saveQuotation: async (req, res) => {
        const { Action, ShopInformation, AddDetails, QuotationDetails, htmlContent,
            ProductDetails } = req.body;

        try {
            if (Action === 1) {
                // Generate PDF
                const productRows = ProductDetails.selectedProducts.map(product => {
                    const selectionItems = product.selection.map((item, index) => {
                        return `<li key="${index}">Bag size ${item.size} with quantity ${item.quantity}</li>`;
                    }).join(''); // Join the items into a single string

                    // Calculate the discounted price if a discount is available
                    const discountedPrice = product.discount
                        ? (product.price - (product.price * (product.discount / 100))).toFixed(2)
                        : '';

                    return `
        <tr>
            <td>${product.productCode} ${product.productName}</td>
            <td>
                <ul>
                    ${selectionItems} <!-- Insert the selection items here -->
                </ul>
            </td>
            <td>
                ${product.discount ?
                        `<del>${product.price}/kg</del><br /> ₹ ${discountedPrice}/kg` :
                            `₹ ${product.price}/kg`
                        }
            </td>
            <td>${product.discount || '0'}%</td>
            <td>₹ ${product.Dis_Amt}</td>
            <td>₹ ${product.Total.toFixed(2)}</td>
        </tr>
    `;
                }).join('');
// Join all product rows into a single string


                // Calculate total amounts
                // const subtotal = ProductDetails.selectedProducts.reduce((acc, product) => {
                //     const discountAmt = product.discount ? (product.price * product.selection[0].quantity * product.discount / 100) : 0;
                //     return acc + ((product.price * product.selection[0].quantity) - discountAmt);
                // }, 0);

                const subtotal = ProductDetails.Subtotal + ProductDetails.TotalDiscount
                const totalDiscount = ProductDetails.TotalDiscount


            
                const grandTotal = subtotal - totalDiscount;


                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Quotation</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #f4f4f4;
                            }
                            .container {
                                width: 800px;
                                margin: 20px auto;
                                background-color: #fff;
                                padding: 20px;
                                border-radius: 10px;
                                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                            }
                            .header {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                border-bottom: 2px solid #eee;
                                padding-bottom: 20px;
                            }
                            .header img {
                                width: 150px;
                            }
                            .header .details {
                                text-align: right;
                                 margin-top: -110px;
                            }
                            .header .details p {
                                margin: 0;
                                line-height: 1.5;
                            }
                            .customer-info, .billing-address {
                                width: 45%;
                            }
                            .customer-info, .billing-address, .contact-info {
                                margin-top: 20px;
                                border: 1px solid #eee;
                                padding: 10px;
                                border-radius: 5px;
                            }
                            .customer-info h3, .billing-address h3, .contact-info h3 {
                                margin-top: 0;
                            }
                            .customer-info p, .billing-address p, .contact-info p {
                                margin: 5px 0;
                            }
                            .table-container {
                                margin-top: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                            }
                            table, th, td {
                                border: 1px solid #eee;
                            }
                            th, td {
                                padding: 10px;
                                text-align: left;
                            }
                            th {
                                background-color: #f9f9f9;
                            }
                            .footer {
                                margin-top: 20px;
                                text-align: center;
                                font-size: 12px;
                                color: #777;
                            }
                            .footer p {
                                margin: 5px 0;
                            }
                            .total {
                                text-align: right;
                                margin-top: 20px;
                            }
                            .total p {
                                margin: 5px 0;
                            }
                            .total .amount {
                                font-weight: bold;
                                font-size: 1.2em;
                            }
                            .signature {
                                margin-top: 60px;
                            }
                            .box {
                                margin-top: 40px;
                            }
                            .business {
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                             <img src="http://localhost:5000/asset/AdminLogo.png" alt="Company Logo">

                                <div class="details">
                                    <p><strong>Quotation ID:</strong> ${AddDetails.QuotationID}</p>
                                    <p><strong>Generated on:</strong> ${AddDetails.QuotationDate}</p>
                                    <p><strong>Valid Till:</strong> ${AddDetails.ExpiryDate}</p>
                                    <p><strong>Prepared By:</strong> AAKAR Canvassing</p>
                                </div>
                            </div>
                            <div class="contact-info">
                                <h3>Anand Talera</h3>
                                <p>Phone: +91 9921455999, +91 8149841266</p>
                                <p>Email: anandtalera@gmail.com</p>
                                <p>Address: Office No. 3, 5th Floor, Siddhi Pooja Business Square, Sharannpur Road, Nashik- 422005</p>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div class="customer-info">
                                    <h3>Customer Info</h3>
                                    <p><strong>Contact Person:</strong> ${ShopInformation.ShopOwnerContactPerson}</p>
                                    <p><strong>Shop Name:</strong> ${ShopInformation.ShopName}</p>
                                    <p><strong>Contact:</strong> ${ShopInformation.Contact}</p>
                                    <p><strong>Email ID:</strong> ${ShopInformation.EmailID}</p>
                                    <p><strong>GST No:</strong> 0000000000000</p>
                                    <p><strong>FSSAI No:</strong> 0000000000000</p>
                                </div>
                                <div class="billing-address">
                                    <h3>Billing Address</h3>
                                    <p>${ShopInformation.BillingAddress}</p>
                                </div>
                            </div>
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product ID</th>
                                            <th>Quantity</th>
                                            <th>Base Price</th>
                                            <th>Discount</th>
                                            <th>Discount Amt</th>
                                          
                                            <th>Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productRows}
                                    </tbody>
                                </table>
                            </div>
                            <div class="total">
                                <p>SUBTOTAL: ₹ ${subtotal.toFixed(2)}</p>
                                <p>DISCOUNT: - ₹ ${totalDiscount.toFixed(2)}</p>
                                <p class="amount">GRAND TOTAL: ₹ ${grandTotal.toFixed(2)}</p>
                            </div>
                            <p class='business'>Thank you for your Business</p>
                            <div class="signature">
                                <div>
                                    <p>Signature</p>
                                </div>
                                <div class='box'>
                                 <p><strong> ${ShopInformation.ShopName}</strong> </p>
                               
                                    <p>Printed Name</p>
                                </div>
                                <div class='box'>
                                <p><strong>${AddDetails.QuotationDate}</strong> </p>
                                    <p>Date</p>
                                </div>
                            </div>
                            <div class="footer">
                                <p>This quotation is not a contract or a bill. It is our best guess at the total price for the service and goods described above.</p>
                                <p>The customer will be billed after indicating acceptance of this quote. Payment will be due prior to the delivery of service and goods. Please fax or mail the signed quote to the address listed above.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;
                const pdfFilePath = path.join(__dirname, `../quotation-${Date.now()}.pdf`);
                const browser = await puppeteer.launch({
                    headless: true, // Make sure headless mode is enabled
                    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional flags to improve compatibility on certain environments
                });
                const page = await browser.newPage();
                await page.setContent(htmlContent);
                await page.pdf({ path: pdfFilePath, format: 'A4' });

                await browser.close();

              

                    // Prepare email content
                    const customerName = ShopInformation.ShopOwnerContactPerson;
                    const companyName = ShopInformation.ShopName;
                    const contactInformation = ShopInformation.Contact;
                    const contactEmail = ShopInformation.EmailID;

                    const mailOptions = {
                        from: 'sumitpathakofficial914@gmail.com',
                        to: contactEmail,
                        subject: 'Quotation Details',
                        text: `Dear ${customerName},
    
    We hope this email finds you well.

    Quotation Details:
    Quotation ID: ${AddDetails.QuotationID}
    Date: ${new Date().toLocaleDateString()}
    Customer Name: ${customerName}
    Company Name: ${companyName}
    Contact Information: ${contactInformation}
    
    Validity: This quotation is valid until ${AddDetails.ExpiryDate}. If you have any questions or need 
    further clarification, please feel free to reach out to us at +91 7896959655. We are here to assist 
    you with any queries you may have.
    To confirm this quotation and proceed with your order, please reply to this email or contact us 
    directly at +91 7896959655.
    We look forward to serving you and providing you with high-quality agro products.

    Thank you for considering Aakar Canvassing for your agro product needs. We are pleased to 
    provide you with a quotation for the products you have requested.
    
    Please find the details of your quotation attached in PDF format.
    
    
   
    Best regards,
    Aakar Canvassing`,
                        attachments: [
                            {
                                filename: `${customerName}-${AddDetails.QuotationID}.pdf`,
                                path: pdfFilePath,
                                contentType: 'application/pdf'
                            }
                        ]
                    };

                    transporter.sendMail(mailOptions, function (error, _) {
                        if (error) {
                            console.error(error);
                            res.status(500).json({ error: error.message });
                        } else {
                            // Delete temporary PDF file after sending email
                            fs.unlinkSync(pdfFilePath);

                            // Save quotation
                            const newQuotation = new Quotation(req.body);
                            newQuotation.save()
                                .then(() => {
                                    res.status(201).json({ message: 'Quotation saved successfully.' });
                                })
                                .catch(error => {
                                    res.status(500).json({ error: error.message });
                                });
                        }
                    });
             
            } else {
                // Save quotation directly
                const newQuotation = new Quotation(req.body);
                await newQuotation.save();
                res.status(201).json({ message: 'Quotation saved successfully.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getQuotations: async (req, res) => {
        try {
            const quotations = await Quotation.find();
            res.status(200).json({ result: true, statusCode: 200, quotationsList: quotations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
     getRecordById : async (req, res) => {
        try {
            const id = req.params.id; // Get ID from the request parameters
            const record = await Quotation.findById(id); // Fetch the record by ID

            if (!record) {
                return res.status(404).json({ message: 'Record not found' });
            }

            res.status(200).json(record); // Send the record back as a response
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
     deleteRecordById : async (req, res) => {
        try {
            const id = req.params.id; // Get ID from the request parameters
            const deletedRecord = await Quotation.findByIdAndDelete(id); // Delete the record by ID

            if (!deletedRecord) {
                return res.status(404).json({ message: 'Record not found' });
            }

            res.status(200).json({ message: 'Record deleted successfully' }); // Send a success message
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

};

module.exports = QuotationController;
