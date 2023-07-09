export type TCreateExpense = {
    landPurchase: number
    nonAgricultural: number
    planningAndLayout: number
    landDevelopment: number
    brokerage: number
    landVisitCharge: number
    projectId: string
    miscExpense:
        | {
              expenseName: string
              cost: number
          }[]
        | []
}

export type TUpdateExpense = {
    landPurchase?: number
    nonAgricultural?: number
    planningAndLayout?: number
    landDevelopment?: number
    brokerage?: number
    landVisitCharge?: number
    projectId: string
    miscExpense?:
        | {
              expenseName: string
              cost: number
          }[]
        | []
}
