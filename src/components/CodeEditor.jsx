import { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { lineNumbers } from '@codemirror/view'
import { useLessonStore } from '../store/lessonStore'

export default function CodeEditor() {
  const editorRef = useRef(null)
  const viewRef = useRef(null)
  const { code, setCode } = useLessonStore()

  useEffect(() => {
    if (!editorRef.current) return

    const startState = EditorState.create({
      doc: code || '',
      extensions: [
        lineNumbers(),
        javascript({ jsx: true, typescript: false }),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString()
            setCode(newCode)
          }
        }),
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
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, []) // Only run once on mount

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

