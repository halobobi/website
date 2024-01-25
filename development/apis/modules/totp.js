import func from './functions.js'
import status from './status.js'

export default {
    async fetch(request, env, params) {

        const respT = "If '${param}' parameter is specified, it must have an assigned value."
        const respTValue = "'${param}' parameter should have an ${type} value assigned."
        const respTLimit = "Value of '${param}' parameter is outside of the valid range."

        const allowedParams = { 'strLength': ['integer', 6, 16384], 'expTime': ['floating-point', 1, 10080], 'arraySize': ['integer', 1, 15] }
        const numericValues = ['integer', 'floating-point']
        const regexValues = ['string']

        async function getKey(key) {
            return `${key}: OK`

        }
        async function getRandomKey(length = 10, time = 4, size = 1) {

            const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

            let data = []

            for (let i = 0; i < size; i++) {
                const int32 = new Uint32Array(length);
                crypto.getRandomValues(int32)

                let key = ''

                int32.forEach(element => {
                    key += chr.charAt(element % chr.length)
                })

                //add to KV

                data.push(key)
            }

            console.log(data)

            return data
        }

        let paramKeys = Array.from(new Set(params.keys()))

        if (paramKeys.includes('key')) {
            if (params.get('key') == '') { return func.returnStatus('API error', respT.replace('${param}', 'key')) }
            if (paramKeys.length != 1) { return Response.redirect(`https://api.andrasbiro.work/totp?key=${params.get('key')}`) }
            return new Response(JSON.stringify({ 'response': await getKey(params.get('key')) }), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })
        }

        let validParams = []

        for (const e of paramKeys) {
            if (Object.keys(allowedParams).includes(e)) {
                if (params.get(e) == '') {return func.returnStatus('API error', respT.replace('${param}', e))}
                validParams.push(e)
            }
        }

        if (validParams.toString() !== paramKeys.toString()) {
            return Response.redirect(`https://api.andrasbiro.work/totp?${validParams.map(e => { return `${e}=${params.get(e)}` }).join('&')}`)
        }

        let paramObj = {}

        for (const e of paramKeys){
            let value
            switch (allowedParams[e][0]) {
                case 'integer':
                    value = parseInt(params.get(e))
                    break;
                case 'floating-point':
                    value = parseFloat(params.get(e))
                    break;
                default:
                    value = params.get(e)
                    break;
            }
            if (isNaN(value)) { return func.returnStatus('API error', respTValue.replace('${param}', e).replace('${type}', allowedParams[e][0])) }

            if (numericValues.includes(allowedParams[e][0])) {
                if (allowedParams[e][1] > value || value > allowedParams[e][2]) { return func.returnStatus('API error', respTLimit.replace('${param}', e)) }
            }

            paramObj[e] = value

        }

        return new Response(JSON.stringify({ 'response': await getRandomKey(paramObj.strLength, paramObj.expTime, paramObj.arraySize) }), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })


    }
}