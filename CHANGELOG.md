# Change Log

All notable changes to the Drools Formatter extension will be documented in this file.

## [0.3.1] - 2026-06-18

### Added
- Multi-line parenthesized continuation indentation in `when`/`query` blocks
- Method chain (`.method()`) continuation indentation in `then` blocks
- Nested-parenthesis-aware constructor formatting (`new Foo($x.getBar())` stays compact)
- Closing `)` on its own line aligns with the opening pattern, not the continuation level
- `unit` recognized as a top-level construct (zero indent like `package`/`import`)
- Production DRL pattern test suite (dynamic salience, `from` clauses, `extends`, `collect`, stream chains)
- Removed redundant `onLanguage:drools` activation event (VS Code auto-generates it)

## [0.3.0] - 2026-06-17

### Added
- Operator spacing in `when`/`query` constraints (`age>=18` is now formatted as `age >= 18`)
- Binding colon normalization (`$p:Person()` becomes `$p : Person()`)
- Comma spacing in constraints (`age > 50,weight > 80` becomes `age > 50, weight > 80`)
- `function` block support with proper body indentation
- `declare` block support with indented fields and annotations
- `modify` block formatting with inner spaces (distinct from compact `update`/`insert` style)
- DRL keyword spacing for `not`, `exists`, `forall`, `accumulate`, `collect`, `eval` (`not(X)` becomes `not (X)`)
- Top-level construct handling (`package`, `import`, `global` always at zero indent)
- Comment preservation — `//` and `/* */` content is no longer modified by spacing rules
- Consecutive blank line collapsing
- Recognition of all standard rule attributes (`no-loop`, `lock-on-active`, `agenda-group`, etc.)
- Twelve new test suites covering all additions

## [0.2.3] - 2025-12-08

### Added
- Sponsor link in package.json and marketplace page
- Support message in README.md

## [0.1.2  - 0.1.3]

- Removed the unsupported jim-moody.drools dependency from the extension manifest so the package can publish without unresolved dependencies

## [0.1.1]

- Respect VS Code editor settings for indentation, allowing tabs or configurable
  spaces (1–8).

## [0.0.2 - 0.1.0]

- Fix compatibility issues.

## [0.0.1]

- Initial release of Drools Formatter.