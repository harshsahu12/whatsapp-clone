import express from 'express'
import { getAllUser, login, register } from '../controllers/userControllers.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(register).get(protect, getAllUser)
router.post('/login', login)

export default router