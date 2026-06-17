import * as assert from 'assert';
import { formatDrools } from '../formatter';

// DRL keywords get space before parens
const cases: [string, string][] = [
    ['not(Rejection())', 'not ( Rejection() )'],
    ['exists(Person())', 'exists ( Person() )'],
    ['forall(Bus(color == "red"))', 'forall ( Bus( color == "red" ) )'],
];

for (const [input, expectedLine] of cases) {
    const drl = ['rule "R"', 'when', `    ${input}`, 'then', 'end'].join('\n');
    const expected = ['rule "R"', 'when', `  ${expectedLine}`, 'then', 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected, `Failed for input: ${input}`);
}

// accumulate and collect get space before parens
const accum = [
    'rule "R"',
    'when',
    '    accumulate(Order($t : total); $s : sum($t))',
    'then',
    'end'
].join('\n');
const result = formatDrools(accum);
assert.ok(result.includes('accumulate ('), `accumulate should have space before paren, got: ${result}`);

console.log('DRL keywords formatting test passed');
