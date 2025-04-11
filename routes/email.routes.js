import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { generateEmail, updateEmail } from "../controller/email.controller.js";

const router = express()

router.route('/api/v1/email/generate-email').post(verifyJWT, generateEmail)

router.route('/api/v1/email/update-email').post(verifyJWT, updateEmail)

export default router;