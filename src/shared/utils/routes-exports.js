import path from 'path'
import { listDirFiles } from './helpers/file-helper.js'
import { pathToFileURL } from 'url'

export async function exportRoutes(app) {
  const arrayOfFiles = []
  const basePath = './src/modules'

  listDirFiles(basePath, arrayOfFiles)

  const routesFiles = arrayOfFiles.filter(file =>
    file.endsWith('routes.js')
  )

  for (const file of routesFiles) {
    const fileUrl = pathToFileURL(path.resolve(file)).href
    const { default: router } = await import(fileUrl)
    app.use(router)
  }
}
