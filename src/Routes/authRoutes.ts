import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../Controllers/AuthController'

const router=Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)

export default router