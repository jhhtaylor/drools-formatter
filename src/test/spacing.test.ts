import * as assert from 'assert';
import { formatDrools } from '../formatter';

const inputs = [
    '$s :      String ( this == "World"  )',
    '$s : String(this == "World")'
];
const expectedLine = '$s : String( this == "World" )';
for (const input of inputs) {
    const drl = ['rule "R"', 'when', input, 'then', 'end'].join('\n');
    const expected = ['rule "R"', 'when', `    ${expectedLine}`, 'then', 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
}
console.log('spacing formatting test passed');
