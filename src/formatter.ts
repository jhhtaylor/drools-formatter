export function formatDrools(text: string): string {
    const lines = text.split(/\r?\n/);
    let context: 'none' | 'attr' | 'when' | 'then' = 'none';
    const formatted: string[] = [];

    const pad = (level: number) => '  '.repeat(Math.max(level, 0));
    let braceLevel = 0;

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
        }
        if (collapsed === '') {
            formatted.push('');
            continue;
        }

        if (collapsed === 'end') {
            formatted.push('end');
            context = 'none';
            braceLevel = 0;
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

        const base = (context === 'when' || context === 'then') ? 2 : 0;
        const leadingClose = collapsed.trimStart().startsWith('}') ? 1 : 0;
        let indentLevel = braceLevel - leadingClose;
        if (indentLevel < 0) indentLevel = 0;
        formatted.push(pad(base + indentLevel) + collapsed);

        const openCount = (collapsed.match(/{/g) || []).length;
        const closeCount = (collapsed.match(/}/g) || []).length;
        braceLevel += openCount - closeCount;
    }

    return formatted.join('\n');
}
