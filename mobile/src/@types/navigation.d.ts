//quais parametros sao levados de uma tela a outra - nao recomenda passar muita informacao, passe dados simples
export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined;
            new: undefined;
            habit: {
                date: string
            }
        }
    }
}