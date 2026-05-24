import { useState, useEffect } from 'react';
import { getDesignProjects } from '../firebase/firestore';

const useDesignProjects = () => {
  const [projects, setProjects] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    getDesignProjects()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
};

export default useDesignProjects;
