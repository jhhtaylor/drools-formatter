import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Operators get spaced in when block
const cases: [string, string][] = [
    ['Person(age>=18)', 'Person( age >= 18 )'],
    ['Person(age<=65)', 'Person( age <= 65 )'],
    ['Person(age==30)', 'Person( age == 30 )'],
    ['Person(age!=0)', 'Person( age != 0 )'],
    ['Person(age>18)', 'Person( age > 18 )'],
    ['Person(age<65)', 'Person( age < 65 )'],
    ['Person(age >= 18)', 'Person( age >= 18 )'],
];

for (const [input, expectedLine] of cases) {
    const drl = ['rule "R"', 'when', `    ${input}`, 'then', 'end'].join('\n');
    const expected = ['rule "R"', 'when', `  ${expectedLine}`, 'then', 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected, `Failed for input: ${input}`);
}

// Operators inside strings are not touched
const stringCase = [
    'rule "R"',
    'when',
    '    Person(name == "a>=b")',
    'then',
    'end'
].join('\n');
const expectedString = [
    'rule "R"',
    'when',
    '  Person( name == "a>=b" )',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(stringCase), expectedString);

// Multiple constraints with operators
const multi = [
    'rule "R"',
    'when',
    '    Person(age>=18,salary<=50000,name!="admin")',
    'then',
    'end'
].join('\n');
const expectedMulti = [
    'rule "R"',
    'when',
    '  Person( age >= 18, salary <= 50000, name != "admin" )',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(multi), expectedMulti);

console.log('operators formatting test passed');
