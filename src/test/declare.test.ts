import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Declare block with fields indented
const input = [
    'declare Person',
    'name : String',
    '@key',
    'age : int',
    'end'
].join('\n');
const expected = [
    'declare Person',
    '  name : String',
    '  @key',
    '  age : int',
    'end'
].join('\n');
assert.strictEqual(formatDrools(input), expected);

// Declare with metadata annotations
const withMeta = [
    'declare Person',
    '@author( Bob )',
    'name : String @key @maxLength( 30 )',
    'age : int',
    'end'
].join('\n');
const expectedMeta = [
    'declare Person',
    '  @author( Bob )',
    '  name : String @key @maxLength( 30 )',
    '  age : int',
    'end'
].join('\n');
assert.strictEqual(formatDrools(withMeta), expectedMeta);

// Declare enum
const enumDecl = [
    'declare enum DaysOfWeek',
    'SUN("Sunday"),MON("Monday");',
    'fullName : String',
    'end'
].join('\n');
const expectedEnum = [
    'declare enum DaysOfWeek',
    '  SUN("Sunday"),MON("Monday");',
    '  fullName : String',
    'end'
].join('\n');
assert.strictEqual(formatDrools(enumDecl), expectedEnum);

console.log('declare formatting test passed');
