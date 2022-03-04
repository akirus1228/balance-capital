// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { Routes, Route, Link } from "react-router-dom";
import HomePage from './home-page';
import BondsPage from './pages/bonds';
import { Header } from './components/header';

export function App() {
  return (
    <>
      <div>
        <Header />
        <Link to="/bonds">Bonds</Link>
        <div>Footer</div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage title="Home"/>} />
        <Route path="/bonds" element={<BondsPage />} />
      </Routes>
    </>
  );
}

export default App;
