
const { Router }= require('express');
const { check } = require('express-validator');
const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/field-validator');
const { JWTvalidator } = require('../middlewares/jwt-validator');

const router = Router();

router.use(JWTvalidator);


router.get('/', getEvent);

router.post('/',[
    check('title', 'Title is require').not().isEmpty(),
    check('start', 'Date start is require').custom( isDate ),
    check('end', 'Date end is require').custom( isDate ),
    fieldValidator
]
, createEvent);

router.put('/:id',[
    check('title', 'Title is require').not().isEmpty(),
    check('start', 'Date start is require').custom( isDate ),
    check('end', 'Date end is require').custom( isDate ),
    check('id','Id is not valid').isMongoId(),

] 
,updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;