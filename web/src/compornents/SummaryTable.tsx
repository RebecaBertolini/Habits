import { generateDatesFromYearBegginning } from "../utils/generate-dates-from-year-beggining"
import HabitDay from "./HabitDay"


export function SummaryTable() {
    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

    const summaryDates = generateDatesFromYearBegginning()

    const minimumSummaryDatesSize = 18 * 7
    const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

    return (
        <div className="w-full flex">
            <div className="grid grid-row-7 grid-flow-row gap-3">

                {weekDays.map((weekDay, i) => {
                    return (
                        <div key={`${weekDay}-${i}`} className="text-zinc-400 text-xl font-bold h-10 w-10 flex justify-center items-center" >
                            {weekDay}
                        </div>
                    )
                })}

            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summaryDates.map(date => {
                    return (
                        <HabitDay amount={10} amountCompleted={Math.round((Math.random() * 10))} key={date.toString()}/>
                    )
                })}

                {amountOfDaysToFill > 0 && Array.from({length: amountOfDaysToFill }).map((_, i) => {
                    return (
                        <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed">

                        </div>
                    )
                }) }
            </div>
        </div >
    )
}