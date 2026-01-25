import 'dotenv/config'
import { app } from './shared/infra/http/app.js'
import { server } from './shared/infra/http/server.js'

const PORT = process.env.PORT || 3333

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

export { app }
