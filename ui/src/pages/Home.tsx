import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <h2>Welcome to Library App</h2>
      Check out our <Link to="/books">books</Link>
      <Footer />
    </>
  );
};

export default Home;
