const Automaton = require('../src/v2/Automaton')

describe('defineState', function () {
    it('should define automaton state with no error when submitting { loop: ["a1"] }', function () {
        const a = new Automaton()
        a.defineState('s1', { loop: ['a1']})
    })
})

describe('process', function () {
    it('should enter first state when not defining init state', function () {
        const a = new Automaton()
        a.defineState('s1', { loop: ['a10'], jump: [ { test: 'equal 1 1', state: 's2' } ] })
        a.defineState('s2', { init: ['i2'], loop: ['a20', 'a30'], jump: [ { test: 'equal 0 1', state: 's3' } ] })
        a.defineState('s3', { loop: [] })
        const aLog = []
        a.events.on('action', ({ state, action }) => {
            aLog.push('action ' + state + ' ' + action)
        })
        a.events.on('test', ({ state, test, parameters, pass }) => {
            if (test === 'equal') {
                aLog.push('test ' + test + ' true')
                pass(parameters[0] === parameters[1])
            } else {
                aLog.push('test ' + test + ' false')
            }
        })
        a.process()
        a.process()
        expect(aLog).toEqual([
            'action s1 a10',
            'test equal true',
            'action s2 i2',
            'action s2 a20',
            'action s2 a30',
            'test equal true'
        ])
    })
})

describe('subroutine', function () {
    it('should enter subroutine and exit when flag is increasing', function () {
        const a = new Automaton()
        a.defineState('s1', { init: ['i1'], loop: ['a1'], call: [ { test: 'flagEqu 1', state: 's2' }] })
        a.defineState('s2', { init: ['i2'], loop: ['a2'], back: [ { test: 'flagEqu 2' } ] })
        const aLog = []
        a.events.on('action', ({ state, action }) => {
            aLog.push('action ' + state + ' ' + action)
        })
        let flag = 0
        a.events.on('test', ({ state, test, parameters, pass }) => {
            const nFlagTest = parseInt(parameters)
            if (test === 'flagEqu') {
                pass(nFlagTest === flag)
                aLog.push('test ' + test + ' ' + nFlagTest + ' vs ' + flag + String(nFlagTest === flag))
            } else {
                aLog.push('test ' + test)
            }
        })
        a.process()
        a.process()
        a.process()
        flag = 1
        a.process()
        a.process()
        a.process()
        flag = 2
        a.process()
        a.process()
        a.process()
        expect(aLog).toEqual([
                'action s1 i1',
                'action s1 a1',
                'test flagEqu 1 vs 0false',
                'action s1 a1',
                'test flagEqu 1 vs 0false',
                'action s1 a1',
                'test flagEqu 1 vs 0false',
                'action s1 a1',
                'test flagEqu 1 vs 1true',
                'action s2 i2',
                'action s2 a2',
                'test flagEqu 2 vs 1false',
                'action s2 a2',
                'test flagEqu 2 vs 1false',
                'action s2 a2',
                'test flagEqu 2 vs 2true'
            ]
        )
    })
})

describe('defineStates', function () {
    it ('should not do anything when defineng empty states', function () {
        const a = new Automaton()
        a.defineStates({
            s0: {}
        })
        a.process()
        expect(a.state).toBe('s0')
    })
});
