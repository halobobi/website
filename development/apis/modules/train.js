import func from './functions.js'
import status from './status.js'

export default {
    async fetch(request, env, params) {

        let paramKeys = Array.from(new Set(params.keys()))

        if (paramKeys.length==0){
            return func.returnStatus('API error', `URL '/train' does not handle requests without a parameter.`)
        }

        if (paramKeys.length>1){
            return func.returnStatus('API error', `URL '/train' only handles one parameter, but received {paramKeys.length}.`)
        }

        if (paramKeys[0]!="trainNumber"){
            return func.returnStatus('API error', `URL '/train' received unknown parameter.`)
        }

        async function doRequest(url, payload){

            let response=await fetch(url+new URLSearchParams(payload).toString())

            console.log(response.url)

            return response
        }

        async function getData(){
            //get session

            let url = "https://iemig.mav-trakcio.hu/emig7/emig.aspx?"

            let response=await doRequest(url,{"v":"7.1"})

            let text = await response.text()

            console.log(text.slice(0,150))

            let gSessionId=text.match(/gSessionId=(\d+);/)[1]

            console.log(gSessionId)

            //random requests to validate session

            response=await doRequest(url,{
                "u": "public",
                "s": gSessionId,
                "t": "rplsj",
                "si": "GET_APP_CODE",
                "par": "Q5",
                "dhxr1730410861313": "1"
            })

            text=await response.text()

            console.log(text.slice(0,150))

            response=await doRequest(url,{
                "s": gSessionId,
                "u": "public",
                "t": "crb",
                "key": "BODY-NONE"
            })

            text=await response.text()

            console.log(text.slice(0,150))

            response=await doRequest(url,{
                "s": gSessionId,
                "u": "public",
                "t": "crb",
                "key": "MAP_PUBLIC"
            })

            text=await response.text()

            console.log(text.slice(0,150))

            // get query

            response=await doRequest(url,{
                "u": "public",
                "s": gSessionId,
                "t": "publicsandr",
                "q": "Q5",
                "lt": "SqlCreate",
                "w": "null",
                "c": "null",
                "o": "null"
            })

            text = await response.text()

            console.log(text.slice(0,150))

            let sqlId=text.match(/<sqlid>(\d+)<\/sqlid>/)[0]

            // get data

            response=await doRequest(url,{
                "u": "public",
                "s": gSessionId,
                "t": "publicrspec",
                "q": sqlId,
                "f": "publicmlist"
            })

            text = await response.text()

            console.log(text.slice(0,150))

            //run second time

            response=await doRequest(url,{
                "u": "public",
                "s": gSessionId,
                "t": "publicrspec",
                "q": sqlId,
                "f": "publicmlist"
            })

            text = await response.text()

            console.log(text.slice(0,150))

            return text
        }

        let response = await getData()

        return new Response(response, { headers: { "content-type": "application/xml;charset=UTF-8", }, status: 200 })

        let n = params.get(paramKeys[0])

        //return new Response(JSON.stringify({ 'response': {city:city,zip:irsz[city]},success:true}), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })
    }
}