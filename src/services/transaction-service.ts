

import { parse } from 'csv-parse';
import fs from 'fs'
import { ResponseData, RowData } from '../models/types';
import { getUsdEquivalent } from './currency-service';


var tokenBalance: { [key: string]: number } = {};
var tokenUsdBalance: { [key: string]: number } = {};
/**
 * Filter data and add it to token balance object
 * @param chunkRow 
 * @param token 
 * @param utcSecondsSinceEpochStart 
 * @param utcSecondsSinceEpochEnd 
 */
export const filterData = (chunkRow: RowData, token: string, utcSecondsSinceEpochStart: number, utcSecondsSinceEpochEnd: number) => {

    const patchData = () => {

        if (tokenBalance[chunkRow.token]) {
            const currentBalance = tokenBalance[chunkRow.token]
            const newBalance = chunkRow.transaction_type === 'DEPOSIT' ? currentBalance + parseFloat(chunkRow.amount) : currentBalance - parseFloat(chunkRow.amount)
            tokenBalance[chunkRow.token] = newBalance

        } else {
            const newBalance = chunkRow.transaction_type === 'DEPOSIT' ? 0 + parseFloat(chunkRow.amount) : 0 - parseFloat(chunkRow.amount)
            tokenBalance[chunkRow.token] = newBalance

        }

    }


    if (token && chunkRow.token === token && utcSecondsSinceEpochStart && parseInt(chunkRow.timestamp) >= utcSecondsSinceEpochStart && parseInt(chunkRow.timestamp) <= utcSecondsSinceEpochEnd) {

        patchData()

    } else if (token && !utcSecondsSinceEpochStart && chunkRow.token === token) {

        patchData()

    } else if (!token && !utcSecondsSinceEpochStart) {

        patchData()

    } else if (!token && utcSecondsSinceEpochStart && parseInt(chunkRow.timestamp) >= utcSecondsSinceEpochStart && parseInt(chunkRow.timestamp) <= utcSecondsSinceEpochEnd) {

        patchData()

    }



}

/**
 * Convert balance to usd rates and log results
 */
export const endData = async () => {

    const fsym: string = Object.keys(tokenBalance).join(',')

    const res: ResponseData = await getUsdEquivalent(fsym)

    Object.entries(tokenBalance).forEach(([token, amount], idx) => {
        const currentToken = token
        const currentBalanceInUsd = amount * res[token]['USD']

        tokenUsdBalance[currentToken] = currentBalanceInUsd
    })

    console.log(tokenUsdBalance)
}

/**
 * 
 * @param date Return epoch seconds
 * @returns 
 */
const processDate = (date: string): { utcSecondsSinceEpochStart: number, utcSecondsSinceEpochEnd: number } => {

    if (!date) return { utcSecondsSinceEpochStart: 0, utcSecondsSinceEpochEnd: 0 }

    const start = new Date(date)
    const utcMilllisecondsSinceEpochStart = start.getTime() + (start.getTimezoneOffset() * 60 * 1000)
    const utcSecondsSinceEpochStart = Math.round(utcMilllisecondsSinceEpochStart / 1000)

    const end = new Date(date)
    end.setUTCHours(23, 59, 59, 999)
    const utcMilllisecondsSinceEpochEnd = end.getTime() + (end.getTimezoneOffset() * 60 * 1000)
    const utcSecondsSinceEpochEnd = Math.round(utcMilllisecondsSinceEpochEnd / 1000)

    return { utcSecondsSinceEpochStart, utcSecondsSinceEpochEnd }

}

/**
 * Read csv as stream
 */
export const handlePortfolioBalance = (token: string = '', date: string = '') => {


    const dates: { utcSecondsSinceEpochStart: number, utcSecondsSinceEpochEnd: number } = processDate(date)


    var readerStream = fs.createReadStream(`${__dirname}/../../../files/transactions.csv`); //Create a readable stream

    readerStream.setEncoding('utf8'); // Set the encoding to be utf8. 

    readerStream
        .pipe(parse({ columns: true }))
        .on('data', (chunkRow: RowData) => {
            filterData(chunkRow, token, dates.utcSecondsSinceEpochStart, dates.utcSecondsSinceEpochEnd)
        })
        .on('end', endData)
        .on('error', function (err) {
            console.log(err.stack);
        });


}