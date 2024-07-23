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

export default { createPost }
