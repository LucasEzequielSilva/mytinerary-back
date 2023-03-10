const User = require('../models/userModel')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')        //NPM CRYPTO
const nodemailer = require('nodemailer') //NPM NODEMAILER
const jwt = require('jsonwebtoken')

const sendEmail = async (email, uniqueString) => { //FUNCION ENCARGADA DE ENVIAR EL EMAIL

    const transporter = nodemailer.createTransport({ //DEFINIMOS EL TRASPORTE UTILIZANDO NODEMAILER
        host: 'smtp.gmail.com',         //DEFINIMOS LO PARAMETROS NECESARIOS
        port: 465,
        secure: true,
        auth: {
            user: "useremailverifyMindHub@gmail.com",    //DEFINIMOS LOS DATOS DE AUTORIZACION DE NUESTRO PROVEEDOR DE
            pass: "mindhub2021"                          //COREO ELECTRONICO, CONFIGURAR CUAENTAS PARA PERMIR EL USO DE APPS
        }                                               //CONFIGURACIONES DE GMAIL
    })

    // EN ESTA SECCION LOS PARAMETROS DEL MAIL 
    let sender = "useremailverifyMindHub@gmail.com"
    let mailOptions = {
        from: sender,    //DE QUIEN
        to: email,       //A QUIEN
        subject: "Verificacion de email usuario ", //EL ASUNTO Y EN HTML EL TEMPLATE PARA EL CUERPO DE EMAIL Y EL LINK DE VERIFICACION
        html: `
        <div >
        <h1 style="color:red">Press <a href=http://localhost:8080/api/verify/${uniqueString}>HERE </a> to confirm your email. Thank You! </h1>
        </div>
        `

    };
    await transporter.sendMail(mailOptions, function (error, response) { //SE REALIZA EL ENVIO
        if (error) { console.log(error) }
        else {
            console.log("Mensaje enviado")

        }
    })
};




