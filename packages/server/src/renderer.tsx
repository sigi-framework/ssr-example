import 'reflect-metadata'

import { resolve } from 'path'
import fs from 'fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import webpack from 'webpack'
import { Request, Response } from 'express'
import { emitSSREffects } from '@sigi/ssr'
import { GLOBAL_KEY } from '@sigi/core'
import { SSRContext } from '@sigi/react'

import { Home } from '@c/home'
import { DemoModule } from '@c/module'

export async function renderer(req: Request, res: Response) {
  const state = await emitSSREffects(req, [DemoModule])

  const html = renderToString(
    <SSRContext.Provider value={req}>
      <Home />
    </SSRContext.Provider>,
  )

  const stats: webpack.Stats.ToJsonOutput = JSON.parse(
    fs.readFileSync(resolve(__dirname, '../client/output-stats.json'), { encoding: 'utf8' }),
  )
  const scripts = (stats.assets || []).map((asset) => `<script src=/${asset.name}></script>`)

  res.status(200)
  res.end(`
      <!doctype html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta lang="zh-cms-hans">
        <title>Sigi ssr example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>window[Symbol.for('${Symbol.keyFor(GLOBAL_KEY)}')]=${JSON.stringify(state)}</script>
        ${scripts}
      </body>
      </html>
    `)
}
