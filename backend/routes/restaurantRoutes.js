const express = require("express");
const {
  register,
  login,
  refreshToken,
  searchRestaurants,
  updateProfile,
  deleteProfile,
  getProfileById,
} = require("../controllers/restaurantControllers");
const auth = require("../middleware/auth");
const fileUpload = require('express-fileupload');
const router = express.Router();


router.use(fileUpload());

router.post("/restaurant/register", register);
router.post("/restaurant/login", login);
router.post("/restaurant/refresh-token", refreshToken);
router.get("/restaurant/profile/:id", getProfileById);
router.put("/restaurant/profile/:id", auth, updateProfile);
router.delete("/restaurant/profile/:id", auth, deleteProfile);
router.get("/restaurant/search", searchRestaurants);

module.exports = router;
