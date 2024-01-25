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
            const { value, metadata } = await env.TOTP_KEYS.getWithMetadata(key);
            if(metadata==null){return {isValid:false}}
            await env.TOTP_KEYS.delete(key);
            return metadata

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
                
                if(await env.TOTP_KEYS.get(key)!=null){i--}
                else{
                    await env.TOTP_KEYS.put(key,'',{metadata:{isValid:true,createTime:Date.now()},expirationTtl: time*60})
                    data.push(key)
                }
            }

            console.log(data)

            return data
        }

        let paramKeys = Array.from(new Set(params.keys()))

        if (paramKeys.includes('validKey')) {
            if (params.get('validKey') == '') { return func.returnStatus('API error', respT.replace('${param}', 'validKey')) }
            if (paramKeys.length != 1) { return Response.redirect(`https://api.andrasbiro.work/totp?key=${params.get('validKey')}`) }
            return new Response(JSON.stringify({ 'response': await getKey(params.get('validKey')) }), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })
        }

        let validParams = []

        for (const e of paramKeys) {
            if (Object.keys(allowedParams).includes(e)) {
                if (params.get(e) == '') {return func.returnStatus('API error', respT.replace('${param}', e))}
                validParams.push(e)
            }
        }

        if (validParams.toString() !== paramKeys.toString()) {
            if(validParams.length==0){return Response.redirect(`https://api.andrasbiro.work/totp`)}
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

        return new Response(JSON.stringify({ 'response': {validKeys:await getRandomKey(paramObj.strLength, paramObj.expTime, paramObj.arraySize) }}), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })


    }
}