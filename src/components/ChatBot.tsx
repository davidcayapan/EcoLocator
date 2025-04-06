import React, { useState } from 'react';
import { MessageCircle, X, Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { sendMessage } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm your sustainability assistant. How can I help you today?", isUser: false }
  ]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[#*`_]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Microsoft Zira') || 
      voice.lang === 'en-US'
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        handleSubmit(new Event('submit'));
      };

      recognition.onerror = (event: Event & { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: Event | React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      const response = await sendMessage(userMessage);
      if (response) {
        setMessages(prev => [...prev, { text: response, isUser: false }]);
        speak(response);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      let errorMessage = "I apologize, but I'm having trouble connecting to the AI service. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes('Rate limit exceeded')) {
          errorMessage = "I'm receiving too many requests right now. Please wait a moment before trying again.";
        } else if (error.message.includes('API key')) {
          errorMessage = "There's an issue with the AI service configuration. Please contact support.";
        }
      }
      
      setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 ease-in-out"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Sustainability Assistant</h3>
            <div className="flex gap-2">
              <button
                onClick={isSpeaking ? stopSpeaking : () => speak(messages[messages.length - 1]?.text || '')}
                className="text-white hover:text-green-200 transition-colors"
                title={isSpeaking ? "Stop speaking" : "Speak last message"}
              >
                {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.isUser ? (
                    msg.text
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-sm max-w-none"
                      components={{
                        p: ({children, ...props}) => <p className="mb-2 last:mb-0" {...props}>{children}</p>,
                        ul: ({children, ...props}) => <ul className="list-disc ml-4 mb-2" {...props}>{children}</ul>,
                        ol: ({children, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props}>{children}</ol>,
                        li: ({children, ...props}) => <li className="mb-1" {...props}>{children}</li>,
                        h1: ({children, ...props}) => <h1 className="text-lg font-bold mb-2" {...props}>{children}</h1>,
                        h2: ({children, ...props}) => <h2 className="text-md font-bold mb-2" {...props}>{children}</h2>,
                        h3: ({children, ...props}) => <h3 className="text-sm font-bold mb-2" {...props}>{children}</h3>,
                        strong: ({children, ...props}) => <strong className="font-bold" {...props}>{children}</strong>,
                        em: ({children, ...props}) => <em className="italic" {...props}>{children}</em>,
                        code: ({children, ...props}) => <code className="bg-gray-200 px-1 rounded" {...props}>{children}</code>,
                        blockquote: ({children, ...props}) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props}>{children}</blockquote>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-green-500"
                disabled={isLoading || isListening}
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
              <button
                type="submit"
                className={`bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}