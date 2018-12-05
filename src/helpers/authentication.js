import jwt from 'jwt-simple';
import moment from 'moment';

const encodeToken = (user) => {
  let payload = {
    expiration: moment().add(10,'minutes').unix(),
    iat:moment().unix(),
    sub: user 
  }
  let token = jwt.encode(payload,"secret");
  return token;
};

const decodeToken = (token) =>{
  let decoded = jwt.decode(token,"secret"); 
  return decoded; 
}
// Access token required for a user
const accessTokenRequired = (req, res, next) => {
  let { token } = req.headers;
  if ( token === undefined || token === null ){
    res.status(400).send({ message: 'Not authorized to this page' });
  }else{ 
    let now = moment().unix();
    let  decodedToken = decodeToken(token);
  if ( now > decodedToken.expiration){
    res.status(400).send({ message: "Token expired" }); 
  } else {    
    req.body.userId = decodedToken.sub.userId;
    req.body.userType = decodedToken.sub.userType;
    next();
  }
}
};

const adminTokenRequired = (req, res, next) => {
  let { token } = req.headers;
  if ( token === undefined || token === null ){
    res.status(400).send({ message: 'Not authorized to this page' });
  }else{ 
    let now = moment().unix();
    let  decodedToken = decodeToken(token);
  if ( now > decodedToken.expiration){
    res.status(400).send({ message: "Token expired" }); 
  } else {    
    req.body.userId = decodedToken.sub.userId;
    req.body.userType = decodedToken.sub.userType;
    if ( req.body.userType === 'Admin') {    
      next();
    } else {
      res.status(403).send({ message: 'Not authorized to this page' });
    }
  }
}
 
};
export default { accessTokenRequired, encodeToken, adminTokenRequired };
