import * as assert from 'assert';
import { formatDrools } from '../formatter';

const input = [
    'query adults',
    '$p : Person(age>=18)',
    'end'
].join('\n');

const expected = [
    'query adults',
    '    $p : Person( age>=18 )',
    'end'
].join('\n');

assert.strictEqual(formatDrools(input), expected);
console.log('query formatting test passed');
