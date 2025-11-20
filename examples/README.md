# jqnode Examples

Comprehensive, runnable examples for all jqnode methods.

## 📁 Structure

```
examples/
├── README.md (this file)
├── basic-usage.js              ← Start here!
├── comprehensive-methods-demo.js
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
node examples/basic-usage.js
node examples/content/toJSON-usage.js
node examples/attributes/addClass-usage.js
```

### Run by Category
```bash
# Content manipulation
node examples/content/html-usage.js
node examples/content/text-usage.js

# Attributes
node examples/attributes/attr-usage.js  

# Data storage
node examples/data/data-usage.js

# Traversal
node examples/traversal/traversal-usage.js

# And more...
```

## 📚 Examples by Category

### Content (`/content`)
- **html-usage.js** - Get/set HTML content
- **text-usage.js** - Get/set text content
- **normalizedText-usage.js** - Get/set text with whitespace normalization (12 examples)
- **toJSON-usage.js** - Convert tables to JSON (9 examples)
- **findTableWithHeader-usage.js** - Find tables by headers
- **title-usage.js** - Get document title

### Attributes (`/attributes`)
- **attr-usage.js** - Get/set attributes (11 examples)
- **addClass-usage.js** - Add CSS classes (12 examples)
- **class-methods-usage.js** - removeClass, toggleClass, hasClass

### Data (`/data`)
- **data-usage.js** - Store/retrieve data (12 examples)

### Traversal (`/traversal`)
- **traversal-usage.js** - find, filter, children, parent
- **navigation-usage.js** - siblings, next, prev, eq, first, last
- **advanced-usage.js** - map, closest, combinations

### Insertion (`/insertion`)
- **form-and-dom-usage.js** - val, prop, append, remove

### Iteration (`/iteration`)
- **each-usage.js** - Iterate over elements (12 examples)

## 🎯 Examples by Use Case

### I want to...

**Manipulate content**
→ `content/html-usage.js`, `content/text-usage.js`

**Work with CSS classes**
→ `attributes/addClass-usage.js`, `attributes/class-methods-usage.js`

**Extract table data**
→ `content/toJSON-usage.js`

**Navigate the DOM**
→ `traversal/traversal-usage.js`, `traversal/navigation-usage.js`

**Store custom data**
→ `data/data-usage.js`

**Loop through elements**
→ `iteration/each-usage.js`

**Work with forms**
→ `insertion/form-and-dom-usage.js`

**See everything**
→ `comprehensive-methods-demo.js`

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
node examples/content/html-usage.js

# Watch for changes (if you have nodemon)
nodemon examples/content/html-usage.js
```

### Enable Debug Mode
```bash
# See internal jqnode debug logs
set JQNODE_DEBUG=true
node examples/basic-usage.js
```

### Modify and Experiment
All examples are self-contained. Feel free to:
- Modify the HTML
- Change the selectors
- Add your own examples
- Test edge cases

## 📦 What's Included

### Comprehensive Examples (10+ examples each)
- `attr-usage.js` - 11 examples
- `addClass-usage.js` - 12 examples
- `each-usage.js` - 12 examples
- `data-usage.js` - 12 examples
- `toJSON-usage.js` - 9 examples

### Quick Demos
- `basic-usage.js` - Getting started
- `comprehensive-methods-demo.js` - 20+ methods overview

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
2. Follow existing file naming: `method-usage.js`
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
[Basic Usage](./basic-usage.js) |
[Documentation](/docs/) |
[Project README](../README.md)
