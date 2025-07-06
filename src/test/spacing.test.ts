import * as assert from 'assert';
import { formatDrools } from '../formatter';

const patternInputs = [
    '$s :      String ( this == "World"  )',
    '$s : String(this == "World")'
];
const expectedPattern = '$s : String( this == "World" )';
for (const input of patternInputs) {
    const drl = ['rule "R"', 'when', input, 'then', 'end'].join('\n');
    const expected = ['rule "R"', 'when', `    ${expectedPattern}`, 'then', 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
}

const actionInputs = [
    'System.out.println( "Even length string: " + $s );',
    'System.out.println("Even length string: " + $s );',
    'System.out.println("Even length string: " + $s);'
];
const expectedAction = 'System.out.println( "Even length string: " + $s );';
for (const input of actionInputs) {
    const drl = ['rule "R"', 'when', '    $s : String()', 'then', `    ${input}`, 'end'].join('\n');
    const expected = ['rule "R"', 'when', '    $s : String()', 'then', `    ${expectedAction}`, 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
}

const updateInputs = [
    'update( $app );',
    'update($app );',
    'update( $app);'
];
const expectedUpdate = 'update($app);';
for (const input of updateInputs) {
    const drl = ['rule "R"', 'when', '    $app : Object()', 'then', `    ${input}`, 'end'].join('\n');
    const expected = ['rule "R"', 'when', '    $app : Object()', 'then', `    ${expectedUpdate}`, 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
}
console.log('spacing formatting test passed');
