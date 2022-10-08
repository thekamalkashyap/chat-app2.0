import { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Authentication from '../components/Authentication';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && <>{currentUser ? children : <Authentication />}</>}
      {loading && (
        <div className=" h-screen w-screen flex justify-center items-center">
          loading...
        </div>
      )}
    </AuthContext.Provider>
  );
};
