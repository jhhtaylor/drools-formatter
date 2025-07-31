import * as assert from 'assert';
import { formatDrools } from '../formatter';

const input = [
    'rule "R"',
    'when',
    '    true',
    '    false',
    '    null',
    'then',
    '    exists',
    'end'
].join('\n');

const expected = [
    'rule "R"',
    '  when',
    '    true',
    '    false',
    '    null',
    '  then',
    '    exists',
    'end'
].join('\n');
assert.strictEqual(formatDrools(input), expected);
console.log('keyword formatting test passed');
