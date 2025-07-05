import * as vscode from 'vscode';
import { formatDrools } from './formatter';

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

export function deactivate() { }
