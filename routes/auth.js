//Rutas de usuario / Auth
//host + /api/auth
const { Router } = require("express");
const { check } = require("express-validator")
const router = Router();

const { fieldValidator } = require("../middlewares/field-validator");
const { createUser, loginUser, renewToken  } = require('../controllers/auth');
const { JWTvalidator } = require("../middlewares/jwt-validator");


router.post(
    '/new', 
    [//middlewares
        check('name', 'Name is require').not().isEmpty(),
        check('email', 'Email is require').isEmail(),
        check('password', 'Paswword must contain 6 characters').isLength({ min:6 }),
        fieldValidator
    ] , 
    createUser 
    );

router.post(
    '/',
    [
        check('email', 'Email is require').isEmail(),
        check('password', 'Password must contain 6 characters').isLength({ min:6 }),
        fieldValidator
    ], 
    loginUser );

router.get('/renew', JWTvalidator ,renewToken );

module.exports = router;