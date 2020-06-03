import { Module, Effect, EffectModule, ImmerReducer } from '@sigi/core'
import { Observable, of } from 'rxjs'
import { exhaustMap, map, startWith, delay, endWith, mergeMap } from 'rxjs/operators'
import { Draft } from 'immer'
import md5 from 'md5'

interface State {
  count: number
  sigiMd5: string | null
}

@Module('demoModule')
export class DemoModule extends EffectModule<State> {
  defaultState = {
    count: 0,
    sigiMd5: null,
  }

  @ImmerReducer()
  setCount(state: Draft<State>, count: number) {
    state.count = count
  }

  @ImmerReducer()
  addOne(state: Draft<State>) {
    state.count++
  }

  @ImmerReducer()
  setSigiMd5(state: Draft<State>, hashed: string) {
    state.sigiMd5 = hashed
  }

  @Effect({
    payloadGetter: () => {
      return md5('sigi')
    },
  })
  getSigiMd5(payload$: Observable<string>) {
    return payload$.pipe(
      delay(100), // mock async
      mergeMap((hashed) => of(this.getActions().setSigiMd5(hashed), this.terminate())),
    )
  }

  @Effect({
    ssr: true,
  })
  asyncEffect(payload$: Observable<void>) {
    return payload$.pipe(
      exhaustMap(() =>
        of({ count: 10 }).pipe(
          delay(1000),
          map(({ count }) => this.getActions().setCount(count)),
          startWith(this.getActions().setCount(0)),
          endWith(this.terminate()),
        ),
      ),
    )
  }
}
