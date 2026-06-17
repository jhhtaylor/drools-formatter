import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Binding colon spacing normalization
const cases: [string, string][] = [
    ['$p:Person()', '$p : Person()'],
    ['$p  :  Person()', '$p : Person()'],
    ['$p :Person()', '$p : Person()'],
    ['$p : Person()', '$p : Person()'],
];

for (const [input, expectedLine] of cases) {
    const drl = ['rule "R"', 'when', `    ${input}`, 'then', 'end'].join('\n');
    const expected = ['rule "R"', 'when', `  ${expectedLine}`, 'then', 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected, `Failed for input: ${input}`);
}

// Binding with field binding
const fieldBinding = [
    'rule "R"',
    'when',
    '    $p:Person($name:name, $age:age)',
    'then',
    'end'
].join('\n');
const expectedField = [
    'rule "R"',
    'when',
    '  $p : Person( $name : name, $age : age )',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(fieldBinding), expectedField);

console.log('binding formatting test passed');
