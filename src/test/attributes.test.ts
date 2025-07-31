import * as assert from 'assert';
import { formatDrools } from '../formatter';

const input = [
    'rule "R"',
    'dialect "mvel"',
    'salience 10',
    'when',
    '    $s : String()',
    'then',
    'end'
].join('\n');

const expected = [
    'rule "R"',
    '  dialect "mvel"',
    '  salience 10',
    '  when',
    '    $s : String()',
    '  then',
    'end'
].join('\n');

assert.strictEqual(formatDrools(input), expected);
console.log('attribute formatting test passed');
