import React, { useState } from 'react';
import Chatbot from '../../pages/chatbot/chatbot';
import './ChatWidget.css';

const ChatWidget = () => {
  const [estaAberto, setEstaAberto] = useState(false);

  const alternarVisibilidade = () => {
    setEstaAberto(!estaAberto);
  };

  const fechar = () => {
    setEstaAberto(false);
  };

  return (
    <>
      <button 
        className="widget-chat"
        onClick={alternarVisibilidade}
        aria-label="Abrir Assistente Virtual"
        title="Assistente Virtual - Tire suas dúvidas sobre viagens"
      >
        <img 
          src="/Chatbot.ico" 
          alt="Chatbot" 
          className="icone-widget-chat"
        />
        <span className="texto-widget-chat">Assistente Virtual</span>
      </button>
      
      {estaAberto && <Chatbot aoFechar={fechar} />}
    </>
  );
};

export default ChatWidget;
