import 'reflect-metadata'

import { resolve } from 'path'
import fs from 'fs'
import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import webpack from 'webpack'
import { Request, Response } from 'express'
import { emitSSREffects } from '@sigi/ssr'
import { SSRContext } from '@sigi/react'

import { Home } from '@c/home'
import { DemoModule } from '@c/module'

export async function renderer(req: Request, res: Response) {
  const state = await emitSSREffects(req, [DemoModule])

  const stats: webpack.Stats.ToJsonOutput = JSON.parse(
    fs.readFileSync(resolve(__dirname, '../client/output-stats.json'), { encoding: 'utf8' }),
  )
  const scripts = (stats.assets || []).map((asset) => <script key={asset.name} src={`/${asset.name}`} />)

  const html = renderToNodeStream(
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta lang="zh-cms-hans" />
        <title>Sigi ssr example</title>
      </head>
      <body>
        <div id="app">
          <SSRContext.Provider value={req}>
            <Home />
          </SSRContext.Provider>
        </div>
        {state.renderToJSX()}
        {scripts}
      </body>
    </html>,
  )

  res.status(200)
  html.pipe(res)
}
