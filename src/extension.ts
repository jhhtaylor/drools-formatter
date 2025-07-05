import * as vscode from 'vscode';

function formatDrools(text: string): string {
    const lines = text.split(/\r?\n/);
    let context: 'none' | 'attr' | 'when' | 'then' = 'none';
    const formatted: string[] = [];

    const pad = (level: number) => '  '.repeat(Math.max(level, 0));

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === '') {
            formatted.push('');
            continue;
        }

        if (trimmed === 'end') {
            formatted.push('end');
            context = 'none';
            continue;
        }

        if (/^rule\b/.test(trimmed)) {
            formatted.push(trimmed);
            context = 'attr';
            continue;
        }

        if (trimmed === 'when') {
            formatted.push('when');
            context = 'when';
            continue;
        }

        if (trimmed === 'then') {
            formatted.push('then');
            context = 'then';
            continue;
        }

        let indent = 0;
        if (context === 'attr') {
            indent = 1;
        } else if (context === 'when' || context === 'then') {
            indent = 2;
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
