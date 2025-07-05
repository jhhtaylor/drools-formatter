import * as vscode from 'vscode';

function formatDrools(text: string): string {
    const lines = text.split(/\r?\n/);
    let indent = 0;
    const formatted: string[] = [];

    const pad = (level: number) => '  '.repeat(Math.max(level, 0));

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === 'end') {
            formatted.push(pad(0) + trimmed);
            indent = 0;
            continue;
        }

        if (/^rule\b/.test(trimmed)) {
            formatted.push(trimmed);
            indent = 1;
            continue;
        }

        if (trimmed === 'when') {
            formatted.push(pad(1) + trimmed);
            indent = 2;
            continue;
        }

        if (trimmed === 'then') {
            formatted.push(pad(1) + trimmed);
            indent = 2;
            continue;
        }

        formatted.push(pad(indent) + trimmed);
    }

    return formatted.join('\n');
}

export function activate(context: vscode.ExtensionContext) {
    const formatter: vscode.DocumentFormattingEditProvider = {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );
            const formatted = formatDrools(document.getText());
            return [vscode.TextEdit.replace(fullRange, formatted)];
        }
    };

    const rangeFormatter: vscode.DocumentRangeFormattingEditProvider = {
        provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
            const text = document.getText(range);
            const formatted = formatDrools(text);
            return [vscode.TextEdit.replace(range, formatted)];
        }
    };

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('drl', formatter),
        vscode.languages.registerDocumentRangeFormattingEditProvider('drl', rangeFormatter)
    );
}

export function deactivate() {}
