import React, { useState } from 'react';
import Chatbot from '../../pages/chatbot/chatbot';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="chat-widget"
        onClick={handleToggle}
        aria-label="Abrir Assistente Virtual"
        title="Assistente Virtual - Tire suas dúvidas sobre viagens"
      >
        <img 
          src="/Chatbot.ico" 
          alt="Chatbot" 
          className="chat-widget-icon"
        />
        <span className="chat-widget-text">Assistente Virtual</span>
      </button>
      
      {isOpen && <Chatbot onClose={handleClose} />}
    </>
  );
};

export default ChatWidget;
