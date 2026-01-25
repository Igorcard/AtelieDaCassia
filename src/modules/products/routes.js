import { Router } from 'express'

const productsRouter = Router()

productsRouter.get('/products', (req, res) => {
  res.json({ message: 'Hello World' })
})

export default productsRouter
