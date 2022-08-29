const EventEmitter = require('events')

class Transition {
    constructor (id) {
        this._id = id
        this._events = new EventEmitter()
        this._stage = null
    }

    get events () {
        return this._events
    }

    get id () {
        return this._id
    }

    get stage () {
        return this._stage
    }

    set stage (value) {
        this._stage = value
    }

    /**
     * Renvoie la vérité de la transition
     * @returns {boolean}
     */
    isTrue () {
        const oEvent = { id: this._id, result: false }
        this._events.emit('test', oEvent)
        return oEvent.result
    }
}

module.exports = Transition
