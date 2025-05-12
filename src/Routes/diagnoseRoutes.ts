import { Router } from 'express'
import { protect } from '../Middlewares/Auth/protect'
import { symptomEntry } from '../Controllers/SymptomEntryController'
import { diagnose } from '../Controllers/DiagnosisController'


const router=Router()

router.post('/symptoms',protect,symptomEntry)
router.post('/symptoms/:symptomId',protect,diagnose)

export default router