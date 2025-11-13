// DetalhesPaises.jsx
"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// CHAVE: O nome do arquivo CSS deve ser consistente com a sua estrutura
import './detalhes-países.css' 

// Endpoint da API REST Countries para buscar pelo nome
const API_URL_BASE = "https://restcountries.com/v3.1/name/"
const API_FIELDS = "?fullText=true&fields=name,flags,region,capital,population,currencies,languages,timezones,latlng,borders"

export default function DetalhesPaises() {
    const { countryName } = useParams()
    const navigate = useNavigate()
    
    const [country, setCountry] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!countryName) {
            setError("Nenhum país especificado.")
            setIsLoading(false)
            return
        }

        const fetchDetails = async () => {
            setIsLoading(true)
            setError(null)
            
            // Codifica o nome para URLs (necessário para nomes com espaços, como "South Africa")
            const encodedCountryName = encodeURIComponent(countryName)
            const url = `${API_URL_BASE}${encodedCountryName}${API_FIELDS}`
            
            try {
                const response = await fetch(url)
                
                if (!response.ok) {
                    throw new Error("País não encontrado ou erro de API.")
                }
                
                const data = await response.json()
                
                // A API de nome retorna um array, pegamos o primeiro resultado
                if (data && data.length > 0) {
                    setCountry(data[0])
                } else {
                    throw new Error("Dados do país inválidos.")
                }

            } catch (err) {
                console.error("Erro ao carregar detalhes:", err)
                setError("Falha ao carregar os detalhes do país. Tente novamente.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchDetails()
    }, [countryName]) 


    // --- Renderização de UI ---
    if (isLoading) {
        return <div className="detail-container loading">Carregando detalhes de {countryName}...</div>
    }

    if (error) {
        return (
            <div className="detail-container error">
                <p>⚠️ Erro: {error}</p>
                <button onClick={() => navigate('/')} className="back-btn">Voltar para a Home</button>
            </div>
        )
    }
    
    if (!country) return null; 

    // Formatação dos dados para exibição
    const capital = country.capital ? country.capital[0] : 'N/A'
    
    // Mapeia e formata moedas (ex: Real (R$), Dólar ($))
    const currencies = country.currencies 
        ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')
        : 'N/A'
        
    // Mapeia e formata idiomas (ex: Português, Inglês)
    const languages = country.languages 
        ? Object.values(country.languages).join(', ')
        : 'N/A'

    const borders = country.borders && country.borders.length > 0 ? country.borders.join(', ') : 'N/A'


    // --- Renderização do Detalhe ---
    return (
        <div className="detail-container">
            <button onClick={() => navigate(-1)} className="back-btn">
                ← Voltar
            </button>
            
            <div className="country-header">
                <img 
                    src={country.flags.png} 
                    alt={`Bandeira de ${country.name.common}`} 
                    className="country-flag"
                />
                <h1>{country.name.common}</h1>
                <p className="country-official-name">{country.name.official}</p>
            </div>
            
            <div className="country-info-grid">
                <div className="info-card">
                    <h2>Informações Principais</h2>
                    <p><strong>Região:</strong> {country.region}</p>
                    <p><strong>Capital:</strong> {capital}</p>
                    <p><strong>População:</strong> {country.population.toLocaleString('pt-BR')}</p>
                    <p><strong>Moedas:</strong> {currencies}</p>
                    <p><strong>Idiomas:</strong> {languages}</p>
                </div>
                
                <div className="info-card">
                    <h2>Geografia e Tempo</h2>
                    <p><strong>Fuso Horário:</strong> {country.timezones.join(', ')}</p>
                    <p><strong>Localização (Lat/Long):</strong> {country.latlng.join(', ')}</p>
                    <p><strong>Países Vizinhos (Bordas):</strong> {borders}</p>
                </div>
            </div>
            
        </div>
    )
}