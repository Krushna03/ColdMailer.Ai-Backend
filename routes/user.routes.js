import express from "express"
import { currentUser, login, logoutUser, register } from "../controller/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { verifyGoogleToken } from "../controller/google.auth.controller.js"

const router = express()

router.route("/api/v1/user/register").post(register)

router.route("/api/v1/user/login").post(login)

router.route('/api/v1/user/getCurrentUser').get(verifyJWT, currentUser)

router.route('/api/v1/user/logout').post(verifyJWT, logoutUser)

router.route('/api/v1/user/google/callback').get(verifyGoogleToken);


export default router;