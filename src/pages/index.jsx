import Dashboard from '../components/Dashboard';
import Authentication from '../components/Authentication';
import { useAuth } from '../context/AuthContext';
const Home = () => {
  const { currentUser } = useAuth();
  return <>{!currentUser ? <Authentication /> : <Dashboard />}</>;
};

export default Home;
