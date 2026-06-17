export interface FormattingOptions {
    insertSpaces: boolean;
    tabSize: number;
}

type Context = 'none' | 'attr' | 'when' | 'then' | 'query' | 'function' | 'declare';

const TOP_LEVEL_RE = /^(package|import|global)\b/;

const RULE_ATTRIBUTES = [
    'salience', 'enabled', 'no-loop', 'lock-on-active', 'auto-focus',
    'agenda-group', 'activation-group', 'ruleflow-group',
    'date-effective', 'date-expires', 'dialect', 'duration', 'timer',
    'calendar', 'calendars',
];
const DRL_KEYWORDS = ['not', 'exists', 'forall', 'accumulate', 'collect', 'eval', 'from'];
const CONTROL_KEYWORDS = ['if', 'for', 'while', 'switch', 'catch'];
const ALL_PAREN_KEYWORDS = [...DRL_KEYWORDS, ...CONTROL_KEYWORDS];
const PAREN_KEYWORD_RE = new RegExp('\\b(' + ALL_PAREN_KEYWORDS.join('|') + ')\\(', 'g');

const THEN_COMPACT_KEYWORDS = ['update', 'insert', 'insertLogical', 'delete', 'retract'];

export function formatDrools(text: string, options?: FormattingOptions): string {
    const lines = text.split(/\r?\n/);
    let context: Context = 'none';
    const formatted: string[] = [];
    let blockIndent = 0;
    let inBlockComment = false;
    let funcBraceDepth = 0;

    const insertSpaces = options?.insertSpaces !== undefined ? options.insertSpaces : true;
    const tabSize = Math.min(Math.max(options?.tabSize ?? 2, 1), 8);
    const indentUnit = insertSpaces ? ' '.repeat(tabSize) : '\t';
    const pad = (level: number) => indentUnit.repeat(Math.max(level, 0));

    for (const line of lines) {
        const trimmed = line.trim();

        // --- Multi-line comment tracking ---
        if (inBlockComment) {
            const indent = context === 'none' ? blockIndent : blockIndent + 1;
            formatted.push(pad(indent) + trimmed);
            if (trimmed.includes('*/')) inBlockComment = false;
            continue;
        }
        if (trimmed.startsWith('/*')) {
            const indent = context === 'none' ? blockIndent : blockIndent + 1;
            formatted.push(pad(indent) + trimmed);
            if (!trimmed.includes('*/')) inBlockComment = true;
            continue;
        }

        // --- Single-line comment: preserve content, only indent ---
        if (trimmed.startsWith('//')) {
            let indent = blockIndent;
            if (context === 'attr' || context === 'when' || context === 'then' || context === 'query' || context === 'declare') {
                indent += 1;
            }
            formatted.push(pad(indent) + trimmed);
            continue;
        }

        let collapsed = trimmed.replace(/\s+/g, ' ');

        // --- Blank line handling ---
        if (collapsed === '') {
            if (formatted.length > 0 && formatted[formatted.length - 1] === '') continue;
            formatted.push('');
            continue;
        }

        // --- Top-level constructs always at zero indent ---
        if (TOP_LEVEL_RE.test(collapsed)) {
            formatted.push(collapsed);
            continue;
        }

        // --- end keyword ---
        if (collapsed === 'end') {
            formatted.push('end');
            if (context === 'declare' || context === 'query' || context === 'then' || context === 'when' || context === 'attr') {
                context = 'none';
            }
            continue;
        }

        // --- rule declaration ---
        if (/^rule\b/.test(collapsed)) {
            formatted.push(collapsed);
            context = 'attr';
            continue;
        }

        // --- query declaration ---
        if (/^query\b/.test(collapsed)) {
            formatted.push(collapsed);
            context = 'query';
            continue;
        }

        // --- declare declaration ---
        if (/^declare\b/.test(collapsed)) {
            formatted.push(collapsed);
            context = 'declare';
            continue;
        }

        // --- function declaration ---
        if (/^function\b/.test(collapsed) && context === 'none') {
            context = 'function';
            funcBraceDepth = 0;
            if (collapsed.includes('{')) {
                funcBraceDepth = 1;
                formatted.push(collapsed);
            } else {
                formatted.push(collapsed);
            }
            continue;
        }

        // --- when / then keywords ---
        if (collapsed === 'when' && (context === 'attr' || context === 'none')) {
            formatted.push(pad(blockIndent) + 'when');
            context = 'when';
            continue;
        }

        if (collapsed === 'then' && (context === 'when' || context === 'none')) {
            formatted.push(pad(blockIndent) + 'then');
            context = 'then';
            continue;
        }

        // --- function body tracking ---
        if (context === 'function') {
            const openCount = (collapsed.match(/\{/g) || []).length;
            const closeCount = (collapsed.match(/\}/g) || []).length;

            if (trimmed.startsWith('}')) {
                funcBraceDepth -= 1;
            }

            formatted.push(pad(funcBraceDepth) + collapsed);

            if (!trimmed.startsWith('}')) {
                funcBraceDepth += openCount - closeCount;
            } else {
                funcBraceDepth += openCount;
            }

            if (funcBraceDepth <= 0) {
                context = 'none';
                funcBraceDepth = 0;
            }
            continue;
        }

        // --- Spacing transformations ---
        const removePreSpace = () => {
            collapsed = collapsed.replace(/([A-Za-z0-9_$])\s*\(/g, '$1(');
        };

        const addKeywordParenSpace = () => {
            collapsed = collapsed.replace(PAREN_KEYWORD_RE, '$1 (');
        };

        const addInnerSpaces = () => {
            collapsed = collapsed
                .replace(/([=!><&|+\-*/%])\(/g, '$1 (')
                .replace(/\(\s*/g, '( ')
                .replace(/\s*\)/g, ' )')
                .replace(/\( \)/g, '()');
        };

        const spaceOperators = () => {
            const strings: string[] = [];
            collapsed = collapsed.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, (m) => {
                strings.push(m);
                return `\x00STR${strings.length - 1}\x00`;
            });
            collapsed = collapsed
                .replace(/([!=<>])=(?!=)/g, '$1= ')
                .replace(/(?<![=!<>])\s*([!=<>])=/g, ' $1=')
                .replace(/(?<![=!<>\-])(?<!-)(?<!\w[<>])([<>])(?![=<>])/g, ' $1 ')
                .replace(/\s{2,}/g, ' ');
            collapsed = collapsed.replace(/\x00STR(\d+)\x00/g, (_, idx) => strings[Number(idx)]);
        };

        const normalizeBindingColon = () => {
            collapsed = collapsed.replace(/(\$[A-Za-z_][A-Za-z0-9_]*)\s*:\s*/g, '$1 : ');
        };

        const normalizeCommaSpacing = () => {
            collapsed = collapsed.replace(/\s*,\s*/g, ', ');
        };

        removePreSpace();
        addKeywordParenSpace();

        if (context === 'when' || context === 'query') {
            normalizeBindingColon();
            addInnerSpaces();
            normalizeCommaSpacing();
            spaceOperators();
            collapsed = collapsed.replace(/\bnew\s+([A-Za-z0-9_.<>$]+)\(\s*([^)]*?)\s*\)/g, (m, cls, args) => `new ${cls}(${args.trim()})`);
        } else if (context === 'then') {
            const start = collapsed.trimStart();
            const isModifyBlock = start.startsWith('modify(') || start.startsWith('modify (');
            if (THEN_COMPACT_KEYWORDS.some(k => start.startsWith(k + '(')) && !isModifyBlock) {
                collapsed = collapsed
                    .replace(/\s*\(\s*/g, '(')
                    .replace(/\s*\)/g, ')');
            } else {
                addInnerSpaces();
            }
            normalizeCommaSpacing();
            collapsed = collapsed.replace(/\s+([;,])/g, '$1');
            collapsed = collapsed.replace(/\bnew\s+([A-Za-z0-9_.<>$]+)\(\s*([^)]*?)\s*\)/g, (m, cls, args) => `new ${cls}(${args.trim()})`);
        }

        // --- Indentation ---
        if (trimmed.startsWith('}')) {
            blockIndent = Math.max(blockIndent - 1, 0);
        }

        let indent = blockIndent;
        if (context === 'attr') {
            indent += 1;
        }
        if (context === 'when' || context === 'then') {
            indent += 1;
        }
        if (context === 'query' || context === 'declare') {
            indent += 1;
        }

        formatted.push((pad(indent) + collapsed).trimEnd());

        if (trimmed.endsWith('{')) {
            blockIndent++;
        }
    }

    return formatted.join('\n');
}
