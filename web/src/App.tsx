import './styles/global.css'
import { Header } from './compornents/Header'
import { SummaryTable } from './compornents/SummaryTable'
import './lib/dayjs'

//import Habit from './compornents/Habit'

export function App() {


  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className='w-full max-w-5xl px-6 flex flex-col gap-16'>
        
        <Header />
        <SummaryTable />

      </div>

    </div>
  )
}


