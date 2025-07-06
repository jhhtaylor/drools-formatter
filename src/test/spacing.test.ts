import * as assert from 'assert';
import { formatDrools } from '../formatter';

const input = '$s :      String ( this == "World"  )';
const expected = '$s : String( this == "World" )';
assert.strictEqual(formatDrools(input), expected);
console.log('spacing formatting test passed');
