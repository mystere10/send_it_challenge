import joi from 'joi';
import { join } from 'path';

const userSchema = joi.object().keys({
    name: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email:joi.string().email({ minDomainAtomas: 2 }).required(),
    userType: joi.string()
});


const parcelSchema = joi.object().keys({
    name: joi.string().alphanum().min(3).max(30).required(),
    origin: joi.string().alphanum().min(3).max(30).required(),
    destination:joi.string().alphanum().min(3).max(30).required(),
    weight : joi.number().integer().required(),
    userId:joi.string()
});


export default { userSchema, parcelSchema }; 