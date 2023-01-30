
export type Transaction = 'DEPOSIT' | 'WITHDRAWAL'

export type RowData = {
    timestamp: string,
    transaction_type: Transaction,
    token: string,
    amount: string
}

export type ResponseData = {
    [key: string]: {
        [key: string]: number
    }
}