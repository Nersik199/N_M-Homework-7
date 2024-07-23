import { Router } from 'express'

import controller from '../controller/taskController.js'
const router = Router()

router.post('/createPost', controller.createPost)

export default router
