import { useChat } from './hooks/use-chat'
import { Chat } from './ui/chat'
import { Message } from './ui/chat-message'
import { useState, useEffect } from 'react'
import { TypingIndicator } from './ui/typing-indicator'

export function ChatApp() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isGenerating,
    error,
    stop,
    append,
    reset
  } = useChat()

  // Sample prompt suggestions
  const suggestions = [
    "What is a SuperApp?",
    "Explain to me Mini-program technology",
    "How does FinClip enable SuperApps?"
  ]

  // Add a local state to track when the connection is being established
  const [isConnecting, setIsConnecting] = useState(false)

  // Handle connection state
  useEffect(() => {
    if (isLoading && messages.length === 0) {
      setIsConnecting(true)
    } else {
      setIsConnecting(false)
    }
  }, [isLoading, messages.length])

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">FinClip Agent</h1>
        {isConnecting && (
          <div className="flex items-center text-yellow-600">
            <TypingIndicator />
            <span className="text-sm ml-2">Connecting...</span>
          </div>
        )}
        {isGenerating && (
          <div className="flex items-center text-blue-600">
            <TypingIndicator />
            <span className="text-sm ml-2">Thinking...</span>
          </div>
        )}
      </header>
      
      <main className="flex-1 overflow-hidden p-4">
        <div className="mx-auto max-w-4xl h-full">
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
              Reminder: {error.message}
              <button 
                onClick={reset}
                className="ml-2 underline text-sm"
              >
                Reset
              </button>
            </div>
          )}
          
          <Chat
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={(event) => {
              if (event?.preventDefault) event.preventDefault();
              handleSubmit();
            }}
            isGenerating={isGenerating}
            stop={stop}
            append={(message) => {
              const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: message.content,
                createdAt: new Date()
              }
              append(message.content)
              return userMessage
            }}
            suggestions={suggestions}
          />
        </div>
      </main>
    </div>
  )
}
