const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stock: { type: String, required: true },
    ip: { type: String, required: true }
});

module.exports = mongoose.model('Stock', stockSchema);