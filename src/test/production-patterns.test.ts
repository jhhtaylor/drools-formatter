import * as assert from 'assert';
import { formatDrools } from '../formatter';

// Dynamic salience expression
const dynamicSalience = [
    'rule DOLLAR_CASE',
    '  salience $carveoutRule.getSalience()',
    'when',
    '    $claim : /claims[isInpatient]',
    'then',
    'end'
].join('\n');
const expectedSalience = [
    'rule DOLLAR_CASE',
    '  salience $carveoutRule.getSalience()',
    'when',
    '  $claim : /claims[isInpatient]',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(dynamicSalience), expectedSalience);

// from clause with method call
const fromClause = [
    'rule "R"',
    'when',
    '    $claim : /claims',
    '    $carveoutRule : CarveoutRule() from $serviceLine.carveoutRule',
    '    $rate : CollectionRate() from $carveoutRule.getCollectionRateReimbursement()',
    'then',
    'end'
].join('\n');
const expectedFrom = [
    'rule "R"',
    'when',
    '  $claim : /claims',
    '  $carveoutRule : CarveoutRule() from $serviceLine.carveoutRule',
    '  $rate : CollectionRate() from $carveoutRule.getCollectionRateReimbursement()',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(fromClause), expectedFrom);

// Multi-line pattern with ) from on closing line
const closingFrom = [
    'rule "R"',
    'when',
    '    $claim : /claims',
    '    $alt : ClaimAlternativeRule(',
    '        claimIndex == $claim.getIndex(),',
    '        getName() == "TEST"',
    '    ) from $context.findRules()',
    'then',
    'end'
].join('\n');
const expectedClosingFrom = [
    'rule "R"',
    'when',
    '  $claim : /claims',
    '  $alt : ClaimAlternativeRule(',
    '    claimIndex == $claim.getIndex(),',
    '    getName() == "TEST"',
    '  ) from $context.findRules()',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(closingFrom), expectedClosingFrom);

// Rule with extends
const extendsRule = [
    'rule "CHILD" extends "PARENT"',
    'when',
    '    $p : Person()',
    'then',
    'end'
].join('\n');
const expectedExtends = [
    'rule "CHILD" extends "PARENT"',
    'when',
    '  $p : Person()',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(extendsRule), expectedExtends);

// Collect with type cast in then
const collectPattern = [
    'rule "R"',
    'when',
    '    $claim : /claims[isInpatient]',
    '    $serviceLines : List() from collect ( ServiceLine( claimIndex == $claim.index ) )',
    'then',
    '    List<ServiceLine> serviceLines = new ArrayList<>( (List<ServiceLine>) $serviceLines );',
    'end'
].join('\n');
const result = formatDrools(collectPattern);
assert.ok(result.includes('collect ( ServiceLine'), 'collect should keep space before paren');
assert.ok(result.includes('new ArrayList<>'), 'Constructor with diamond generic should be preserved');

// Multi-line modify with method calls
const multiModify = [
    'rule "R"',
    'when',
    '    $s : ServiceLine()',
    'then',
    '    modify( $s ) {',
    '        markReimbursed( reimbursement ),',
    '        setCarveout( CarveoutInfo.setWithValue( type, category, value ) ),',
    '        setCarveoutRule( $carveoutRule )',
    '    }',
    'end'
].join('\n');
const expectedModify = [
    'rule "R"',
    'when',
    '  $s : ServiceLine()',
    'then',
    '  modify( $s ) {',
    '    markReimbursed( reimbursement ),',
    '    setCarveout( CarveoutInfo.setWithValue( type, category, value ) ),',
    '    setCarveoutRule( $carveoutRule )',
    '  }',
    'end'
].join('\n');
assert.strictEqual(formatDrools(multiModify), expectedModify);

// Stream chain in then block
const streamChain = [
    'rule "R"',
    'when',
    '    $claim : /claims',
    'then',
    '    Double total = serviceLines.stream()',
    '        .mapToDouble( sl -> sl.getAmount() != null ? sl.getAmount() : 0.0 )',
    '        .sum();',
    'end'
].join('\n');
const expectedStream = [
    'rule "R"',
    'when',
    '  $claim : /claims',
    'then',
    '  Double total = serviceLines.stream()',
    '    .mapToDouble( sl -> sl.getAmount() != null ? sl.getAmount() : 0.0 )',
    '    .sum();',
    'end'
].join('\n');
assert.strictEqual(formatDrools(streamChain), expectedStream);

// Multiple rule attributes
const multiAttr = [
    'rule APPLY_COLLECTION_RATES',
    '    salience 500',
    '    no-loop true',
    'when',
    '    $claim : /claims',
    'then',
    'end'
].join('\n');
const expectedAttr = [
    'rule APPLY_COLLECTION_RATES',
    '  salience 500',
    '  no-loop true',
    'when',
    '  $claim : /claims',
    'then',
    'end'
].join('\n');
assert.strictEqual(formatDrools(multiAttr), expectedAttr);

console.log('production patterns formatting test passed');
