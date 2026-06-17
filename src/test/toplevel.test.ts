import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Package, import, global always at zero indent
const input = [
    '  package org.example;',
    '',
    '  import org.example.Person;',
    '  import org.example.Address;',
    '',
    '  global String output;',
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
    'import org.example.Address;',
    '',
    'global String output;',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(input), expected);

console.log('top-level constructs formatting test passed');
