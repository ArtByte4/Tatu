import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getOneUser,
  getOneProfile,
  updatephotoPefil,
  emailValidate,
  userHandleValidate,
  phoneNumberValidate,
  deleteUserById,
  searchUsers,
} from "./userController";
import { verificarAdmin } from "./middlewares/validateAdmin";
import { verifyToken } from "./middlewares/validateToken";

const router: Router = Router();

router.get("/users/search", verifyToken, searchUsers);
router.get("/users/profile/:user_handle", getOneProfile);
router.get("/users/:user_handle", verifyToken, getOneUser);
router.get("/users", verifyToken, getAllUsers);


router.put("/users/profile/:user_handle/photo", updatephotoPefil);

router.post("/users", createUser);

// Validaciones
router.post("/users/register/verification/emailAddress", emailValidate)
router.post("/users/register/verification/userHandle", userHandleValidate)
router.post("/users/register/verification/phonenumber", phoneNumberValidate)



router.post("/admin/dashboard", verificarAdmin, async (_req, res) => {
  res.json({ mensaje: 'Bienvenido al panel admin', valid: true });
})


router.delete("/admin/dasboard/deleteUser/:user_id", verificarAdmin, deleteUserById)


export default router;
