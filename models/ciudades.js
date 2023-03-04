const mongoose = require ('mongoose')

const ciudadesSchema = new mongoose.Schema({
    city:{type:String, required: true},
    country:{type:String, required: true},
    description:{type:String, required: true},
    day_photo:{type:String},
    sunset_photo:{type:String, required: true},
    currency:{ type: String},
    language:{ type: String},
})
const Ciudades = mongoose.model('cities', ciudadesSchema)
module.exports = Ciudades