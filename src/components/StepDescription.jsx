export default function StepDescription({ stepData }) {
  if (!stepData) return null

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-white mb-2">
        Step {stepData.number}: {stepData.title}
      </h3>
      {stepData.description && (
        <p className="text-gray-300">{stepData.description}</p>
      )}
    </div>
  )
}

