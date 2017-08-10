function Lever(name, value) {
  this.$set(this.levers, name, !!value)
}

function EnableLever(name) {
  this.$lever(name, true)
}

function DisableLever(name) {
  this.$lever(name, false)
}

function LeverPromiseDecorator(target, key, desc, name) {
  const func = desc.value
  desc.value = function(...args) {
    this.$lever.t(name)
    let promise = func(...args)
    if (promise.then) {
      promise = promise
        .then(value => {
          this.$lever.f(name)
          return value
        })
        .catch(err => {
          this.$lever.f(name)
          throw err
        })
    } else {
      this.$lever.f(name)
    }
    return promise
  }
  return desc
}

const LeverPromise = name => (target, key, desc) => LeverPromiseDecorator(target, key, desc, name)

export default {
  install(Vue, options) {
    Vue.mixin({
      data() {
        return {
          levers: {},
        }
      },
      created() {
        this.$lever = Lever.bind(this)
        this.$lever.enable = this.$lever.t = EnableLever.bind(this)
        this.$lever.disable = this.$lever.f = DisableLever.bind(this)

        const levers = this.$options.levers
        if (levers) {
          if (levers.splice) {
            for (const name of levers) {
              this.$lever(name, false)
            }
          } else {
            for (const [name, value] of Object.entries(levers)) {
              this.$lever(name, value)
            }
          }
        }
      },
    })
  },
  Lever: LeverPromise,
}
