import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Multi-line modify block gets proper indentation
const input = [
    'rule "R"',
    'when',
    '    $p : Person()',
    'then',
    '    modify( $p ) {',
    '        setName("John"),',
    '        setAge(30)',
    '    };',
    'end'
].join('\n');
const expected = [
    'rule "R"',
    'when',
    '  $p : Person()',
    'then',
    '  modify( $p ) {',
    '    setName( "John" ),',
    '    setAge( 30 )',
    '  };',
    'end'
].join('\n');
assert.strictEqual(formatDrools(input), expected);

// modify gets inner spaces (not compact like update/insert)
const singleModify = [
    'rule "R"',
    'when',
    '    $p : Person()',
    'then',
    '    modify($p) { setName("John") };',
    'end'
].join('\n');
const expectedSingle = [
    'rule "R"',
    'when',
    '  $p : Person()',
    'then',
    '  modify( $p ) { setName( "John" ) };',
    'end'
].join('\n');
assert.strictEqual(formatDrools(singleModify), expectedSingle);

console.log('modify formatting test passed');
