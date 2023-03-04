const mongoose = require('mongoose')

const itinerariosSchema = new mongoose.Schema({
        city: { type: String, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        userName: { type: String, required: true },
        userImg: { type: String, required: true },
        hours: { type: Number, required: true },
        price: { type: Number, required: true },
        hashtags: { type: Array, required: true },
        activities: { type: Array, required: true },
        likes: { type: Array },
        comments: [{
                comment: { type: String },
                userID: { type: mongoose.Types.ObjectId, ref: "users" },
        }],
        cityId: { type: mongoose.Types.ObjectId, ref: 'cities', required: true },

})
const Itinerarios = mongoose.model('itinerarios', itinerariosSchema)
module.exports = Itinerarios