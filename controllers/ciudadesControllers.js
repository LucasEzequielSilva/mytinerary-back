const Ciudades = require('../models/ciudades')
const ciudadesController = {
    obtenerCiudades: async (req, res) => {
        let ciudades
        let error = null
        try {
            ciudades = await Ciudades.find()
        } catch (err) {
            error = err
            console.log(error)
        }
        res.json({
            response: error ? 'ERROR' : { ciudades },
            success: error ? false : true,
            error: error
        })
    },
    consultarCiudadesPorID: async (require, response) => {
        const id = require.params.id
        console.log(id)
        try {
        let ciudades = await Ciudades.findOne({ _id: id })
        console.log(ciudades)
        response.json({ paso: "listo", respuesta: ciudades })
        }catch(error){
            console.log(error);
           response.json({ error })
        }
    },
    cargarCiudad: async (required, response) => {

        const { city, country, day_photo, sunset_photo, description, flag } = required.body
        new Ciudades({ city, country, day_photo, sunset_photo, description, flag }).save()
            .then((respuesta) => response.json({ respuesta }))
            .catch(error => response.json({ error }))
    },

    borrarCiudad: async (req, res) => {
        const id = req.params.id
        var ciudadEliminada
        ciudadEliminada = await Ciudades.findOneAndDelete({ _id: id })
            .then((res) => res.json({ paso: "listo", respuesta: res }))
            .catch(error => res.json({ error }))
    },

    modificarCiudad: async (req, res) => {
        const id = req.params.id
        const ciudad = req.body


        var ciudadb = await Ciudades.findOneAndUpdate({ _id: id }, ciudad, { new: true })/* .populate('622748244d1a12d866f83838', '622748244d1a12d866f83837') */
            .then((response) => res.json({ paso: "listo", respuesta: response }))
            .catch(error => res.json({ error }))
        console.log(ciudadb)
    }
}
module.exports = ciudadesController
