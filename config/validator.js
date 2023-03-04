const joi = require('joi')

const validator = (req, res, next) => {

    const schema = joi.object({
        
        firstName: joi.string().max(20).min(3).trim().pattern(new RegExp('[a-zA-Z]')).required().messages({
            'string.min': 'The name must have more than three letters',
            'string.max': 'The name must have less than twenty letters'
        }),
       lastName: joi.string().max(20).min(3).trim().pattern(new RegExp('[a-zA-Z]')).required().messages({
            'string.min': 'The last name must have more than three letters',
            'string.max': 'The last name must have less than twenty letters'
        }),
        password: joi.string().min(6).trim().required().messages({
            'string.min': 'The password must have more than three letters',
            'string.max': 'The password must have less than twenty letters'
        }),
        email: joi.string().email().required(),
        imagenURL: joi.string(),
        country: joi.string(),
        from: joi.string()
    })

    const validate = schema.validate(req.body, { abortEarly: false })

    if(validate.error) {
        return res.json( { success: false, response: validate.error.details } )
    }

    next()
}

module.exports = validator 