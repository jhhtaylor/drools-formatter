import * as vscode from 'vscode';
import { formatDrools, FormattingOptions } from './formatter';

function resolveIndentationOptions(editorOpts: vscode.FormattingOptions): FormattingOptions {
    const cfg = vscode.workspace.getConfiguration('droolsFormatter');
    const mode = cfg.get<'editor' | 'spaces' | 'tabs'>('indentation.mode', 'editor');
    const size = cfg.get<number>('indentation.size', 2);

    const clamp = (n: number) => Math.min(Math.max(n, 1), 8);

    if (mode === 'editor') {
        return {
            insertSpaces: editorOpts.insertSpaces,
            tabSize: clamp(typeof editorOpts.tabSize === 'number' ? editorOpts.tabSize : 2)
        };
    }

    if (mode === 'tabs') {
        return { insertSpaces: false, tabSize: clamp( (typeof editorOpts.tabSize === 'number' ? editorOpts.tabSize : 2) ) };
    }

    // mode === 'spaces'
    return { insertSpaces: true, tabSize: clamp(size) };
}

export function activate(context: vscode.ExtensionContext) {
    const formatter: vscode.DocumentFormattingEditProvider = {
        provideDocumentFormattingEdits(document, options) {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );
            const resolved = resolveIndentationOptions(options);
            const formatted = formatDrools(document.getText(), resolved);
            return [vscode.TextEdit.replace(fullRange, formatted)];
        }
    };

    const rangeFormatter: vscode.DocumentRangeFormattingEditProvider = {
        provideDocumentRangeFormattingEdits(document, range, options) {
            const text = document.getText(range);
            const resolved = resolveIndentationOptions(options);
            const formatted = formatDrools(text, resolved);
            return [vscode.TextEdit.replace(range, formatted)];
        }
    };

    const selector: vscode.DocumentSelector = { language: 'drools', scheme: 'file' };
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(selector, formatter),
        vscode.languages.registerDocumentRangeFormattingEditProvider(selector, rangeFormatter)
    );
}

export function deactivate() { }
