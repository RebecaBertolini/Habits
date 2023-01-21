import axios from 'axios'

//precisa estar com o ip da maquina
export const api = axios.create({
    baseURL: 'http://192.168.0.21:3333'
})