# Drools Formatter

VS Code extension that formats Drools (`.drl`) rule files.

## Features

- Format the entire document with `Ctrl+Shift+I` or `Format Document` command.
- Format the selected lines with `Ctrl+K Ctrl+F` or `Format Selection`.

The formatter uses a very simple indentation algorithm that indents lines after `when` and `then` and dedents at `end`.

## Development

```
npm install
npm run compile
```

The compiled extension code is output to the `dist` folder.

## Usage

Open a `.drl` file in VS Code and use the standard formatting commands.
