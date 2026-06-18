import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Constructor with nested parens: new Foo($x.getBar()) should stay compact
const nestedCtor = [
    'rule "R"',
    'when',
    'then',
    '    Context ctx = new AlternativeRuleContext($claim.getIndex());',
    'end'
].join('\n');
const expectedNested = [
    'rule "R"',
    'when',
    'then',
    '  Context ctx = new AlternativeRuleContext($claim.getIndex());',
    'end'
].join('\n');
assert.strictEqual(formatDrools(nestedCtor), expectedNested);

// Constructor with simple args
const simpleCtor = [
    'rule "R"',
    'when',
    'then',
    '    insert( new Alert("INFO", "msg") );',
    'end'
].join('\n');
const expectedSimple = [
    'rule "R"',
    'when',
    'then',
    '  insert(new Alert("INFO", "msg"));',
    'end'
].join('\n');
assert.strictEqual(formatDrools(simpleCtor), expectedSimple);

// Constructor with nested method calls in when block
const whenCtor = [
    'rule "R"',
    'when',
    '    $ctx : Context() from new ContextFactory($claim.getId())',
    'then',
    'end'
].join('\n');
const result = formatDrools(whenCtor);
assert.ok(result.includes('new ContextFactory($claim.getId())'), `Constructor should be compact, got: ${result}`);

console.log('constructor formatting test passed');
