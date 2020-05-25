import React from 'react'
import styled from '@emotion/styled'
import { useModule } from '@sigi/react'
import { DemoModule } from './module'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export function Home() {
  const [state, actions] = useModule(DemoModule, {
    selector: (state) => ({ md5: state.sigiMd5, count: state.count }),
  })

  return (
    <Container>
      <h1>Sigi SSR example</h1>
      <h2>{state.md5}</h2>
      <p>Count: {state.count}</p>
      <button onClick={actions.addOne}>+1</button>
    </Container>
  )
}
