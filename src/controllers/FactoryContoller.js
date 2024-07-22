const factory = require('../model/FactoryListModel');



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
            res.status(200).json({ result: true, statusCode: 201, factoriesList:factories, message: 'Factory data Get successfully.' });
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


};
module.exports = FactoryController;