'use client'

import React from 'react'

interface ArticleBodyProps {
  content: string
  className?: string
}

export function ArticleBody({ content, className = '' }: ArticleBodyProps) {
  // Content is stored as HTML in the database, render it with proper styling
  return (
    <div
      className={`
        prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
        prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-4
        prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-4
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
        prose-li:text-gray-700
        prose-strong:font-bold prose-strong:text-gray-900
        prose-em:italic
        prose-blockquote:border-l-4 prose-blockquote:border-purple-300 prose-blockquote:bg-purple-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:text-gray-700
        prose-code:bg-gray-100 prose-code:text-red-600 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:mb-4
        prose-a:text-purple-700 prose-a:underline hover:prose-a:text-purple-900
        prose-img:rounded-lg prose-img:my-6
        prose-table:w-full prose-table:border-collapse prose-table:my-6
        prose-th:border prose-th:border-gray-200 prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
        prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2
        prose-hr:my-8 prose-hr:border-gray-200
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
