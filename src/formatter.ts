export function formatDrools(text: string): string {
    const lines = text.split(/\r?\n/);
    let context: 'none' | 'attr' | 'when' | 'then' = 'none';
    const formatted: string[] = [];

    const pad = (level: number) => '  '.repeat(Math.max(level, 0));

    for (const line of lines) {
        const trimmed = line.trim();
        const collapsed = trimmed
            .replace(/\s+/g, ' ')
            .replace(/\s+\(/g, '(');
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
