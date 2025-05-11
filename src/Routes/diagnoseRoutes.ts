import { Router } from 'express'
import { protect } from '../Middlewares/Auth/protect'
import { symptomEntry } from '../Controllers/SymptomEntryController'


const router=Router()

router.post('/symptoms',protect,symptomEntry)

export default router