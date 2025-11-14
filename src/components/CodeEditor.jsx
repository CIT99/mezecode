import { useEffect, useRef } from 'react'
import { EditorView, lineNumbers, highlightActiveLine, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { indentUnit, foldGutter, foldKeymap, bracketMatching } from '@codemirror/language'
import { 
  defaultKeymap, 
  history, 
  historyKeymap,
  indentWithTab
} from '@codemirror/commands'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { useLessonStore } from '../store/lessonStore'
import { useThemeStore } from '../store/themeStore'

// Light theme with syntax highlighting
const lightTheme = EditorView.theme({
  '&': {
    color: '#333',
    backgroundColor: '#fff',
  },
  '.cm-content': {
    caretColor: '#333',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#333',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#b3d4fc',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#b3d4fc',
  },
  '.cm-lineNumbers': {
    color: '#999',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    minWidth: '3ch',
  },
  '.cm-activeLine': {
    backgroundColor: '#f5f5f5',
  },
  '.cm-gutters': {
    backgroundColor: '#f8f8f8',
    borderRight: '1px solid #e0e0e0',
  },
  '.cm-focused .cm-gutters': {
    backgroundColor: '#f8f8f8',
  },
}, { dark: false })

// Syntax highlighting colors for light mode
const lightHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#d73a49', fontWeight: 'bold' },
  { tag: tags.string, color: '#032f62' },
  { tag: tags.number, color: '#005cc5' },
  { tag: tags.comment, color: '#6a737d', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#e36209' },
  { tag: tags.function(tags.variableName), color: '#6f42c1' },
  { tag: tags.operator, color: '#d73a49' },
  { tag: tags.punctuation, color: '#333' },
  { tag: tags.bracket, color: '#333' },
  { tag: tags.tagName, color: '#22863a' },
  { tag: tags.attributeName, color: '#6f42c1' },
  { tag: tags.className, color: '#6f42c1' },
  { tag: tags.propertyName, color: '#005cc5' },
  { tag: tags.constant, color: '#005cc5' },
  { tag: tags.definition(tags.variableName), color: '#e36209' },
  { tag: tags.self, color: '#005cc5' },
])

export default function CodeEditor() {
  const editorRef = useRef(null)
  const viewRef = useRef(null)
  const { code, setCode } = useLessonStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    if (!editorRef.current) return

    // Destroy existing view if it exists
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const extensions = [
      // Basic editor features
      lineNumbers(),
      highlightActiveLine(),
      history(),
      
      // Language support
      javascript({ jsx: true, typescript: false }),
      
      // Indentation
      indentUnit.of('  '), // 2 spaces
      
      // Bracket matching and auto-closing
      bracketMatching(),
      closeBrackets(),
      
      // Code folding
      foldGutter(),
      
      // Autocomplete
      autocompletion({
        activateOnTyping: true,
        maxRenderedOptions: 10,
        defaultKeymap: true,
      }),
      
      // Keymaps
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab, // Tab key for indentation
      ]),
      
      // Update listener
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newCode = update.state.doc.toString()
          setCode(newCode)
        }
      }),
      
      // Theme customization
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-scroller': {
          overflow: 'auto',
          height: '100%',
        },
        '.cm-focused': {
          outline: 'none',
        },
      }),
    ]

    // Apply theme based on current theme
    if (theme === 'dark') {
      extensions.push(oneDark)
    } else {
      // Light theme with syntax highlighting
      extensions.push(lightTheme)
      extensions.push(syntaxHighlighting(lightHighlightStyle))
    }

    const startState = EditorState.create({
      doc: code || '',
      extensions,
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [theme]) // Recreate when theme changes

  // Update editor content when code changes externally
  useEffect(() => {
    if (viewRef.current && code !== undefined) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== code) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: code,
          },
        })
      }
    }
  }, [code])

  return (
    <div className="h-full w-full">
      <div ref={editorRef} className="h-full w-full" />
    </div>
  )
}

