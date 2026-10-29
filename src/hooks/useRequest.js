import { useEffect, useState } from 'react';

// O cleanup ignora respostas antigas quando a tela muda ou uma nova consulta começa.
export function useRequest(load, key) {
  const [result, setResult] = useState({ data: null, loading: true, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setResult({ data: null, loading: true, error: '' });
    load(key).then(
      (data) => { if (active) setResult({ data, loading: false, error: '' }); },
      (error) => { if (active) setResult({ data: null, loading: false, error: error.message }); },
    );
    return () => { active = false; };
  }, [load, key, attempt]);

  return { ...result, retry: () => setAttempt((value) => value + 1) };
}

