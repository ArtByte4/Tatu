import express from "express";
import {
  getAllUsers,
  createUser,
  getOneUser,
  loginUser,
  logOutUser,
  refreshToken,
  verifyToken,
  getOneProfile,
  updatephotoPefil,
  emailValidate,
  userHandleValidate,
  phoneNumberValidate,
  verificarAdmin,
  deleteUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);
router.get("/users/:user_handle", verifyToken, getOneUser);
router.get("/users/profile/:user_handle", getOneProfile);


router.put("/users/profile/:user_handle/photo", updatephotoPefil);

router.post("/users", createUser);

// Validaciones
router.post("/users/register/verification/emailAddreess", emailValidate)
router.post("/users/register/verification/userHandle", userHandleValidate)
router.post("/users/register/verification/phonenumber", phoneNumberValidate)



router.post("/admin/dashboard", verificarAdmin, async (req, res ) => {
  res.json({ mensaje: 'Bienvenido al panel admin', valid: true });
} )


router.delete("/admin/dasboard/deleteUser/:user_id", verificarAdmin,  deleteUserById)


export default router;
