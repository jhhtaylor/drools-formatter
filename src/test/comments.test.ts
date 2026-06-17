import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Single-line comments preserve content and get proper indentation
const singleLine = [
    'rule "R"',
    'when',
    '    // check person age',
    'then',
    '    // perform action',
    'end'
].join('\n');
const expectedSingle = [
    'rule "R"',
    'when',
    '  // check person age',
    'then',
    '  // perform action',
    'end'
].join('\n');
assert.strictEqual(formatDrools(singleLine), expectedSingle);

// Multi-line block comments are preserved
const blockComment = [
    '/* This is a',
    '   block comment */',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
const expectedBlock = [
    '/* This is a',
    'block comment */',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(blockComment), expectedBlock);

// Comments inside when block get indented
const inWhen = [
    'rule "R"',
    'when',
    '/* multi-line',
    '   in when */',
    'then',
    'end'
].join('\n');
const expectedInWhen = [
    'rule "R"',
    'when',
    '  /* multi-line',
    '  in when */',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(inWhen), expectedInWhen);

// Comment content is not mangled by spacing rules
const commentWithParens = [
    'rule "R"',
    'when',
    '    // Person(age>=18) is matched here',
    'then',
    'end'
].join('\n');
const expectedParens = [
    'rule "R"',
    'when',
    '  // Person(age>=18) is matched here',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(commentWithParens), expectedParens);

console.log('comments formatting test passed');
