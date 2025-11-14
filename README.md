# Mezcode

An extensible, lesson-based coding game platform for learning to code through hands-on practice.

## Features

- **Interactive Code Editor**: CodeMirror-powered editor with syntax highlighting
- **Live Preview**: See your code execute in real-time
- **Test-Driven Learning**: Step-by-step progression with automated tests
- **Progress Tracking**: Your progress is saved locally
- **Modular Lessons**: Easy to add new coding topics

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Project Structure

- `src/components/` - React components (flattened structure)
- `src/lessons/` - Lesson definitions and content
- `src/services/` - Core services (lesson loading, test running, etc.)
- `src/store/` - Zustand state management
- `src/hooks/` - Custom React hooks

## Adding Lessons

Lessons are stored in `src/lessons/` with the following structure:

```
lesson-name/
  ├── lesson.json          # Lesson metadata
  ├── step1.json           # Step 1 metadata
  ├── step1.starter.js     # Step 1 starter code
  ├── step1.test.js        # Step 1 tests
  ├── step1.solution.js    # Step 1 solution
  ├── step1.hint.md        # Step 1 hint
  └── ...
```

Register your lesson in `src/lessons/index.js`.

## Deployment

This project is configured for Netlify deployment. The `netlify.toml` file contains the build configuration.

## Tech Stack

- React 18
- Vite
- CodeMirror 6
- Zustand
- Tailwind CSS
- Jest (for test execution)

## License

MIT

