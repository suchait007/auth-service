require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../db/knexfile'));
const util = require('../util/ProductUtil');


const { JWT_SECRET } = process.env; 
const jwtSec = "5a00f294309ffa3ceabb45ac78fd7829089b32fa8847589e64a07fd69357ba1e";

class Users {

    constructor() {
    }

    async create(name, email, password, role) {

        try {
            const user = await knex('users')
            .insert({
                name: name,
                email: email,
                password: await bcrypt.hash(password, 0),
                role: role,
                created_at: await this.getCurrentTimestamp()
            }).returning('*');

            const token = jwt.sign({id: user.user_id, email: user.email, role: user.role}, jwtSec, {
                expiresIn: 24 * 60 * 60,
            });

            return token;

    } catch (error) {
        throw error;
    }

}

async find(email) {

    try {
        const user = await knex.select('*')
        .from('users')
        .where('email', email)
        .first();
    
        return user;
    } catch( error) {
        console.error('Error while fetching user.');
        throw error;
    }
}

async findById(userId) {

    try {
        const user = await knex.select('*')
        .from('users')
        .where('user_id', userId.id)
        .first();
    
        return user;
    } catch( error) {
        console.error('Error while fetching user.');
        throw error;
    }
}

async authenticate(email, password) {

    try {
        const user = await this.find(email);
        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return "invalid"; 
        }

        const token = jwt.sign({id: user.user_id, email: user.email, role: user.role}, jwtSec, {
            expiresIn: 24 * 60 * 60,
        });

        return token;
    } catch (err) {
        throw err;
    }

}

async findByIdAndEmail(id, email) {

    try {
        const user = await knex.select('*')
        .from('users')
        .where('user_id', id)
        .andWhere('email', email)
        .first();
    
        return user;
    } catch( error) {
        console.error('Error while fetching user.');
        throw error;
    }

}

async validate(token) {

    jwt.verify(token, jwtSec, (err, decoded) => {

        if( err ) {
            throw util.populateError(401, 'Token not verified.', 
                ['Invalid Jwt token.', 'Please try generating again and validate.']);
        }
        
        console.log('Decoded JWT: ' + JSON.stringify(decoded));
        
        const userId = decoded.id;
        const email = decoded.email;

        const user = this.findByIdAndEmail(userId, email);

        return user;
    });

}


async getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

}

module.exports = new Users();