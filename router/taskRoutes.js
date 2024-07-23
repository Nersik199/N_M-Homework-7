import { Router } from 'express'

import controller from '../controller/taskController.js'
const router = Router()

router.post('/createPost', controller.createPost)
router.get('/', controller.getTasks)
router.get('/single/:id', controller.getPostsId)

export default router
