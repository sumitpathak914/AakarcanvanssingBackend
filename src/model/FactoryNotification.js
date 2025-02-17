const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    factoryId: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Number, default: 0 }, // 0 for unread, 1 for read
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('FactoryNotification', NotificationSchema);

module.exports = Notification;
