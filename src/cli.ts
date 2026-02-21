#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { formatDrools } from './formatter';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`
Usage: drools-fmt [options] [file]

Formats Drools (.drl) rule files.

Arguments:
  file              Path to a .drl file (omit to read from stdin)

Options:
  --write           Edit the file in-place instead of printing to stdout
  --tabs            Use hard tabs instead of spaces (default: spaces)
  --tab-size=N      Number of spaces per indent level, 1-8 (default: 2)
  -h, --help        Show this help message

Examples:
  drools-fmt my_rules.drl
  drools-fmt --write my_rules.drl
  drools-fmt --tab-size=4 my_rules.drl
  drools-fmt < my_rules.drl
  cat my_rules.drl | drools-fmt
`.trimStart());
    process.exit(0);
}

const insertSpaces = !args.includes('--tabs');
const tabSizeArg = args.find(a => a.startsWith('--tab-size='));
const tabSize = tabSizeArg ? parseInt(tabSizeArg.split('=')[1], 10) : 2;
const writeInPlace = args.includes('--write');

const fileArg = args.find(a => !a.startsWith('--'));

function format(input: string): void {
    const result = formatDrools(input, { insertSpaces, tabSize });
    if (writeInPlace && fileArg) {
        fs.writeFileSync(fileArg, result, 'utf8');
        process.stderr.write(`Formatted ${path.resolve(fileArg)}\n`);
    } else {
        process.stdout.write(result);
    }
}

if (fileArg) {
    if (!fs.existsSync(fileArg)) {
        process.stderr.write(`Error: file not found: ${fileArg}\n`);
        process.exit(1);
    }
    format(fs.readFileSync(fileArg, 'utf8'));
} else {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { input += chunk; });
    process.stdin.on('end', () => format(input));
}
