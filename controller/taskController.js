import { v4 as uuid } from 'uuid'
import validate from '../utils/validate.js'
let posts = []

async function createPost(req, res) {
	try {
		const errors = validate.createTask(req)

		if (errors.haveErrors) {
			res.status(422).json({
				errors: errors.fields,
				message: 'Validation error',
			})
			return
		}
		const { title, description, taskDate } = req.body

		const allowToCreate = checkTaskDate(taskDate)

		if (!allowToCreate) {
			res.status(422).json({
				message: 'You can create a task for same day max 3 times.',
			})
			return
		}

		const newData = {
			id: uuid(),
			title,
			description,
			taskDate,
			completed: false,
		}

		posts.push(newData)

		res
			.status(200)
			.json({ message: 'createPost successful', data: posts, status: 200 })
	} catch (e) {
		res.status(404).json({ message: e.message, status: 404 })
	}
}

function checkTaskDate(taskDate) {
	let count = 0

	posts.forEach(task => {
		if (task.taskDate === taskDate) {
			count++
		}
	})

	return count < 3
}

function getTasks(req, res) {
	try {
		const errors = validate.getTasks(req)

		if (errors.haveErrors) {
			res.status(422).json({
				errors: errors.fields,
				message: 'Validation error',
			})
			return
		}

		const { page = 1 } = req.query

		let list = [...posts]

		list.sort((a, b) => {
			return new Date(a.taskDate).getTime() - new Date(b.taskDate).getTime()
		})

		const limit = 5
		const maxPageCount = Math.ceil(list.length / limit)

		if (+page > maxPageCount) {
			res.status(422).json({
				message: 'Invalid page number',
			})
			return
		}

		const offset = (page - 1) * limit
		list = list.slice(offset, offset + limit)

		res.status(200).json({
			message: 'tasks list',
			list,
		})
	} catch (e) {
		res.status(500).json({
			message: e.message,
			status: 404,
		})
	}
}

export default { createPost, getTasks }
