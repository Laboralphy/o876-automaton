const EventEmitter = require('events')
const Stage = require('./Stage')
const localID = require('./local-id')

class Automaton {
    constructor () {
        this._events = new EventEmitter()
        this._stages = {}
        /**
         * @type {Stage}
         * @private
         */
        this._stage = null
    }

    get stage () {
        return this._stage
    }

    set stage (value) {
        this._stage = value
    }

    set stages (value) {
        Object
            .keys(value)
            .forEach(s => {
                const oStage = new Stage(s)
                this._stages[s] = oStage
                if (this._stage === null) {
                    this._stage = oStage
                }
            })
        Object
            .entries(value)
            .forEach(([key, aTransitions]) => {
                const oStage = this._stages[key]
                aTransitions.forEach(({ test, stage }) => {
                    oStage.addTransition(this._stages[stage], test)
                })
            })
    }

    get stages () {
        return this._stages
    }

    /**
     * Trouve la première transition valide et passe au travers.
     * Ne fait rien si aucune transition n'est valide
     */
    passthru () {
        const oTransition = this._stages.getFirstTrueTransition()
        if (oTransition) {
            const oOldStage = this._stage
            const oNewStage = oTransition.stage
            this._stage = oTransition.stage
            this._events.emit('transition.passthru', { from: oOldStage, stage: oNewStage, transition: oTransition })
        }
    }
}

module.exports = Automaton
