# jqnode Examples

Comprehensive, runnable examples for all jqnode methods.

## 📁 Structure

```
examples/
├── README.md (this file)
├── basic-usage.ts              ← Start here!
├── comprehensive-methods-demo.ts
│
├── content/                     ← HTML/text manipulation
├── attributes/                  ← Classes & attributes
├── data/                        ← Data storage
├── traversal/                   ← DOM navigation
├── filtering/                   ← Element filtering
├── insertion/                   ← DOM modification
├── iteration/                   ← Looping methods
└── miscellaneous/               ← Utility methods
```

## 🚀 Quick Start

### Run Any Example

```bash
npx ts-node examples/basic-usage.ts
npx ts-node examples/content/toJSON-usage.ts
npx ts-node examples/attributes/addClass-usage.ts
```

### Run by Category

```bash
# Content manipulation
npx ts-node examples/content/html-usage.ts
npx ts-node examples/content/text-usage.ts

# Attributes
npx ts-node examples/attributes/attr-usage.ts

# Data storage
npx ts-node examples/data/data-usage.ts

# Traversal
npx ts-node examples/traversal/traversal-usage.ts

# And more...
```

## 📚 Examples by Category

### Content (`/content`)

- **html-usage.ts** - Get/set HTML content
- **text-usage.ts** - Get/set text content
- **normalizedText-usage.ts** - Get/set text with whitespace normalization (12 examples)
- **toJSON-usage.ts** - Convert tables to JSON (9 examples)
- **findTableWithHeader-usage.ts** - Find tables by headers
- **title-usage.ts** - Get document title

### Attributes (`/attributes`)

- **attr-usage.ts** - Get/set attributes (11 examples)
- **addClass-usage.ts** - Add CSS classes (12 examples)
- **class-methods-usage.ts** - removeClass, toggleClass, hasClass

### Data (`/data`)

- **data-usage.ts** - Store/retrieve data (12 examples)

### Traversal (`/traversal`)

- **traversal-usage.ts** - find, filter, children, parent
- **navigation-usage.ts** - siblings, next, prev, eq, first, last
- **advanced-usage.ts** - map, closest, combinations

### Insertion (`/insertion`)

- **form-and-dom-usage.ts** - val, prop, append, remove

### Iteration (`/iteration`)

- **each-usage.ts** - Iterate over elements (12 examples)

## 🎯 Examples by Use Case

### I want to...

**Manipulate content**
→ `content/html-usage.ts`, `content/text-usage.ts`

**Work with CSS classes**
→ `attributes/addClass-usage.ts`, `attributes/class-methods-usage.ts`

**Extract table data**
→ `content/toJSON-usage.ts`

**Navigate the DOM**
→ `traversal/traversal-usage.ts`, `traversal/navigation-usage.ts`

**Store custom data**
→ `data/data-usage.ts`

**Loop through elements**
→ `iteration/each-usage.ts`

**Work with forms**
→ `insertion/form-and-dom-usage.ts`

**See everything**
→ `comprehensive-methods-demo.ts`

## 📖 Example Format

Each example file includes:

1. **Clear section headers** for each example
2. **Console output** showing results
3. **Progressive complexity** from basic to advanced
4. **Real-world use cases**
5. **Comments** explaining key concepts

## 💡 Tips

### Running Examples

```bash
# Single example
npx ts-node examples/content/html-usage.ts

# Watch for changes (if you have nodemon)
nodemon --exec "npx ts-node" examples/content/html-usage.ts
```

### Enable Debug Mode

```bash
# See internal jqnode debug logs
set JQNODE_DEBUG=true
npx ts-node examples/basic-usage.ts
```

### Modify and Experiment

All examples are self-contained. Feel free to:

- Modify the HTML
- Change the selectors
- Add your own examples
- Test edge cases

## 📦 What's Included

### Comprehensive Examples (10+ examples each)

- `attr-usage.ts` - 11 examples
- `addClass-usage.ts` - 12 examples
- `each-usage.ts` - 12 examples
- `data-usage.ts` - 12 examples
- `toJSON-usage.ts` - 9 examples

### Quick Demos

- `basic-usage.ts` - Getting started
- `comprehensive-methods-demo.ts` - 20+ methods overview

### Category Examples

- Individual files for each major method category
- Combined demos showing method interactions

## 🔗 Related

- **Documentation**: See `/docs/` for detailed method documentation
- **API Reference**: See `/docs/guides/QUICK_REFERENCE.md`
- **Tests**: See `/test/` for comprehensive test suites

## 🤝 Contributing

When adding new examples:

1. Place in appropriate category folder
2. Follow existing file naming: `method-usage.ts`
3. Include 5-10 progressively complex examples
4. Add console.log statements to show output
5. Update this README

## ⚡ Performance

Examples use test HTML (not real DOM). Performance characteristics:

- HTML parsing is fast (uses parse5)
- Queries use CSS selectors
- No actual browser overhead
- Perfect for unit testing and learning

---

**Quick Links:**
[Basic Usage](./basic-usage.ts) |
[Documentation](/docs/) |
[Project README](../README.md)
