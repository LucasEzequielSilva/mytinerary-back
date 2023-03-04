const mongoose = require('mongoose')

const activitiesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'itinerarios' },
})
const activities = mongoose.model('activities', activitiesSchema)
module.exports = activities