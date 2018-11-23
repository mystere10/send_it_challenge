import Parcel from '../models/parcel';
import queries from '../db/sqlQueries';
import execute from '../db/connection';
import 'babel-polyfill';

const controllers = {};
// declare the variable to store orders.
let orders = [];

// fetch a parcel
const fetchParcelById = (req, res) => {
  const parcelId = parseInt(req.params.id);
  const parcel = orders.find(order => order.id === parcelId);
  //const parcel = execute(queries.getSpecificParcel,[parcelId]);
  // send it.
  if (parcel) {
    res.status(200).send(parcel);
  } else {
    // send the error page
    res.status(400).send({ message: 'Ooops! no order with that id' });
  }
};

// create parcel
const createParcel = (req, res) => {
  const {
    name, origin, destination, weight, userId,
  } = req.body;
  const existingOrder = orders.find(order => order.name === name);
  if (existingOrder === undefined) {
    const id = orders.length + 1;
    const fieldsValidation = /[a-zA-Z]+/;
    if (!origin || !name || !destination || !userId || !weight) {
      res.send({ message: 'Please provide all the required fields' });
    } else if (!Number(weight)) {
      res.send({ message: 'Invalid weight, the weight should be number' });
    } else if (!fieldsValidation.test(name)) {
      res.send({ message: 'Invalid name, the name should start with a letter' });
    } else if (!fieldsValidation.test(origin)) {
      res.send({ message: 'Invalid origin, the origin should be a place' });
    } else if (!fieldsValidation.test(destination)) {
      res.send({ message: 'Invalid destination, the destination should be a place' });
    } else {
      const order = new Parcel(id, name, origin, destination, weight, userId);
      //execute(queries.insertIntoDatabase,[order.id,order.name,order.origin,order.destination,order.weight,order.userId,order.price]); 
      orders.push(order);
      res.status(200).send({ message: 'The order was successfully created', order });
    }
  } else {
    res.send({ message: 'Cannot create two orders with the same name' });
  }
};

// Fetch a delivery order by a user.
const deliveryOrdersByUser = (req, res) => {
  const userId = parseInt(req.params.id);
  // find the order where the owner is equal to the email
  const specificOrders = orders.filter(item => item.userId === userId);
  //const specificOrders = execute(queries.ordersForUser,[userId])
  if (specificOrders) {
    res.send(specificOrders);
  } else {
    // Redirect to error page
    res.send({ message: 'There is no order of the user you specified' });
  }
};

// fetch all delivery orders
const fetchAllDeliveryOrders = (req, res) => {
  //let orders = execute(`SELECT * FROM parcels`);
  res.send(orders);
};

// cancel a delivery order
const cancelDeliveryOrder = (req, res) => {
  const parcelId = parseInt(req.params.id);
  const parcel = orders.find(order => order.id === parcelId);
  //const parcel = execute(queries.statusUpdate,[parcelId,'Cancelled']);
  if (parcel) {
    orders.splice(orders.indexOf(parcel), 1);
    parcel.status = 'Cancelled';
    orders.push(parcel);
    res.status(200).send({ message: 'Order successfully cancelled', parcel });
  } else {
    res.status(400).send({ message: 'Invalid id' });
  }
};
// delete all delivery orders
const deleteOrders = (req, res) => {
  //execute(`DROP TABLE parcels`);
  orders = [];
  res.status(200).send({ message: 'Orders deleted successfully' });
};

// change the status of a parcel delivery order
const updateStatus = (req, res) => {
  const orderid = parseInt(req.params.id);
  const { status } = req.body;
  const parcel = orders.find(item => item.id === orderid);
  //const parcel = execute(queries.statusUpdate,[orderid,status]);
  if (parcel !== undefined) {
    orders.splice(orders.indexOf(parcel), 1);
    parcel.status = status;
    orders.push(parcel);
    res.status(200).send({ message: 'The parcel was updated successfully', parcel });
  } else {
    res.status(200).send({ message: 'No order with that id' });
  }
};

// change the location of a destination delivery order
const changeDestination = (req, res) => {
  const { id } = parseInt(req.params.id);
  const { destination } = req.body;
  const parcel = orders.find(item => item.id === id);
  //const parcel = execute(queries.destinationUpdate,[id, destination])
  if (parcel !== undefined) {
    orders.splice(orders.indexOf(parcel), 1);
    parcel.destination = destination;
    orders.push(parcel);
    res.status(200).send({ message: 'The parcel was updated successfully', parcel });
  } else {
    res.status(200).send({ message: 'No order with that id' });
  }
};

// change the present location of a parcel delivery order
const changePresentLocation = (req, res) => {
  let { id } = parseInt(req.params.id);
  let { presentLocation } = req.body;
  let parcel = orders.find(item => item.id === id);
  //let parcel = execute(queries.presentLocationUpdate,[id,presentLocation])

  if (parcel) {
    orders.splice(orders.indexOf(parcel), 1);
    orders.push(parcel);
    res.status(200).send({ message: 'The parcel was updated successfully', parcel });
  } else {
    res.status(200).send({ message: 'No order with that id' });
  }
};

controllers.fetchParcelById = fetchParcelById;
controllers.fetchAllDeliveryOrders = fetchAllDeliveryOrders;
controllers.cancelDeliveryOrder = cancelDeliveryOrder;
controllers.createParcel = createParcel;
controllers.deliveryOrdersByUser = deliveryOrdersByUser;
controllers.deleteOrders = deleteOrders;
controllers.changeDestination = changeDestination;
controllers.changePresentLocation = changePresentLocation;
controllers.updateStatus = updateStatus;

export default controllers;