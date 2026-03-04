import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import { exportRoutes } from '../../utils/routes-exports.js'
import { errorMiddleware } from '../../middlewares/error-middleware.js'

const app = express()

app.use(cors())
app.use(logger('dev'))

app.use(express.json({
  limit: '20mb',
}))

app.use(express.urlencoded({
  limit: '20mb',
  parameterLimit: 100000,
  extended: true,
}))

await exportRoutes(app)

app.use(errorMiddleware)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

export { app }
