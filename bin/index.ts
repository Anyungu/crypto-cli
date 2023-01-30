#!/usr/bin/env node

import yargs from 'yargs';

import dotenv from 'dotenv'
import { handlePortfolioBalance } from '../src/services/transaction-service';

/**
 * Load env
 */
dotenv.config()



const getArgs = async () => {

    const options: { [key: string]: unknown } = await yargs(process.argv.slice(2)).usage("Usage: -t <token> -d <YYYY/MM/DD>")
        .option("t", { alias: "token", describe: "token of choice", type: "string", demandOption: false })
        .option("d", { alias: "date", describe: "data", type: "string", demandOption: false })
        .argv;

    if (options.token && (options.token as string).length !== 3) {
        console.log("Invalid token")
        return
    }

    if (options.date && ((options.date as string).length !== 10 || (options.date as string).split('/').length !== 3)) {
        console.log("Invalid date")
        return
    }

    handlePortfolioBalance(options.token ? (options.token as string).toUpperCase() : '', options.date ? options.date as string : '')


}

getArgs()



