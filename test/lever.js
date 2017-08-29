import test from 'ava'
import Vue from 'vue'
import Lever from '../src/lever'

Vue.use(Lever)

test('add levers data', t => {
  const vm = new Vue()
  t.deepEqual(vm.levers, {})
  t.pass()
})

test('init levers data with array', t => {
  const levers = ['a', 'b']
  const vm = new Vue({
    levers,
  })
  t.false(vm.levers.a)
  t.false(vm.levers.b)
})

test('init levers data with object', t => {
  const levers = {
    a: true,
    b: false,
    c: undefined,
    d: null,
    e: 0,
    f: 1,
    g: '',
    h: {},
  }
  const vm = new Vue({
    levers,
  })
  t.deepEqual(vm.levers, {
    a: true,
    b: false,
    c: false,
    d: false,
    e: false,
    f: true,
    g: false,
    h: true,
  })
})

test('$lever set value', t => {
  const vm = new Vue()
  t.deepEqual(vm.levers, {})
  vm.$lever('a', false)
  t.false(vm.levers.a)
  vm.$lever('a', true)
  t.true(vm.levers.a)
})

test('decorator', t => {
  const vm = new Vue({
    methods: {
      @Lever.Lever('action')
      asyncAction() {
        t.true(vm.levers.action)
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 100)
        })
      },
    },
  })
  return vm.asyncAction().then(() => {
    t.false(vm.levers.action)
  })
})

test('decorator keep this', t => {
  const vm = new Vue({
    methods: {
      @Lever.Lever('action')
      asyncAction() {
        t.is(this, vm)
      },
    },
  })
  return vm.asyncAction()
})

test('decorator transfer resolve/reject data', t => {
  const vm = new Vue({
    methods: {
      @Lever.Lever('action')
      asyncAction(error) {
        return new Promise((resolve, reject) => {
          setTimeout(error ? reject : resolve, 100, 'value')
        })
      },
    },
  })
  return vm
    .asyncAction()
    .then(value => {
      t.is(value, 'value')
      return vm.asyncAction(true)
    })
    .catch(value => {
      t.is(value, 'value')
    })
})

test('decorator if promise has error, set value to false', t => {
  const vm = new Vue({
    methods: {
      @Lever.Lever('action')
      asyncActionWithError() {
        t.true(vm.levers.action)
        return new Promise((resolve, reject) => {
          setTimeout(reject, 100)
        })
      },
    },
  })
  return vm.asyncActionWithError().catch(() => {
    t.false(vm.levers.action)
  })
})
