import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatbot.css';


const Chatbot = ({ aoFechar }) => {
    const navegar = useNavigate();
    const [mensagens, setMensagens] = useState([
        { texto: 'Olá! 👋 Sou o Viajante+, seu assistente de viagens! Estou aqui para te ajudar a planejar sua próxima aventura.\n\nPosso te auxiliar com:\n* Criar e planejar novas viagens\n* Sugestões de destinos e roteiros\n* Dicas sobre hospedagem, alimentação e transporte\n* Informações sobre documentação e melhor época para viajar\n\nComo posso te ajudar hoje? 🌍✈️', ehIA: true }
    ]);
    const [mensagemAtual, setMensagemAtual] = useState('');
    const [carregando, setCarregando] = useState(false);
    const fimDasMensagens = useRef(null);

    const rolarParaBaixo = () => {
        fimDasMensagens.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Função para formatar o texto com quebras de linha e markdown
    const formatarTexto = (texto) => {
        // Primeiro, processa os botões
        const partes = texto.split(/(\[BOTAO:\/[^\]]+\][^\[]+\[\/BOTAO\])/g);
        
        return partes.map((parte, parteIndex) => {
            // Verifica se é um botão
            const botaoMatch = parte.match(/\[BOTAO:(\/[^\]]+)\]([^\[]+)\[\/BOTAO\]/);
            if (botaoMatch) {
                const rota = botaoMatch[1];
                const textoBotao = botaoMatch[2];
                return (
                    <button
                        key={`botao-${parteIndex}`}
                        className="botao-acao-chat"
                        onClick={() => {
                            navegar(rota);
                            aoFechar();
                        }}
                    >
                        {textoBotao}
                    </button>
                );
            }
            
            // Se não é botão, processa como texto normal
            const linhas = parte.split('\n');
            
            return linhas.map((linha, index) => {
                // Remove espaços no início e fim da linha
                let linhaTrimmed = linha.trim();
                
                // Verifica se é um item de lista (começa com * ou -)
                if (linhaTrimmed.startsWith('* ') || linhaTrimmed.startsWith('- ')) {
                    const textoLista = linhaTrimmed.substring(2);
                    return (
                        <div key={`${parteIndex}-${index}`} className="item-lista">
                            <span className="marcador">•</span>
                            <span dangerouslySetInnerHTML={{ __html: processarMarkdown(textoLista) }} />
                        </div>
                    );
                }
                
                // Verifica se é uma linha vazia (para criar espaçamento)
                if (linhaTrimmed === '') {
                    return <div key={`${parteIndex}-${index}`} className="quebra-paragrafo"></div>;
                }
                
                // Linha normal - processa markdown
                return (
                    <React.Fragment key={`${parteIndex}-${index}`}>
                        <span dangerouslySetInnerHTML={{ __html: processarMarkdown(linhaTrimmed) }} />
                        {index < linhas.length - 1 && <br />}
                    </React.Fragment>
                );
            });
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

        const novaMensagem = { texto: mensagemAtual, ehIA: false };
        setMensagens(antigas => [...antigas, novaMensagem]);
        const textoEnviado = mensagemAtual;
        setMensagemAtual('');
        setCarregando(true);

        try {
            const resposta = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textoEnviado,
                    context: mensagens.slice(-5).map(m => ({ text: m.texto, isAi: m.ehIA }))
                })
            });

            if (!resposta.ok) {
                throw new Error('Ops! Algo deu errado');
            }

            const dados = await resposta.json();
            setMensagens(antigas => [...antigas, { texto: dados.response, ehIA: true }]);
        } catch (erro) {
            console.error('Erro:', erro);
            setMensagens(antigas => [...antigas, { 
                texto: 'Desculpe, tive um problema aqui! Pode tentar de novo?', 
                ehIA: true 
            }]);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="sobreposicao-chatbot" onClick={aoFechar}>
            <div className="container-chatbot" onClick={(e) => e.stopPropagation()}>
                <div className="popup-chat">
                    <div className="cabecalho-chat">
                        <div className="info-cabecalho">
                            <img src="/Chatbot.ico" alt="Viajante+" className="icone-chat" />
                            <h2 className="texto-logo">Viajante+</h2>
                            <button className='botao-fechar' onClick={aoFechar}>
                                <span className="seta-baixo"></span>
                            </button>
                        </div>
                    </div>
                <div className="mensagens-chat">
                    {mensagens.map((msg, idx) => (
                        <div key={idx} className={`mensagem ${msg.ehIA ? 'ia' : 'usuario'}`}>
                            {msg.ehIA && (
                                <div className="avatar-ia">
                                    <img src="/Chatbot.ico" alt="Viajante+" />
                                </div>
                            )}
                            <div className="conteudo-mensagem">
                                {formatarTexto(msg.texto)}
                            </div>
                        </div>
                    ))}
                    {carregando && (
                        <div className="mensagem ia">
                            <div className="avatar-ia">
                                <img src="/Chatbot.ico" alt="Viajante+" />
                            </div>
                            <div className="conteudo-mensagem digitando">
                                <div className="indicador-digitacao">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={fimDasMensagens} />
                </div>
                <form onSubmit={enviarMensagem} className="entrada-chat">
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
                        className="botao-enviar"
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
