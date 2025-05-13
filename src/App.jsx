import './App.css';
import Header from './components/ui/custom/Header.jsx';
import Hero from './components/ui/custom/Hero.jsx';
// import CreateTrip from './create-trip';


function App({ children }) {
  return (
    <>
    
      <Header />
      {children ? children : <Hero />}
    </>
  );
}


export default App;
