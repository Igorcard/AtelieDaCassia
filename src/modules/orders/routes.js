import { Router } from 'express'

const ordersRouter = Router()

ordersRouter.get('/orders', (req, res) => {
  res.json({ message: 'Hello World' })
})

export default ordersRouter
