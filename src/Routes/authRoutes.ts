import { Router } from 'express'
import { registerUser } from '../Controllers/AuthController'

const router=Router()

router.post('/register',registerUser)

export default router