const usersControllers = {

    verifyEmail: async (req, res) => {


        const { uniqueString } = req.params; //EXTRAE EL EL STRING UNICO DEL LINK

        const user = await User.findOne({ uniqueString: uniqueString })
        console.log(user) //BUSCA AL USUARIO CORRESPONDIENTE AL LINK
        if (user) {
            user.emailVerificado = true //COLOCA EL CAMPO emailVerified en true
            await user.save()
            res.redirect("http://localhost:3000/") //REDIRECCIONA AL USUARIO A UNA RUTA DEFINIDA
            //return  res.json({success:true, response:"Su email se ha verificado correctamente"})
        }
        else { res.json({ success: false, response: "Your email has not been verified yet" }) }
    },


    signUpUsers: async (req, res) => {
        /*         console.log(req.body.userData)*/
        let { firstName, lastName, country, imagenURL, email, password, from } = req.body.userData
        const test = req.body.test

        try {

            const usuarioExiste = await User.findOne({ email }) //BUSCAR SI EL USUARIO YA EXISTE EN DB

            if (usuarioExiste) {
                console.log(usuarioExiste.from.indexOf(from))
                if (usuarioExiste.from.indexOf(from) === 0) {
                    console.log("resultado de if " + (usuarioExiste.from.indexOf(from) === 0)) //INDEXOF = 0 EL VALOR EXISTE EN EL INDICE EQ A TRUE -1 NO EXITE EQ A FALSE
                    res.json({
                        success: false,
                        from: "signup",
                        message: "You've already signedUp, please signIn"
                    })
                } else {
                    const contrase??aHasheada = bcryptjs.hashSync(password, 10)

                    usuarioExiste.from.push(from)
                    usuarioExiste.password.push(contrase??aHasheada)
                    if (from === "form-Signup") {
                        //PORSTERIORMENTE AGREGAREMOS LA VERIFICACION DE EMAIL
                        console.log(userData)
                        usuarioExiste.uniqueString = crypto.randomBytes(15).toString('hex')
                        await usuarioExiste.save()
                        await sendEmail(email, usuarioExiste.uniqueString) //LLAMA A LA FUNCION ENCARGADA DEL ENVIO DEL CORREO ELECTRONICO
                        res.json({
                            success: true,
                            from: "signup",
                            message: "We've already sent you an email, please check your mailbox to complete the SignUp "
                        })

                    } else {

                        usuarioExiste.save()

                        res.json({
                            success: true,
                            from: "signup",
                            message: "We've added " + from + " to complete the signIn"
                        })
                    }
                }
            } else {
                //SI EL USUARIO NO ESXITE

                const contrase??aHasheada = bcryptjs.hashSync(password, 10) //LO CREA Y ENCRIPTA LA CONTRASE??A
                console.log(contrase??aHasheada)
                // CREA UN NUEVO OBJETO DE PERSONAS CON SU USUARIO Y CONTRASE??A (YA ENCRIPTADA)
                const nuevoUsuario = await new User({
                    firstName,
                    lastName,
                    country,
                    imagenURL,
                    email,
                    password: [contrase??aHasheada],
                    uniqueString: crypto.randomBytes(15).toString('hex'),
                    emailVerificado: false,
                    from: [from],

                })

                //SE LO ASIGNA AL USUARIO NUEVO
                if (from !== "form-Signup") { //SI LA PETICION PROVIENE DE CUENTA GOOGLE
                    await nuevoUsuario.save()
                    res.json({
                        success: true,
                        from: "signup",
                        message: "User has been created from: " + from
                    }) // AGREGAMOS MENSAJE DE VERIFICACION

                } else {
                    //PASAR EMAIL VERIFICADO A FALSE
                    //ENVIARLE EL E MAIL PARA VERIFICAR
                    await nuevoUsuario.save()
                    await sendEmail(email, nuevoUsuario.uniqueString) //LLAMA A LA FUNCION ENCARGADA DEL ENVIO DEL CORREO ELECTRONICO

                    res.json({
                        success: true,
                        from: "signup",
                        message: "We've already sent you an email, please check your mailbox to complete the Sign Up"
                    }) // AGREGAMOS MENSAJE DE VERIFICACION
                }
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, message: "Something went wrong, please try again later" }) //CAPTURA EL ERROR
        }
    },
    signInUser: async (req, res, okey) => {
        const { email, password, from, imagenURL } = req.body.logedUser
        try {
            const usuarioExiste = await User.findOne({ email })

            if (!usuarioExiste) {// PRIMERO VERIFICA QUE EL USUARIO EXISTA
                res.json({ success: false, message: "Your user has not been registered, please do the Sign Up " })

            } else {
                if (from !== "form-Signup") {

                    let contrase??aCoincide = usuarioExiste.password.filter(pass => bcryptjs.compareSync(password, pass))

                    if (contrase??aCoincide.length > 0) {

                        const userData = {
                            id: usuarioExiste._id,  
                            firstName: usuarioExiste.firstName,
                            lastName: usuarioExiste.lastName,
                            email: usuarioExiste.email,
                            from: usuarioExiste.from,
                            imagenURL: usuarioExiste.imagenURL
                        }
                        await usuarioExiste.save()

                        const token = jwt.sign({ ...userData }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 })


                        res.json({
                            success: true,
                            from: from,
                            response: { token, userData },
                            message: "Welcome back " + userData.firstName + "!",
                        })

                    } else {
                        res.json({
                            success: false,
                            from: from,
                            message: "You have not done the signUp " + from + "si quieres ingresar con este metodo debes hacer el Sign Up with " + from
                        })
                    }
                } else {
                    if (usuarioExiste.emailVerificado) {

                        let contrase??aCoincide = usuarioExiste.password.filter(pass => bcryptjs.compareSync(password, pass))
                        /* console.log(contrase??aCoincide) */
                        /* console.log("resultado de busqueda de contrase??a: " + (contrase??aCoincide.length > 0)) */
                        if (contrase??aCoincide.length > 0) {

                            const userData = {
                                id: usuarioExiste._id,
                                imagenURL: usuarioExiste.imagenURL,
                                firstName: usuarioExiste.firstName,
                                lastName: usuarioExiste.lastName,
                                email: usuarioExiste.email,
                                from: usuarioExiste.from
                            }
                            const token = jwt.sign({...userData}, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 })
                            res.json({
                                success: true,
                                from: from,
                                response: { token, userData },
                                message: "Welcome again " + userData.firstName,
                            })
                        } else {
                            res.json({
                                success: false,
                                from: from,
                                message: "User and password do not match",
                            })
                        }
                    } else {
                        res.json({
                            success: false,
                            from: from,
                            message: "You have not verified your email"
                        })
                    }

                } //SI NO ESTA VERIFICADO
            }

        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Something went wrong, please try again later" })
        }
    },
    SignOutUser: async (req, res) => {

        const email = req.body.closeuser
        const user = await User.findOne({ email })
        await user.save()
        res.json(console.log('sesion cerrada ' + email))
    },

    verificarToken: (req, res) => {
        /* console.log(req.user) */
        if (!req.err) {
            res.json({
                success: true,
                response: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName, country: req.user.country, imagenURL: req.user.imagenURL, email: req.user.email, from: "token" },
                message: "Welcome back " + req.user.firstName
            })
        } else {
            res.json({
                success: false,
                message: "Please retry Sign In"
            })
        }
    },

}
module.exports = usersControllers