const mongoose = require("mongoose");

const mapboxUsageSchema = new mongoose.Schema({
  service: { type: String, required: true },
  count: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const MapboxUsage = mongoose.model("MapboxUsage", mapboxUsageSchema);

module.exports = MapboxUsage;
