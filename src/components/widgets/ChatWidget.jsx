import React, {useState} from 'react';
import {MessageCircle, Send, X} from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            console.log('Message sent:', message);
            setMessage('');
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
                aria-label="Open chat"
            >
                {isOpen ? <X className="h-6 w-6"/> : <MessageCircle className="h-6 w-6"/>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 flex flex-col">
                    {/* Header */}
                    <div className="bg-red-600 text-white p-4 rounded-t-lg">
                        <h3 className="font-semibold">Chat with Speedway 146</h3>
                        <p className="text-sm text-red-100">We're here to help!</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-48">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                                Hi! Welcome to Speedway 146. How can we help you today?
                            </p>
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                            >
                                <Send className="h-4 w-4"/>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;