# QuackBook

QuackBook is an interactive SQL notebook powered by DuckDB WASM, enabling users to run SQL queries, analyze data, and
explore insights directly in the browser without the need for a backend.

### Motivation

Honestly? Because DuckDB changed the way I work with data. Though I'm not a data scientist, my day-to-day work involves a lot of data manipulation, often through pandas in Jupyter
notebooks.

But I'm an SQL enthusiast at heart, and while pandas has its place, SQL just feels like home. This project stems from that preference, along with a healthy dose of curiosity and a
desire to deepen my understanding. Sure, there are other similar tools out there, some even free. But I wanted to build my own as part of my learning journey.

### What can you do with QuackBook?

QuackBook offers multiple execution environments for your SQL queries:
- **DuckDB WASM**: Run queries directly in your browser
- **PGLite (WASM)**: PostgreSQL compatibility in the browser
- **Local DuckDB**: Connect to DuckDB on your system using [quack server](https://github.com/andreitere/quack)

Pretty much whatever you can imagine combining SQL and markdown!

QuackBook is not just for running SQL in the browser—it's also a learning tool.

For instance, you can find a quick (yet, unpolished) tutorial on left joins here. The interface offers two types of cells: markdown and SQL, so feel free to combine explanations with code.

To explore available commands, just press `CMD/CTRL + K`.

And if you import or create tables or attach other databases, you can even inspect schemas with `CMD/CTRL + SHIFT + E`.

### Features

- **Interactive SQL Execution**: Run queries in multiple environments
- **Markdown Support**: Document your analysis alongside your code
- **Keyboard Shortcuts**:
  - `CMD/CTRL + K`: Explore available commands
  - `CMD/CTRL + SHIFT + E`: Inspect database schemas
- **Data Import**: Import or create tables and attach other databases
- **Schema Inspection**: Easily view and explore your database structure

> [!NOTE]
> 1. I started this project sometime last year. While, in the meantime, DuckDB also launched its own web-based SQL editor, this project remains a valuable learning experience and a testament to the power of DuckDB in the browser — and, to be fair, it includes some additional goodies.
> 2. this is a toy project built mostly to keep my passion for frontend development alive and keep up with latest technologies available. expect bugs 🤓

![QuackBook Screenshot](/demos/app-1.jpeg)
