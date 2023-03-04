const Activities = require("../models/activities");

const activitiesControllers = {
    getAllActivities: async (req, res) => {
        console.log(req);
        const data = await Activities.find().populate("itineraryId");
        res.json({
            response: data,
        });
    },

    getItineraryActivities: async (req, res) => {
        try {
            const ActivitiesPerItinerary = await Activities.find({
                itineraryId: req.params.id,
            });

            res.json({
                success: true,
                response: ActivitiesPerItinerary
            });
        } catch (error) {
            console.log(error);
        }
    },
    getOneActivities: async (req, res) => {
        const id = req.params.id;
        const data = await Activities.findOne({ _id: id }).populate(
            "itineraryId"
        );
        res.json({ response: data });
    },
    uploadActivities: (req, res) => {
        const {
            name,
            description,
            image,
            itineraryId,
        } = req.body;
        new Activities({
            name,
            image,
            description,
            itineraryId,
        })
            .save()
            .then((respuesta) => res.json({ respuesta }));
    },
    deleteActivities: async (req, res) => {
        const id = req.params.id;
        await Activities.findOneAndDelete({ _id: id }).then(
            (respuesta) => res.json({ respuesta })
        );
    },
    modifyActivities: async (req, res) => {
        const id = req.params.id;
        const itinerary = req.body;

        await Activities.findOneAndUpdate(
            { _id: id },
            itinerary
        ).then((respuesta) => res.json({ respuesta }));
    },
}
module.exports = activitiesControllers;
