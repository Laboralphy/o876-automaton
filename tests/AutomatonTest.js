const Automaton = require('../src/sync/Automaton')
const AsyncAutomaton = require('../src/async/Automaton')

describe('basic test', function () {
    it ('initialisation du premier stage', function () {
        const a = new Automaton()
        a.stages = {
            s1: [
                {
                    test: () => true,
                    stage: 's2'
                }
            ],
            s2: []
        }
        expect(a.stage.id).toBe('s1')
    })
    it ('changement manuel du stage', function () {
        const a = new Automaton()
        a.stages = {
            s1: [
                {
                    test: () => true,
                    stage: 's2'
                }
            ],
            s2: []
        }
        a.stage = a.stages.s2
        expect(a.stage.id).toBe('s2')
    })
    it ('#testing transition 0', function () {
        const a = new Automaton()
        a.stages = {
            s1: [
                {
                    test: () => true,
                    stage: 's2'
                }
            ],
            s2: []
        }
        const t = a.stage.getTransitions()
        expect(t[0].value).toBeTrue()
    })
    it ('#proceeed', function () {
        const a = new Automaton()
        a.stages = {
            s1: [
                {
                    test: () => true,
                    stage: 's2'
                }
            ],
            s2: []
        }
        a.proceed()
        expect(a.stage.id).toBe('s2')
    })
})

describe('Async.proceed', function () {
    it ('#proceeed', async function () {
        const a = new AsyncAutomaton()
        a.stages = {
            s1: [
                {
                    test: () => new Promise(resolve => {
                        setTimeout(() => resolve(true), 15)
                    }),
                    stage: 's2'
                }
            ],
            s2: []
        }
        await a.proceed()
        expect(a.stage.id).toBe('s2')
    })
})