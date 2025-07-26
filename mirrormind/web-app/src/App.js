import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [reflection, setReflection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    setReflection(null);
    try {
      const res = await fetch(`http://localhost:8080/reflect?text=${text}`);
      const data = await res.json();
      setReflection(data);
    } catch (error) {
      console.error(error);
      setReflection({ error: 'Error fetching data' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MirrorMind</h1>
        <div className="input-container">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How are you feeling?"
          />
          <button onClick={handlePress} disabled={isLoading}>
            {isLoading ? 'Reflecting...' : 'Reflect'}
          </button>
        </div>
        {reflection && (
          <div className="reflection-container">
            {reflection.error ? (
              <p className="error-text">{reflection.error}</p>
            ) : (
              <>
                <img src={reflection.image_url} alt="Reflection" />
                <p>{reflection.reflection}</p>
                <p>Detected Emotions: {JSON.stringify(reflection.emotion)}</p>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
