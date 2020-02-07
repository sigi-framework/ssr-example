import express from 'express'
import { resolve } from 'path'

import { renderer } from './renderer'

const app = express()
app.use(express.static(resolve(__dirname, '../client')))
app.get('/', renderer)

app.listen(8000, () => {
  console.info('SSR server is running on port localhost[:8000]')
})
