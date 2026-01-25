import { Router } from 'express'

const paymentsRouter = Router()

paymentsRouter.get('/payments', (req, res) => {
  res.json({ message: 'Hello World' })
})

export default paymentsRouter
