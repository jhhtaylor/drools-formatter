import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Multiple blank lines collapsed to one
const input = [
    'package org.example;',
    '',
    '',
    '',
    'import org.example.Person;',
    '',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
const expected = [
    'package org.example;',
    '',
    'import org.example.Person;',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(input), expected);

console.log('blank lines formatting test passed');
