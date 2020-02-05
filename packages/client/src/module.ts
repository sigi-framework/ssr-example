import { Module, EffectModule, ImmerReducer, TERMINATE_ACTION } from '@sigi/core'
import { SSREffect } from '@sigi/ssr'
import { Observable, of } from 'rxjs'
import { exhaustMap, map, startWith, delay, endWith } from 'rxjs/operators'
import { Draft } from 'immer'

interface State {
  count: number
}

@Module('demoModule')
export class DemoModule extends EffectModule<State> {
  defaultState = {
    count: 0,
  }

  @ImmerReducer()
  setCount(state: Draft<State>, count: number) {
    state.count = count
  }

  @ImmerReducer()
  addOne(state: Draft<State>) {
    state.count++
  }

  @SSREffect()
  asyncEffect(payload$: Observable<void>) {
    return payload$.pipe(
      exhaustMap(() =>
        of({ count: 10 }).pipe(
          delay(1000),
          map(({ count }) => this.getActions().setCount(count)),
          startWith(this.getActions().setCount(0)),
          endWith(TERMINATE_ACTION),
        ),
      ),
    )
  }
}
