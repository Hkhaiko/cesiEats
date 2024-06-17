const express = require("express");
const {
  register,
  login,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  getProfileById,
} = require("../controllers/restaurantControllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/restaurant/register", register);
router.post("/restaurant/login", login);
router.get("/restaurant/profile", getAllProfiles);
router.get("/restaurant/:id", getProfileById);
router.put("/restaurant/profile", updateProfile);
router.delete("/restaurant/profile", deleteProfile);

module.exports = router;
