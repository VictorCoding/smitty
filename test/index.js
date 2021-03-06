/* eslint-env mocha */
import expect from 'expect'
import mitt from 'mitt'
import { createStore } from '../src/index'

describe('smitty', () => {
  it('store is created', () => {
    expect(createStore({})).toExist()
  })

  it('store has a state', () => {
    expect(createStore({ foo: 5 }).state).toEqual({ foo: 5 })
  })

  it('exposes the mitt api', () => {
    expect(createStore()).toIncludeKeys(Object.keys(mitt()))
  })

  it('reducer is called with prev state and event data', (done) => {
    const store = createStore({ foo: 5 })
    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        return state
      }
    })

    store.emit('foo/ADD', { foo: 'bar' })
    done()
  })

  it('reducers are called in order with updated state', (done) => {
    const store = createStore({ foo: 5 })
    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        return { foo: state.foo + 1 }
      }
    })

    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(6)
        expect(e).toEqual({ foo: 'bar' })
        return { foo: state.foo + 2 }
      }
    })

    store.emit('foo/ADD', { foo: 'bar' })
    expect(store.state.foo).toBe(8)
    done()
  })
})
