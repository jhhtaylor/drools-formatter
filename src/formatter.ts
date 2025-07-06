export function formatDrools(text: string): string {
    const lines = text.split(/\r?\n/);
    let context: 'none' | 'attr' | 'when' | 'then' = 'none';
    const formatted: string[] = [];

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

            // revert spacing for constructor calls like `new Alert("msg")`
            collapsed = collapsed
                .replace(/\bnew\s+([A-Za-z_.$][\w.$]*)\(\s*/g, 'new $1(')
                .replace(/(\bnew\s+[A-Za-z_.$][\w.$]*\([^)]*)\s+\)/g, '$1)');
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

        let indent = 0;
        if (context === 'when' || context === 'then') {
            indent = 2;
        }
        formatted.push(pad(indent) + collapsed);
    }

    return formatted.join('\n');
}
