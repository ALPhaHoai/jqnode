# 📁 jqnode Documentation Structure

## Directory Organization

```
docs/
│
├── 📄 README.md                    ← You are here - Main documentation index
│
├── 📂 guides/                      ← Overview & Reference Guides
│   ├── QUICK_REFERENCE.md          - Complete syntax for all 51+ methods
│   ├── DOCUMENTATION_SUMMARY.md    - Project documentation overview
│   └── README.md                   - Original index (deprecated, see main README.md)
│
├── 📂 content/                     ← Content Manipulation (5 methods)
│   ├── html.md                     - Get/set HTML content
│   ├── text.md                     - Get/set text content
│   ├── toJSON.md              - Convert tables to JSON
│   ├── findTableWithHeader.md     - Find tables by headers
│   └── title-method.md            - Get document title
│
├── 📂 attributes/                  ← Attributes & Classes (8 methods)
│   ├── attr.md                     - Get/set HTML attributes
│   ├── prop.md                     - Get/set DOM properties
│   ├── val.md                      - Get/set form values
│   ├── css.md                      - Get/set CSS styles
│   ├── addClass.md                 - Add CSS classes
│   ├── removeClass.md              - Remove CSS classes
│   ├── toggleClass.md              - Toggle CSS classes
│   └── hasClass.md                 - Check for CSS class
│
├── 📂 data/                        ← Data Storage (1 method)
│   └── data.md                     - Store/retrieve arbitrary data
│
├── 📂 traversal/                   ← DOM Traversal (6 methods)
│   ├── find.md                     - Find descendants
│   ├── children.md                 - Get immediate children
│   ├── parent.md                   - Get immediate parent
│   ├── closest.md                  - Get closest ancestor
│   ├── siblings.md                 - Get all siblings
│   └── next-prev.md                - Get next/previous sibling
│
├── 📂 filtering/                   ← Element Filtering (3 methods)
│   ├── filter.md                   - Filter by selector/function
│   ├── eq.md                       - Get element at index
│   └── first-last.md               - Get first/last elements
│
├── 📂 insertion/                   ← DOM Insertion/Removal (2 methods)
│   ├── append.md                   - Insert content at end
│   └── remove.md                   - Remove elements from DOM
│
├── 📂 iteration/                   ← Iteration Methods (2 methods)
│   ├── each.md                     - Iterate over elements
│   └── map.md                      - Map elements to array
│
└── 📂 miscellaneous/               ← Utility Methods (0 methods)
    └── (reserved for future utility method docs)
```

## 📊 Statistics

- **Total Categories**: 9
- **Total Methods Documented**: 26
- **Methods in Quick Reference**: 51+
- **Example Files**: 16

## 🎯 Quick Navigation

### By Category
- [Content Methods](./content/) - HTML, text, tables
- [Attribute Methods](./attributes/) - Classes, attributes, properties
- [Data Methods](./data/) - Data storage
- [Traversal Methods](./traversal/) - Navigate DOM tree
- [Filtering Methods](./filtering/) - Filter element sets
- [Insertion Methods](./insertion/) - Add/remove elements
- [Iteration Methods](./iteration/) - Loop through elements

### Common Tasks
- **Modify content**: → `content/html.md`, `content/text.md`
- **Add/remove classes**: → `attributes/addClass.md`, `attributes/removeClass.md`
- **Navigate DOM**: → `traversal/parent.md`, `traversal/find.md`, `traversal/closest.md`
- **Loop elements**: → `iteration/each.md`, `iteration/map.md`
- **Filter elements**: → `filtering/filter.md`, `filtering/first-last.md`
- **Work with forms**: → `attributes/val.md`, `attributes/prop.md`
- **Store data**: → `data/data.md`

## 📖 Documentation Levels

### ⭐ Comprehensive (Full Docs + Examples)
These have detailed documentation AND runnable example files:
- content/toJSON.md
- content/findTableWithHeader.md
- content/title-method.md
- content/html.md
- content/text.md
- attributes/attr.md
- attributes/addClass.md
- data/data.md
- iteration/each.md

### 📄 Documented (Concise Docs)
These have concise documentation files:
- All other .md files in category folders

### 📚 Quick Reference Only
Methods not yet documented individually but covered in:
- `guides/QUICK_REFERENCE.md`

## 🚀 Getting Started

### 1. Quick Syntax Lookup
→ See **[guides/QUICK_REFERENCE.md](./guides/QUICK_REFERENCE.md)**

### 2. Learn a Specific Method
→ Navigate to category folder → Open method file

### 3. See Examples
→ Go to `/examples/` directory → Run example files

### 4. Understand the Project
→ See **[guides/DOCUMENTATION_SUMMARY.md](./guides/DOCUMENTATION_SUMMARY.md)**

## 🔄 Updates

This structure was reorganized on 2025-11-20 to improve:
- ✅ Navigation and discoverability
- ✅ Logical grouping of related methods
- ✅ Scalability for future documentation
- ✅ Alignment with method implementation structure

## 📞 Need Help?

- Browse by category (folders above)
- Check Quick Reference for all methods
- Run example files for hands-on learning
- See main [project README](../README.md)

---

**Documentation Version**: 2.0 (Organized Structure)  
**Last Updated**: November 2025
