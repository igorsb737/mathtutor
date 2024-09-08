import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCamera } from 'react-icons/fa';
import './ProfessorPasquale.css';

function ProfessorPasquale() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const IMGBB_API_KEY = '8efb93b7c4f690b5433c7a5d4c3dbf3d';

  useEffect(() => {
    let id = localStorage.getItem('pasqualeSessionId') || `session_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('pasqualeSessionId', id);
    setSessionId(id);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        if (data.data?.url) {
          setImageUrl(data.data.url);
        } else {
          throw new Error('URL da imagem não encontrada na resposta');
        }
      } catch (error) {
        setError('Falha ao fazer upload da imagem. Por favor, tente novamente.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnswer('');
    
    if (isUploading) {
      setError('Aguarde o upload da imagem terminar antes de enviar.');
      return;
    }
    
    try {
      const response = await fetch('https://n8n.apoioservidoria.top/webhook-test/bef909b0-a6fb-4470-a1e8-2c7941c4c402', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId, urlimagem: imageUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setError('Resposta recebida, mas sem conteúdo esperado.');
      }
    } catch (error) {
      setError('Ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.');
    }
  };

  return (
    <motion.div 
      className="pasquale-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="pasquale-title">Professor Pasquale</h1>
      <motion.div 
        className="pasquale-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="pasquale-form">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua dúvida aqui..."
            className="pasquale-input"
          />
          <div className="pasquale-file-inputs">
            <label className="pasquale-file-button">
              <FaUpload /> Enviar Imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="pasquale-file-input"
              />
            </label>
            <label className="pasquale-file-button">
              <FaCamera /> Tirar Foto
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="pasquale-file-input"
              />
            </label>
          </div>
          {isUploading && <p className="pasquale-uploading">Fazendo upload da imagem...</p>}
          {imageUrl && (
            <img src={imageUrl} alt="Imagem enviada" className="pasquale-preview-image" />
          )}
          <motion.button 
            type="submit" 
            className="pasquale-button" 
            disabled={isUploading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            APRENDER
          </motion.button>
        </form>
        <div className="pasquale-response">
          {error && <p className="pasquale-error">{error}</p>}
          {answer && <p className="pasquale-answer">{answer}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProfessorPasquale;