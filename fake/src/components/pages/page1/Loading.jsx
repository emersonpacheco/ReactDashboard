import React from "react"


const Loading = ({ loading, error }) => {
    return (
<>
{loading && (
    <div className="text-center py-10">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
    </div>
  )}

  {/* Error state */}
  {error && (
    <div className="bg-red-100 p-4 rounded-lg mb-6 flex items-start">
      <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p className="text-red-700">Error: {error}</p>
    </div>
    )}
    </>
)
}

export default Loading