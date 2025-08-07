import * as assert from 'assert';
import { formatDrools } from '../formatter';

const patternInputs = [
    '$s :      String ( this == "World"  )',
    '$s : String(this == "World")',
    '$s : String( this == ( "World" ) )'
];
const expectedPattern = '$s : String( this == "World" )';
for (const input of patternInputs) {
    const drl = ['rule "R"', 'when', input, 'then', 'end'].join('\n');
    const expectLine = input.includes('( "World" ) )') ? '$s : String( this == ( "World" ) )' : expectedPattern;
    const expected = ['rule "R"', 'when', `  ${expectLine}`, 'then', 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
}

const exprInput = '( $a == 1 ) && ( $b == 2 )';
const exprDrl = ['rule "R"', 'when', `    ${exprInput}`, 'then', 'end'].join('\n');
const exprExpected = ['rule "R"', 'when', '  ( $a == 1 ) && ( $b == 2 )', 'then', 'end'].join('\n');
assert.strictEqual(formatDrools(exprDrl), exprExpected);

const actionInputs = [
    'System.out.println( "Even length string: " + $s );',
    'System.out.println("Even length string: " + $s );',
    'System.out.println("Even length string: " + $s)',
    'if(true){System.out.println($s);}'
];
const expectedActionLines = [
    'System.out.println( "Even length string: " + $s );',
    'System.out.println( "Even length string: " + $s )',
    'if ( true ){System.out.println( $s );}'
];
actionInputs.forEach((input, idx) => {
    const drl = ['rule "R"', 'when', '    $s : String()', 'then', `    ${input}`, 'end'].join('\n');
    let expectLine: string;
    if (idx === actionInputs.length - 1) {
        expectLine = expectedActionLines[2];
    } else if (idx === 2) {
        expectLine = expectedActionLines[1];
    } else {
        expectLine = expectedActionLines[0];
    }
    const expected = ['rule "R"', 'when', '  $s : String()', 'then', `  ${expectLine}`, 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
});

const updateInputs = [
    'update( $app );',
    'update($app );',
    'update( $app);'
];
const expectedUpdate = 'update($app);';
for (const input of updateInputs) {
    const drl = ['rule "R"', 'when', '    $app : Object()', 'then', `    ${input}`, 'end'].join('\n');
    const expected = ['rule "R"', 'when', '  $app : Object()', 'then', `  ${expectedUpdate}`, 'end'].join('\n');
    assert.strictEqual(formatDrools(drl), expected);
}

const constructorInput = 'alerts.add( new Alert("INFO", "System started") );';
const newDrl = ['rule "R"', 'when', '    // Empty', 'then', `    ${constructorInput}`, 'end'].join('\n');
const newExpected = ['rule "R"', 'when', '  // Empty', 'then', '  alerts.add( new Alert("INFO", "System started") );', 'end'].join('\n');
assert.strictEqual(formatDrools(newDrl), newExpected);
console.log('spacing formatting test passed');
