import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const avaiableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

export function New(){
    const [title, setTitle ] = useState('')
    const [ weekDays, setWeekDays ] = useState<number[]>([]);

    async function handleCreateNewHabit(){
        try {
            //trim remove os espacos para a verificacao
            if(!title.trim() || weekDays.length === 0){
                Alert.alert('Novo hábito', 'Informe um novo hábito e escolha e periodicidade.')
            }

            await api.post('/habits', {
                title, 
                weekDays
            })

            setTitle('');
            setWeekDays([])

            Alert.alert('Novo hábito', 'Hábito criado com sucesso!')
        } catch (error){
            console.log(error)
            Alert.alert('Ops', 'Não foi possível criar um novo hábito.')
        }
    }

    function handleToggleWeekDay(weekDayIndex: number){
        //se as semanas ja tem a semana clicada, remove, se nao so inclui
        if (weekDays.includes(weekDayIndex)){

            setWeekDays(prevState => prevState.filter(weekDays => weekDays != weekDayIndex ))

        } else {

            setWeekDays(prevState => [...prevState, weekDayIndex]);

        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100}}>
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual o seu comprometimento?
                </Text>

                <TextInput onChangeText={setTitle} value={title} placeholder="Exercícios, dormir 8 horas, etc..." placeholderTextColor={colors.zinc[400]} className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"/>

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    avaiableWeekDays.map((weekDay, i) => (
                        <Checkbox key={weekDay} title={weekDay} checked={weekDays.includes(i)} onPress={() => (handleToggleWeekDay(i))}/>
                    ))
                }

                <TouchableOpacity onPress={handleCreateNewHabit} activeOpacity={0.7} className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'>
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

                
            </ScrollView>            
        </View>
    )
}