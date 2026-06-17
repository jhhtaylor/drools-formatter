import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Function body gets properly indented
const input = [
    'function String greet(String name) {',
    'if (name == null) {',
    'return "Hello!";',
    '}',
    'return "Hello, " + name;',
    '}'
].join('\n');
const expected = [
    'function String greet(String name) {',
    '  if (name == null) {',
    '    return "Hello!";',
    '  }',
    '  return "Hello, " + name;',
    '}'
].join('\n');
assert.strictEqual(formatDrools(input), expected);

// Function followed by a rule
const withRule = [
    'function void log(String msg) {',
    'System.out.println(msg);',
    '}',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
const expectedWithRule = [
    'function void log(String msg) {',
    '  System.out.println(msg);',
    '}',
    '',
    'rule "R"',
    'when',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(withRule), expectedWithRule);

console.log('function formatting test passed');
