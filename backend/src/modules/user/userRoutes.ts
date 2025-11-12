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
  searchUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  updateUserRoleHandler,
} from "./userController";
import { verificarAdmin } from "./middlewares/validateAdmin";
import { verifyToken } from "./middlewares/validateToken";

const router: Router = Router();

router.get("/users", verifyToken, getAllUsers);
router.get("/users/search", verifyToken, searchUsersHandler);
router.get("/users/:user_handle", verifyToken, getOneUser);
router.get("/users/profile/:user_handle", getOneProfile);


router.put("/users/profile/:user_handle/photo", updatephotoPefil);

router.post("/users", createUser);

// Validaciones
router.post("/users/register/verification/emailAddress", emailValidate)
router.post("/users/register/verification/userHandle", userHandleValidate)
router.post("/users/register/verification/phonenumber", phoneNumberValidate)



// Rutas de administración
router.post("/admin/dashboard", verificarAdmin, async (req, res) => {
  const user = (req as any).user;
  res.json({ 
    mensaje: 'Bienvenido al panel admin', 
    valid: true,
    user_id: user?.id,
    role: user?.role,
    username: user?.username
  });
});

// CRUD de usuarios para admin
router.get("/admin/users", verificarAdmin, getAllUsers);
router.get("/admin/users/:user_id", verificarAdmin, getUserByIdHandler);
router.post("/admin/users", verificarAdmin, createUser);
router.put("/admin/users/:user_id", verificarAdmin, updateUserHandler);
router.put("/admin/users/:user_id/role", verificarAdmin, updateUserRoleHandler);
router.delete("/admin/users/:user_id", verificarAdmin, deleteUserById);


export default router;
