const Itinerarios = require('../models/itinerarios')
const commentsControllers = {
    addComment: async (req, res) => {
        const {itineraryId,comments} = req.body
        const user = req.user._id
        try {
            const nuevoComment = await Itinerarios
                .findOneAndUpdate({_id:itineraryId}, {$push: {comments: {comment: comments.comment, userID: user}}}, {new: true})
                .populate("comments.userID", {firstName:1, imagenURL:1, email:1})
                console.log(nuevoComment)
            res.json({ success: true, response:{nuevoComment}, message:"Thanks you for let us your comment!" })

        }
        catch (error) {
            console.log(error)
            res.json({ success: false, message: "Something went wrong, try again in a few minutes!" })
        }
    },
    modifyComment: async (req, res) => {
        const { comments } = req.body
        const idComment = req.params.id
        const user = req.user._id
        try {
            const modifyComment = await Itinerarios.findOneAndUpdate({"comments._id":idComment}, {$set: {"comments.$.comment": comments.comment}}, {new: true}) /* me devuelve el nuevo dato */
            console.log(modifyComment)
            res.json({ success: true, response:{modifyComment}, message:"Your comment has been modified" })
        }
        catch (error) {
            console.log(error)
            res.json({ success: false, message: "Something went wrong, try again in a few minutes" })
        }

    },
    deleteComment: async (req, res) => {
        const id = req.params.id
        const user = req.user._id
        console.log(id)
        console.log(user)
        try {
            const deleteComment = await Itinerarios.findOneAndUpdate({"comments._id":id}, {$pull: {comments: {_id: id}}}, {new: true}) /* extraigo comment */
          console.log(deleteComment)
            res.json({ success: true, response:{deleteComment}, message: "You deleted the comment" })

        }
        catch (error) {
            console.log(error)
            res.json({ success: false, message: "Something went wrong, try again in a few minutes" })
        }

    },
    
}
module.exports = commentsControllers