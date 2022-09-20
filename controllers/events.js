const {response} = require('express');
const Evento = require('../models/Evento');

const getEvent = async( req, res = response) =>{

    const events = await Evento.find()
                                    .populate('user', 'name');

    return res.json({
        ok:true,
        events
    })

}

const createEvent = async( req, res = response)=>{

    // const { title, note, start, end } = req.body;
    const evento = new Evento(req.body);
    
    try {

        evento.user = req.uid;

        const saveEvent = await evento.save();

        res.json({
            ok:true,
            evento:saveEvent
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok:false,
            msg:'Please talk whit the manager'
        })
        
    }


}

const updateEvent = async( req, res = response)=>{

    const eventId = req.params.id;

    try {

        const event = await Evento.findById( eventId );
        const uid = req.uid;

        if( !event ){
            return res.status(404).json({
                ok:false,
                msg:'Event whit id doesnt exist'
            })
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok:false,
                msg:'Dont have privilege for edit this event'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updateEvent = await Evento.findByIdAndUpdate( eventId, newEvent, { new:true } );

        res.json({
            ok:true,
            event: updateEvent
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Please talk whit the manager'
        });
    }

}

const deleteEvent = async( req, res = response)=>{

    const eventId = req.params.id;

    try {

        const event = await Evento.findById( eventId );
        const uid = req.uid;

        if( !event ){
            return res.status(404).json({
                ok:false,
                msg:'Event whit id doesnt exist'
            })
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok:false,
                msg:'Dont have privilege for delete this event'
            })
        }


        await Evento.findByIdAndRemove( eventId );

        res.json({ok:true});

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Please talk whit the manager'
        });
    }



}

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}