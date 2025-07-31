export function formatDrools(text: string): string {
    const lines = text.split(/\r?\n/);
    let context: 'none' | 'attr' | 'when' | 'then' = 'none';
    const formatted: string[] = [];
    let blockIndent = 0;

    const pad = (level: number) => '  '.repeat(Math.max(level, 0));

    for (const line of lines) {
        const trimmed = line.trim();
        let collapsed = trimmed.replace(/\s+/g, ' ');

        const removePreSpace = () => {
            collapsed = collapsed.replace(/([A-Za-z0-9_])\s*\(/g, '$1(');
        };

        const addInnerSpaces = () => {
            collapsed = collapsed
                .replace(/([=!><&|+\-*/%])\(/g, '$1 (')
                .replace(/\b(if|for|while|switch|catch)\(/g, '$1 (')
                .replace(/\(\s*/g, '( ')
                .replace(/\s*\)/g, ' )')
                .replace(/\( \)/g, '()');
        };

        removePreSpace();

        if (context === 'when') {
            addInnerSpaces();
            collapsed = collapsed.replace(/\bnew\s+([A-Za-z0-9_.<>$]+)\(\s*([^)]*?)\s*\)/g, (m, cls, args) => `new ${cls}(${args.trim()})`);
        } else if (context === 'then') {
            const keywords = ['update', 'insert', 'insertLogical', 'delete', 'retract', 'modify'];
            const start = collapsed.trimStart();
            if (keywords.some(k => start.startsWith(k + '('))) {
                collapsed = collapsed
                    .replace(/\s*\(\s*/g, '(')
                    .replace(/\s*\)/g, ')');
            } else {
                addInnerSpaces();
            }
            collapsed = collapsed.replace(/\s+([;,])/g, '$1');
            collapsed = collapsed.replace(/\bnew\s+([A-Za-z0-9_.<>$]+)\(\s*([^)]*?)\s*\)/g, (m, cls, args) => `new ${cls}(${args.trim()})`);
        }
        if (collapsed === '') {
            formatted.push('');
            continue;
        }

        if (collapsed === 'end') {
            formatted.push('end');
            context = 'none';
            continue;
        }

        if (/^rule\b/.test(collapsed)) {
            formatted.push(collapsed);
            context = 'attr';
            continue;
        }

        if (collapsed === 'when') {
            formatted.push('when');
            context = 'when';
            continue;
        }

        if (collapsed === 'then') {
            formatted.push('then');
            context = 'then';
            continue;
        }

        if (trimmed.startsWith('}')) {
            blockIndent = Math.max(blockIndent - 1, 0);
        }

        let indent = blockIndent;
        if (context === 'when' || context === 'then') {
            indent += 2;
        }

        formatted.push(pad(indent) + collapsed);

        if (trimmed.endsWith('{')) {
            blockIndent++;
        }
    }

    return formatted.join('\n');
}
