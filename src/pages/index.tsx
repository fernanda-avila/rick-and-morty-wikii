import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiSearch, FiX } from 'react-icons/fi';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  image: string;
  episode: string[];
}

export default function Home() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        setLoading(true);
        let allCharacters: Character[] = [];
        let nextPage = 'https://rickandmortyapi.com/api/character';
        
        while (nextPage) {
          const response = await fetch(nextPage);
          if (!response.ok) throw new Error('Failed to fetch characters');
          const data = await response.json();
          allCharacters = [...allCharacters, ...data.results];
          nextPage = data.info.next;
        }

        setCharacters(allCharacters);
        setFilteredCharacters(allCharacters);
        setError(null);
      } catch (err) {
        setError('Failed to load all characters. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharacters();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(character =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchTerm, characters]);

  const handleCharacterClick = (id: number) => {
    router.push(`/character/${id}`);
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase()?.trim() || 'unknown';
    switch (normalizedStatus) {
      case 'alive': return '#00ee88';
      case 'dead': return '#ff4444';
      default: return '#888888';
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="rick-morty-app">
      <Head>
        <title>Rick and Morty Universe | Character Database</title>
        <meta name="description" content="The complete Rick and Morty character database" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header Profissional */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="app-title"
            >
              RICK AND MORTY
            </motion.h1>
            <p className="app-subtitle">Multidimensional Character Database</p>
          </div>
          
          {/* Barra de Busca Profissional */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="clear-search-button">
                  <FiX />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="search-results-count">
                {filteredCharacters.length} {filteredCharacters.length === 1 ? 'result' : 'results'} found
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Restante do código permanece igual */}
      <main className="app-main">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="loading-container">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="loading-spinner"
            />
            <p>Initializing interdimensional database...</p>
          </div>
        ) : (
          <div className="characters-grid">
            {filteredCharacters.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  y: -5,
                  backgroundColor: '#111111',
                  boxShadow: `0 8px 20px ${getStatusColor(character.status)}80`
                }}
                className="character-card"
                onClick={() => handleCharacterClick(character.id)}
              >
                <div className="character-image-container">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="character-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-character.png';
                    }}
                  />
                  <div 
                    className="character-status"
                    style={{ backgroundColor: getStatusColor(character.status) }}
                  />
                </div>
                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>
                  <div className="character-meta">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(character.status) }}
                    />
                    <span>{character.status} - {character.species}</span>
                  </div>
                  <div className="character-location">
                    <p>Last known location:</p>
                    <p>{character.location?.name || 'Unknown'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Data provided by Rick and Morty API</p>
        <p>© {new Date().getFullYear()} Interdimensional Database</p>
      </footer>

      <style jsx global>{`
        :root {
          --primary: #00ee88;
          --primary-dark: #00cc77;
          --primary-light: rgba(0, 238, 136, 0.1);
          --black: #000000;
          --black-light: #111111;
          --gray: #333333;
          --gray-light: #666666;
          --white: #ffffff;
          --red: #ff4444;
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: var(--black);
          color: var(--white);
          min-height: 100vh;
        }

        /* Header Profissional */
        .app-header {
          background: linear-gradient(135deg, var(--black) 0%, var(--gray) 100%);
          padding: 2rem 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--primary-light);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .logo-section {
          text-align: center;
        }

        .app-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(to right, var(--primary) 0%, #5e2ced 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .app-subtitle {
          color: var(--gray-light);
          margin-top: 0.5rem;
          font-size: 1rem;
          letter-spacing: 1px;
          font-weight: 400;
        }

        /* Barra de Busca Profissional */
        .search-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-light);
          font-size: 1.2rem;
        }

        .search-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 3rem;
          background: var(--black-light);
          border: 1px solid var(--gray);
          border-radius: 50px;
          color: var(--white);
          font-size: 1rem;
          transition: var(--transition);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        .clear-search-button {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--gray-light);
          cursor: pointer;
          font-size: 1.2rem;
          transition: var(--transition);
        }

        .clear-search-button:hover {
          color: var(--white);
        }

        .search-results-count {
          text-align: right;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: var(--gray-light);
        }

        /* Restante do CSS permanece igual */
        .rick-morty-app {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-main {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .error-message {
          background-color: rgba(255, 0, 0, 0.2);
          color: var(--white);
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
          text-align: center;
          border: 1px solid var(--red);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: var(--gray-light);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 238, 136, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary);
          margin-bottom: 1rem;
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .character-card {
          background: var(--black-light);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: var(--transition);
          cursor: pointer;
          border: 1px solid var(--gray);
        }

        .character-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .character-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .character-card:hover .character-image {
          transform: scale(1.05);
        }

        .character-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }

        .character-info {
          padding: 1.5rem;
        }

        .character-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
          color: var(--primary);
        }

        .character-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--gray-light);
          margin-bottom: 1rem;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .character-location {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--gray);
        }

        .character-location p:first-child {
          font-size: 0.8rem;
          color: var(--gray-light);
          margin-bottom: 0.25rem;
        }

        .character-location p:last-child {
          font-size: 0.9rem;
          margin: 0;
        }

        .app-footer {
          background: var(--black);
          padding: 1.5rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--gray-light);
          border-top: 1px solid var(--gray);
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 1.5rem;
            gap: 1.5rem;
          }
          
          .app-title {
            font-size: 2rem;
          }
          
          .characters-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 0 1rem;
            gap: 1rem;
          }
          
          .app-title {
            font-size: 1.8rem;
          }
          
          .search-container {
            padding: 0 0.5rem;
          }
          
          .characters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}