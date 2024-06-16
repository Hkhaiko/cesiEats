const DeliveryPerson = require("../models/deliveryPerson");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const authServiceUrl = process.env.AUTH_SERVICE_URL;

exports.createDelivery = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { name, email, password, phone, status } = req.body;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const response = await axios.post(
      `${authServiceUrl}/delivery/register`,
      { name, email, password, phone, status },
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDeliveryPersons = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    console.log(authServiceUrl);
    const response = await axios.get(
      `${authServiceUrl}/delivery/delivery-persons`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDeliveryPersonById = async (req, res) => {
  try {
    const token = req.cookies.token;
    const id = req.params.id;
    console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const response = await axios.get(
      `${authServiceUrl}/delivery/delivery-persons/${id}`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateDeliveryPersonStatus = async (req, res) => {
  try {
    const token = req.cookies.token;
    const deliveryPersonId = req.params.id;
    const { status } = req.body;
    console.log(status);

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    console.log(
      `${authServiceUrl}/delivery/delivery-persons/${deliveryPersonId}`
    );
    // Vérifier le livreur via le microservice Auth
    const deliveryPersonResponse = await axios.patch(
      `${authServiceUrl}/delivery/delivery-persons/${deliveryPersonId}`,
      { status: status },
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    res.status(200).json(deliveryPersonResponse.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDeliveryPerson = async (req, res) => {
  try {
    const token = req.cookies.token;
    const deliveryPersonId = req.params.id;

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    console.log(
      `${authServiceUrl}/delivery/delivery-persons/${deliveryPersonId}`
    );
    const deliveryPersonResponse = await axios.delete(
      `${authServiceUrl}/delivery/delivery-persons/${deliveryPersonId}`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    res.status(200).json(deliveryPersonResponse.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateDeliveryPerson = async (req, res) => {
  try {
    const token = req.cookies.token;
    const id = req.params.id;
    const { name, email, password, phone, status } = req.body;

    console.log(`${authServiceUrl}/delivery/delivery-persons/${id}`);

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const response = await axios.put(
      `${authServiceUrl}/delivery/delivery-persons/${id}`,
      { name, email, password, phone, status },
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
