import './App.css'
import { Header } from './components/public/Header'
import { Routing } from './router/Routing'


function App() {

  return (
    <div className='layout'>
      
      {/* Llamamos al routing  */}
      <Routing />
      
    </div>
  )
}

export default App
