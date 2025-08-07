import * as assert from 'assert';
import { formatDrools } from '../formatter';

const drl = ['rule "R"', 'when', '$s : String()', 'then', 'System.out.println($s);', 'end'].join('\n');

const expected4Spaces = ['rule "R"', 'when', '    $s : String()', 'then', '    System.out.println( $s );', 'end'].join('\n');
assert.strictEqual(formatDrools(drl, { insertSpaces: true, tabSize: 4 }), expected4Spaces);

const expectedTabs = ['rule "R"', 'when', '\t$s : String()', 'then', '\tSystem.out.println( $s );', 'end'].join('\n');
assert.strictEqual(formatDrools(drl, { insertSpaces: false, tabSize: 4 }), expectedTabs);

console.log('indentation formatting test passed');
