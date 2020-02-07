import React from 'react'
import styled from '@emotion/styled'
import { useEffectModule } from '@sigi/react'
import { DemoModule } from './module'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export function Home() {
  const [state, actions] = useEffectModule(DemoModule)

  return (
    <Container>
      <h1>Sigi SSR example</h1>
      <p>Count: {state.count}</p>
      <button onClick={actions.addOne}>+1</button>
    </Container>
  )
}
