import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';


const Chatbot = ({ onClose }) => {
    const [mensagens, setMensagens] = useState([
        { text: 'Oi! Tudo bem? Como posso te ajudar com sua viagem hoje?', isAi: true }
    ]);
    const [mensagemAtual, setMensagemAtual] = useState('');
    const [carregando, setCarregando] = useState(false);
    const fimDasMensagens = useRef(null);

    const rolarParaBaixo = () => {
        fimDasMensagens.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Função para formatar o texto com quebras de linha e markdown
    const formatarTexto = (texto) => {
        // Divide o texto em linhas
        const linhas = texto.split('\n');
        
        return linhas.map((linha, index) => {
            // Remove espaços no início e fim da linha
            let linhaTrimmed = linha.trim();
            
            // Verifica se é um item de lista (começa com * ou -)
            if (linhaTrimmed.startsWith('* ') || linhaTrimmed.startsWith('- ')) {
                const textoLista = linhaTrimmed.substring(2);
                return (
                    <div key={index} className="list-item">
                        <span className="bullet">•</span>
                        <span dangerouslySetInnerHTML={{ __html: processarMarkdown(textoLista) }} />
                    </div>
                );
            }
            
            // Verifica se é uma linha vazia (para criar espaçamento)
            if (linhaTrimmed === '') {
                return <div key={index} className="paragraph-break"></div>;
            }
            
            // Linha normal - processa markdown
            return (
                <React.Fragment key={index}>
                    <span dangerouslySetInnerHTML={{ __html: processarMarkdown(linhaTrimmed) }} />
                    {index < linhas.length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    // Função para processar markdown básico (negrito, itálico)
    const processarMarkdown = (texto) => {
        return texto
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // **negrito**
            .replace(/\*(.+?)\*/g, '<em>$1</em>')              // *itálico*
            .replace(/_(.+?)_/g, '<em>$1</em>');               // _itálico_
    };

    useEffect(() => {
        rolarParaBaixo();
    }, [mensagens]);

    const enviarMensagem = async (e) => {
        e.preventDefault();
        if (!mensagemAtual.trim()) return;

        const novaMensagem = { text: mensagemAtual, isAi: false };
        setMensagens(antigas => [...antigas, novaMensagem]);
        const textoEnviado = mensagemAtual;
        setMensagemAtual('');
        setCarregando(true);

        try {
            const resposta = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textoEnviado,
                    context: mensagens.slice(-5).map(m => ({ text: m.text, isAi: m.isAi }))
                })
            });

            if (!resposta.ok) {
                throw new Error('Ops! Algo deu errado');
            }

            const dados = await resposta.json();
            setMensagens(antigas => [...antigas, { text: dados.response, isAi: true }]);
        } catch (erro) {
            console.error('Erro:', erro);
            setMensagens(antigas => [...antigas, { 
                text: 'Desculpe, tive um problema aqui! Pode tentar de novo?', 
                isAi: true 
            }]);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="chatbot-overlay" onClick={onClose}>
            <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
                <div className="chat-popup">
                    <div className="chat-header">
                        <div className="head-info">
                            <img src="/public/Chatbot.ico" alt="Viajante+" className="chat-icon" />
                            <h2 className="logo-text">Viajante+</h2>
                            <button className='close-button' onClick={onClose}>
                                <span className="arrow-down"></span>
                            </button>
                        </div>
                    </div>
                <div className="chat-messages">
                    {mensagens.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.isAi ? 'ai' : 'user'}`}>
                            {msg.isAi && (
                                <div className="ai-avatar">
                                    <img src="/public/Chatbot.ico" alt="Viajante+" />
                                </div>
                            )}
                            <div className="message-content">
                                {formatarTexto(msg.text)}
                            </div>
                        </div>
                    ))}
                    {carregando && (
                        <div className="message ai">
                            <div className="ai-avatar">
                                <img src="/public/Chatbot.ico" alt="Viajante+" />
                            </div>
                            <div className="message-content typing">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={fimDasMensagens} />
                </div>
                <form onSubmit={enviarMensagem} className="chat-input">
                    <input
                        type="text"
                        value={mensagemAtual}
                        onChange={(e) => setMensagemAtual(e.target.value)}
                        placeholder="Como posso te ajudar com sua viagem?🌎"
                        disabled={carregando}
                    />
                    <button 
                        type="submit" 
                        disabled={carregando || !mensagemAtual.trim()}
                        className="send-button"
                    >
                        <span className="material-symbols-outlined">Enviar</span>
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};



export default Chatbot;
