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

function getPostsId(req, res) {
	try {
		let result = posts.find(item => {
			return item.id === req.params.id
		})
		if (result) {
			res
				.status(200)
				.json({ message: 'getPost successful', status: 200, data: result })
		} else {
			res.status(500).send({ message: 'post not found', status: 500 })
		}
	} catch (e) {
		res.status(200).json({ message: e.message, status: 404 })
	}
}

function updatePost(req, res) {
	try {
		const { title, description, taskDate } = req.body
		let data = posts.findIndex(post => post.id === req.params.id)

		const errors = validate.createTask(req)

		if (errors.haveErrors) {
			res.status(422).json({
				errors: errors.fields,
				message: 'Validation error',
			})
			return
		}

		if (data !== -1) {
			posts[data].title = title
			posts[data].description = description
			posts[data].taskDate = taskDate
			posts[data].completed = true
			res.status(200).json({
				message: 'Post updated successfully',
				post: req.params.id,
			})
		} else {
			res
				.status(500)
				.json({ message: `Post with id ${req.params.id} not found`, data: [] })
		}
	} catch (e) {
		res.status(404).json({ message: e.message, status: 404 })
	}
}

function deletePost(req, res) {
	try {
		let index = posts.findIndex(post => post.id === req.params.id)
		if (index !== -1) {
			posts.splice(index, 1)
			res.statusCode = 200
			res.json({ message: 'User deleted successfully', delId: req.params.id })
		} else {
			res
				.status(500)
				.send({ message: `Post with id ${req.params.id} not found`, posts: [] })
		}
	} catch (e) {
		res.status(404).json({ message: e.message, status: 404 })
	}
}

export default { createPost, getTasks, getPostsId, updatePost, deletePost }
