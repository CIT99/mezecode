import ReactMarkdown from 'react-markdown'

export default function StepDescription({ stepData }) {
  if (!stepData) return null

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">
        Step {stepData.number}: {stepData.title}
      </h2>
      {stepData.description && (
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code: ({ node, inline, ...props }) => (
                <code
                  className={`${
                    inline
                      ? 'bg-gray-800 px-1.5 py-0.5 rounded text-blue-300'
                      : 'block bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto'
                  }`}
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto" {...props} />
              ),
              p: ({ node, ...props }) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-white" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300" {...props} />,
              li: ({ node, ...props }) => <li className="ml-4" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
            }}
          >
            {stepData.description}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

