import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Multi-line pattern in when block: continuation lines indented +1
const multiLineParen = [
    'rule "R"',
    'when',
    '    $s : ServiceLine(',
    '        claimIndex == $claim.index,',
    '        isReimbursed == false',
    '    )',
    'then',
    'end'
].join('\n');
const expectedMultiLine = [
    'rule "R"',
    'when',
    '  $s : ServiceLine(',
    '    claimIndex == $claim.index,',
    '    isReimbursed == false',
    '  )',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(multiLineParen), expectedMultiLine);

// Closing ) from on same line as closing paren
const withFrom = [
    'rule "R"',
    'when',
    '    $alt : AltRule(',
    '        name == "test"',
    '    ) from $ctx.findRules()',
    'then',
    'end'
].join('\n');
const expectedFrom = [
    'rule "R"',
    'when',
    '  $alt : AltRule(',
    '    name == "test"',
    '  ) from $ctx.findRules()',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(withFrom), expectedFrom);

// Method chain lines in then block get +1 indent
const methodChain = [
    'rule "R"',
    'when',
    '    $c : Claim()',
    'then',
    '    double total = items.stream()',
    '        .filter( i -> i.isValid() )',
    '        .mapToDouble( i -> i.getAmount() )',
    '        .sum();',
    'end'
].join('\n');
const expectedChain = [
    'rule "R"',
    'when',
    '  $c : Claim()',
    'then',
    '  double total = items.stream()',
    '    .filter( i -> i.isValid() )',
    '    .mapToDouble( i -> i.getAmount() )',
    '    .sum();',
    'end'
].join('\n');
assert.strictEqual(formatDrools(methodChain), expectedChain);

// Nested parens in then block
const nestedParens = [
    'rule "R"',
    'when',
    '    $p : Person()',
    'then',
    '    modify( $p ){',
    '        setCarveout( Info.create(',
    '            type,',
    '            category',
    '        ) ),',
    '        setDone( true )',
    '    }',
    'end'
].join('\n');
const expectedNested = [
    'rule "R"',
    'when',
    '  $p : Person()',
    'then',
    '  modify( $p ){',
    '    setCarveout( Info.create(',
    '        type,',
    '        category',
    '      ) ),',
    '    setDone( true )',
    '  }',
    'end'
].join('\n');
assert.strictEqual(formatDrools(nestedParens), expectedNested);

console.log('continuation formatting test passed');
