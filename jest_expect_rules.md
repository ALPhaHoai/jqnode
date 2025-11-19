# Rules for Using `expect` in Jest Test Cases

These rules are for an AI agent to follow when writing or generating test cases using Jest's `expect` assertions. They focus on clarity, readability, and best practices to make tests easier to understand and debug. Follow these strictly when handling `expect` calls.

## Key Guidelines
- **Extract Complex Expressions**: Always extract any complex expression (e.g., array methods like `map`, `filter`, `every` with callbacks, chained calls, or calculations) from inside `expect()` to a `const` variable declared right before the assertion. Use descriptive camelCase names (e.g., `mappedUserIds`, `filteredActiveItems`).
    - Bad: `expect(array.map(item => item.id)).toEqual([1, 2, 3]);`
    - Good: `const mappedUserIds = array.map(item => item.id); expect(mappedUserIds).toEqual([1, 2, 3]);`

Follow these to ensure assertions are clean and maintainable. If generating a test, apply them to all `expect` usages.
