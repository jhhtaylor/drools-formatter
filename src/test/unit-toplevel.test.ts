import * as assert from 'assert';
import { formatDrools } from '../formatter';

// unit directive recognized as top-level
const input = [
    'package org.example;',
    '',
    'unit ClaimUnit;',
    '',
    'import org.example.Claim;',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
const expected = [
    'package org.example;',
    '',
    'unit ClaimUnit;',
    '',
    'import org.example.Claim;',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(input), expected);

console.log('unit top-level formatting test passed');
