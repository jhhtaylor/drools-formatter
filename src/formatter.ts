export function formatDrools(text: string): string {
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
        if (context === 'when' || context === 'then') {
            indent = 2;
        }
        formatted.push(pad(indent) + trimmed);
    }

    return formatted.join('\n');
}
