const Events = require('events')
class StateContext {
    constructor(oDefinition = {}) {
        const { back = [], call = [], data = {}, init = [], loop = [], done = [], jump = [] } = oDefinition
        this._data = typeof data === 'function' ? data(this) : { ...data }
        this._init = Array.isArray(init) ? init : [init]
        this._loop = Array.isArray(loop) ? loop : [loop]
        this._done = Array.isArray(done) ? done : [done]
        this._call = Array.isArray(call) ? call : [call]
        this._back = Array.isArray(back) ? back : [back]
        this._jump = Array.isArray(jump) ? jump : [jump]
        this._events = new Events
    }

    get events () {
        return this._events
    }

    runSmth (s) {
        this['_' + s].forEach(s => {
            this.invokeAction(s)
        })
    }

    runInit () {
        this.runSmth('init')
    }

    runLoop () {
        this.runSmth('loop')
    }

    runDone () {
        this.runSmth('done')
    }

    runJump () {
        for (const sJump of this._jump) {
            const aJump = sJump.split(' ')
            const sState = aJump.pop()
            const sCond = aJump.join(' ')
            if (this.invokeTest(sCond)) {
                this._events.emit('state', { state: sState, transitionType: 'jump' })
                break
            }
        }
    }

    runCall () {
        for (const sCall of this._call) {
            const aCall = sCall.split(' ')
            const sState = aCall.pop()
            const sCond = aCall.join(' ')
            if (this.invokeTest(sCond)) {
                this._events.emit('state', { state: sState, transitionType: 'call' })
                break
            }
        }
    }

    runBack () {
        for (const sBack of this._back) {
            if (this.invokeTest(sBack)) {
                this._events.emit('back', {})
                break
            }
        }
    }

    parseArguments (aArgs) {
        return aArgs.split(' ').filter(s => s !== '').map(s => isNaN(s) ? s : parseFloat(s))
    }

    invokeAction (action) {
        const aAction = this.parseArguments(action)
        const sAction = aAction.shift()
        this._events.emit('action', { action: sAction, arguments: aAction, data: this._data })
    }

    invokeTest (test) {
        const aTest = this.parseArguments(test)
        const sTest = aTest.shift()
        const eventObject = { test: sTest, arguments: aTest, data: this._data, _result: false, pass(v = true) { this._result = Boolean(v) } }
        this._events.emit('test', eventObject)
        return eventObject._result
    }
}

module.exports = StateContext