const Router = require('express').Router()
const validator = require('../config/validator')
const passport = require('../config/passport')

const ciudadesController = require('../controllers/ciudadesControllers')
const { obtenerCiudades, cargarCiudad, borrarCiudad, modificarCiudad, consultarCiudadesPorID } = ciudadesController

const itinerariosControllers = require('../controllers/itinerariosControllers')
const { obtenerItinerarios, cargarItinerarios, borrarItinerario, modificarItinerario, ObtenerUnItinerarioPorId, LikeAndDislike } = itinerariosControllers

const usersControllers = require('../controllers/userControllers');
const { signUpUsers, signInUser, SignOutUser, verifyEmail, verificarToken } = usersControllers

const activitiesControllers = require(`../controllers/activitiesControllers`);
const { getAllActivities, getOneActivities, uploadActivities, deleteActivities, modifyActivities, getItineraryActivities } = activitiesControllers;

const commentsControllers = require('../controllers/commentsControllers');
const {addComment, modifyComment,deleteComment}= commentsControllers
/* CIUDADES */

Router.route('/allcities')
    .get(obtenerCiudades)
    .post(cargarCiudad)

Router.route('/allcities/:id')
    .delete(borrarCiudad)
    .put(modificarCiudad)
    .get(consultarCiudadesPorID)

/* ITINERARIOS */

Router.route('/itinerarios')
    .get(obtenerItinerarios)
    .post(cargarItinerarios)

Router.route('/itinerarios/:id')
    .delete(borrarItinerario)
    .put(modificarItinerario)
    .get(ObtenerUnItinerarioPorId)

// USERNAME

Router.route('/auth/signUp')
    .post(signUpUsers, validator)

Router.route('/auth/signIn')
    .post(signInUser)

Router.route('/auth/signOut')
    .post(SignOutUser)

Router.route('/verify/:uniqueString') //RECIBE EL LINK DE USUARIO
    .get(verifyEmail)
//LLAMA A FUNCION DE VERIFICACIION

Router.route('/auth/signInToken')
    .get(passport.authenticate('jwt', { session: false }), verificarToken)

//LIKES

Router.route("/itinerarios/likes/:id")
    .put(passport.authenticate("jwt", { session: false }), LikeAndDislike)

//ACTIVITIES

Router.route(`/activities`)
    .get(getAllActivities)
    .post(uploadActivities)

Router.route(`/activities/:id`)
    .delete(deleteActivities)
    .put(modifyActivities)
    .get(getOneActivities)
    
    Router.route(`/itineraryActivities/:id`)
    .get(getItineraryActivities)


//COMMENTS_CONTROLLERS
Router.route('/itinerarios/comment')
.post(passport.authenticate('jwt',{ session: false }),addComment)

Router.route('/itinerarios/comment/:id')
.put(passport.authenticate('jwt',{ session: false }),modifyComment)
.post(passport.authenticate('jwt',{ session: false }),deleteComment)






module.exports = Router