import axios from "axios"
import { ResponseData } from "../models/types"


/**
 * Read env and fetch conversion rates in USD
 * @param fsyms 
 * @returns 
 */
export const getUsdEquivalent = async (fsyms: string): Promise<ResponseData> => {

    const config = {
        headers: {
            authorization: `Apikey ${process.env.CRYPTO_API_KEY}`
        },
        params: {
            tsyms: 'USD',
            fsyms
        }
    }

    const res = await axios.get(process.env.CRYPTO_API_URL, config)
    return res.data

}