# Drools Formatter

VS Code extension that formats Drools (`.drl`) rule files.

## Features

- Format the entire document with `Ctrl+Shift+I` or `Format Document` command.
- Format the selected lines with `Ctrl+K Ctrl+F` or `Format Selection`.

The formatter follows the basic layout in the Drools reference documentation. Lines
beginning with `rule` and `end` are flush with the left margin. Any attributes
between the `rule` line and the `when` block are indented two spaces. The `when`
and `then` keywords start at the left margin, and their contents are indented
four spaces. Blocks are closed with `end` at column zero.

## Development

```
npm install
npm run watch

# For a single build
npm run compile
```

The compiled extension code is output to the `dist` folder.

## Usage

Open a `.drl` file in VS Code and use the standard formatting commands.
The extension registers the `drl` language, so `.drl` files are recognized automatically when the extension is installed.
