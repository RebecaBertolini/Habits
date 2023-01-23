//essas requisicoes demoram e retornam promessas, necessario usar async await
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import dayjs from "dayjs"
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance){

    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })
       const { title, weekDays } = createHabitBody.parse(request.body)

       //zera as horas min e segundos
        const today = dayjs().startOf('day').toDate()

       await prisma.habit.create({
        data: {
            title,
            created_at: today,
            weekDays: {
                create: weekDays.map(weekDay => {
                    return{
                        week_day: weekDay,
                    }
                })
            }
        }
       })
    })

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            //converte o parametro recebido de uma string para uma data
            date:z.coerce.date()
        })

        //data recebida
        const { date } = getDayParams.parse(request.query)

        //data recebida com horario zerado
        const parseDate = dayjs(date).startOf('day')
        //encontra o dia da semana da data recebida
        const weekDay = parseDate.get('day')
        //data lte - menor ou igual a data atual. Encontra todo habito criado ate a data e que tem aquela semana
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    },
                }
            }
        })
        //data de hoje que tem habito
        const day = await prisma.day.findUnique({
            where: {
                date: parseDate.toDate(),
            },
            include: {
                dayHabits: true
            }
        })

        //se houver habito na data de hoje vai mapear todos
        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params)
        
        const today = dayjs().startOf('day').toDate()

        //ja existe o dia criado
        let day = await prisma.day.findUnique({
            where:{
                date: today
            }
        })

        //se nao existe, cria
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        //esse dia ja esta atrelado a este habito?
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id:{
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        //se sim remove, se nao cria
        if (dayHabit){
            await prisma.dayHabit.delete({
                where:{
                    id: dayHabit.id
                }
            })
        } else {

            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }

        
    })

    //faz uma chamada unica no banco de dados
    app.get('/summary', async (request) => {
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                       cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,

                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int) 
                    AND H.created_at <= D.date
                ) as amount

            FROM days D
        `

        return summary
    })
}

