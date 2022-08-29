const Automaton = require('../src/Automaton')

describe('basic test', function () {
    it ('should pass', function () {
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
        expect(a.stage.id).toBe()
    })
})