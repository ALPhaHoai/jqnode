# jqnode Documentation

Comprehensive documentation for all jqnode methods, organized by category.

## 📁 Documentation Structure

```
docs/
├── guides/              # Overview and reference guides
├── content/             # HTML/text content methods
├── attributes/          # Class and attribute methods
├── data/                # Data storage methods
├── traversal/           # DOM traversal methods
├── filtering/           # Element filtering methods
├── insertion/           # DOM insertion/removal methods
├── iteration/           # Iteration methods
└── miscellaneous/       # Utility methods
```

## 📚 Quick Access

### Getting Started
- **[Quick Reference](./guides/QUICK_REFERENCE.md)** - Syntax for all 51+ methods
- **[Documentation Summary](./guides/DOCUMENTATION_SUMMARY.md)** - Complete overview
- **[Overview](./guides/README.md)** - Documentation index

- **[val()](./attributes/val.md)** - Get/set form values
- **[addClass()](./attributes/addClass.md)** - Add CSS classes
- **[removeClass()](./attributes/removeClass.md)** - Remove CSS classes
- **[toggleClass()](./attributes/toggleClass.md)** - Toggle CSS classes
- **[hasClass()](./attributes/hasClass.md)** - Check for CSS class

### Data Storage (`/data`)
Store and retrieve custom data:
- **[data()](./data/data.md)** - Store/retrieve arbitrary data

### Traversal (`/traversal`)
Navigate the DOM tree:
- **[find()](./traversal/find.md)** - Find descendants
- **[children()](./traversal/children.md)** - Get immediate children
- **[parent()](./traversal/parent.md)** - Get immediate parent
- **[closest()](./traversal/closest.md)** - Get closest ancestor
- **[siblings()](./traversal/siblings.md)** - Get all siblings
- **[next(), prev()](./traversal/next-prev.md)** - Get adjacent siblings

### Filtering (`/filtering`)
Filter and reduce element sets:
- **[filter()](./filtering/filter.md)** - Filter by selector/function
- **[eq()](./filtering/eq.md)** - Get element at index
- **[first(), last()](./filtering/first-last.md)** - Get first/last elements

### DOM Insertion (`/insertion`)
Add or remove elements:
- **[append()](./insertion/append.md)** - Insert content at end
- **[remove()](./insertion/remove.md)** - Remove elements from DOM

### Iteration (`/iteration`)
Loop through elements:
- **[each()](./iteration/each.md)** - Iterate over elements
- **[map()](./iteration/map.md)** - Map elements to array

## 🎯 Finding Documentation

### By Task

**I want to...**
- **Modify content**: See [/content](./content/)
- **Work with classes**: See [/attributes](./attributes/)
- **Navigate elements**: See [/traversal](./traversal/)
- **Filter elements**: See [/filtering](./filtering/)
- **Loop through elements**: See [/iteration](./iteration/)
- **Add/remove elements**: See [/insertion](./insertion/)
- **Store custom data**: See [/data](./data/)

### By Method Name

All methods are alphabetically accessible within their category folders. Use the table above to find the category, then browse the folder.

## 📝 Documentation Format

Each method documentation includes:

1. **Overview** - Brief description and purpose
2. **Syntax** - Method signatures and parameters
3. **Parameters** - Detailed parameter descriptions
4. **Return Value** - What the method returns
5. **Examples** - Code examples (basic to advanced)
6. **Use Cases** - Real-world applications
7. **Related Methods** - Similar or complementary methods
8. **Tips** - Best practices and gotchas

## 🚀 Examples

All methods have corresponding example files in `/examples/` directory:

```bash
# Run any example
node examples/method-name-usage.js

# Examples by category
node examples/attr-usage.js        # Attributes
node examples/each-usage.js        # Iteration
node examples/traversal-usage.js   # DOM traversal
node examples/toJSON-usage.js  # Table conversion
```

## 📊 Coverage Status

```bash
# Check documentation status
node scripts/check-docs.js
```

Current coverage:
- ✅ **100%** - All methods in Quick Reference
- 📄 **51%** - Individual documentation files (26/51)
- 💡 **16** - Complete example files

## 🔍 Search Tips

### In VS Code
- Press `Ctrl+P` (or `Cmd+P` on Mac)
- Type: `docs/method-name.md`

### From Command Line
```bash
# Find documentation
find docs -name "*method-name*"

# Search content
grep -r "search term" docs/
```

## 📱 Mobile-Friendly

All documentation is written in clean Markdown and renders well on:
- GitHub
- GitLab
- npm package pages
- Local markdown viewers

## 🔗 External Resources

- [jQuery API Documentation](https://api.jquery.com/) - jqnode maintains jQuery compatibility
- [Project GitHub](https://github.com/ALPhaHoai/jqnode)
- [npm Package](https://www.npmjs.com/package/@alphahoai/jqnode)

## 🤝 Contributing

When adding new method documentation:

1. Create the file in the appropriate category folder
2. Follow the existing documentation format
3. Add corresponding example file in `/examples/`
4. Update this README
5. Run `node scripts/check-docs.js` to verify

## 📄 License

Documentation is part of the jqnode project and follows the same license.

---

**Quick Links:**
[Quick Reference](./guides/QUICK_REFERENCE.md) |
[Examples](/examples/) |
[Main README](../README.md)
