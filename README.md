# vue-lever

# What's Lever?

![lever](lever.gif)

`Lever` is a very important block in minecraft. It only has two state, one is `true`(emit energy), the other is `false`.
I love lever, it's simple, but powerful.

# What it can do

In vue, how to manage `true`/`false` variable is a troublesome thing.

here is a example.
Sometimes, you need to maintain a loading state.
Set `true` for it when function called and set `false` for it when async action done or wrong.
The code looks like:

```javascript
new Vue({
    data() {
        return { loading: false }
    }
    methods: {
        asyncAction() {
            this.loading = true
            this.$http.doing() // return a promise
                .then(() => this.loading = false)
                .catch(() => this.loading = false))
        }
    }
})
```

You have to change state manually.
I think it so troublesome.
So I write `vue-lever` to manage this state.

# Usage

## Install

```
# npm < 5
npm install vue-lever -S
# npm > 5
npm install vue-lever
# or
yarn add vue-lever
```

## Prepare

```
// use as a plugin
import Lever from 'vue-lever'
import Vue from 'vue'

Vue.use(Lever)
```

## How to use

### Decorator

It's very simple, use it as `Decorator`, for example

```
import Lever from 'vue-lever'
// import others

new Vue({
    methods: {
        @Lever.Lever('loading')
        asyncAction() {
            return this.$http.doing() // return a promise
        }
    }
})
```

all variable would store in `this.levers`

such as `this.levers.loading`, you can use `levers.loading` in template to replace `loading`

> Remember: function must return a promise, if function don't return promise, the `loading` would been set `true` and immediate been set `false` again.

> If you want to use Decorator, please make sure you enabled babel transform of decorator.

### Manually

If you don't like `Decorator` or you want to more flexible control.
You can use `this.$lever` function to control variable manually

```javascript
// new Vue... {
    asyncAction() {
        this.$lever('loading', true) // or this.$lever.t('loading')
        // do something
        this.$lever('loading', false) // or this.$lever.f('loading')
    }
// }
```

And there have `this.$lever.t` and `this.$lever.f` as a alias for `this.$lever`

## Global Option

No Global option

## Instance Option

You can pass `levers` which type is Object to vue constructor for init variable

```javascript
const vm = new Vue({
    levers: {
        loading: true,
        used: false,
    }
})
// assert.true(vm.levers.loading)
// assert.false(vm.levers.used)
```

And `levers` also can be a array with string, all default `false`

# Thank you

If you have any question or suggestion, please new issues.
