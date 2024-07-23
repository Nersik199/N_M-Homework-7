import express from 'express'
import routes from './router/index.js'
import env from 'dotenv'
env.config()

const app = express()

app.use(express.json())

app.use(routes)

app.listen(process.env.PORT, () => {
	console.log('Example app listening on port 3000!')
})
