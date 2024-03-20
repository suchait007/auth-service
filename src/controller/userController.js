const users = require('../service/users');
const util = require('../util/ProductUtil');

class UserController {

    async handleSignup(req, res, next) {

        try {
            const {name, email, password, role } = req.body;
            const user = await users.find(email);

            if(user) {
                throw util.populateError(400, 'User already exists.', 
                ['User already exists in system.', 'Please try again with another email.']); 
            }

            const token = await users.create(name, email, password, role);

            res.json({ token });
        
        } catch (err) {
            next(err);
        }
    
    }

    async handleLogin(req, res, next) {


        try {

            const {email, password} = req.body;
            const user = await users.find(email);

            if(!user) {
                throw util.populateError(400, 'User not found.', 
                ['Credentials do not exist.', 'Please Signup or try with correct details.']);
            }

            const token = await users.authenticate(email, password);

            if(token === "invalid") {
                const errorObject = util.populateError(401, 'Pasword doesnt match.', 
            ['Invalid username and password', 'Credentials you have entered are not valid.']);

           throw errorObject;
        }

        res.json({token});

        } catch (err) {
            next(err);
        }

    }

    async handleValidate(req, res, next) {

        try {

            const { token } = req.body
            const user = await users.validate(token);

            if(user) {
                throw util.populateError(400, 'User already exists.', 
                ['User already exists in system.', 'Please try again with another email.']); 
            }

            return res.json({token_status: "valid"});

        } catch (err) {
            next(err);
        }

    }

}

module.exports = new UserController();