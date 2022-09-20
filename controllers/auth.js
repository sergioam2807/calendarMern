const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario  = require('../models/Usuario') ;
const { JWTgenerator } = require('../helpers/jwt');


const createUser = async(req, res = response) =>{

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'User exist'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        //Generar jwt
        const token = await JWTgenerator( usuario.id, usuario.name );
    
        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {

        console.log(error)

        res.status(500).json({
            ok:false,
            msg:'Please talk whit the manager'
        })
    }
}

const loginUser = async(req, res = response) =>{

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'User dont exist whit that email'
            })
        }

        //confirmar constraseñas
        const validPassword = bcrypt.compareSync( password, usuario.password );
        
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrect'
            })
        }

        //Generar token
        const token = await JWTgenerator( usuario.id, usuario.name );

        res.json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {

        console.log(error)

        res.status(500).json({
            ok:false,
            msg:'Please talk whit the manager'
        })
    }

    res.status(201).json({
        ok:true,
        msg: 'Login',
        email,
        password
    })
}

const renewToken = async(req, res = response) =>{

    const { uid, name }= req;

    const token = await JWTgenerator( uid, name);

    res.json({
        ok:true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken

}