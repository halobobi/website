import func from './functions.js'

export default {

    async fetch(request, paths, params) {

        const previewTexts={
            '400':['API error',`URL '' does not handle requests with no search parameters.`],
            '401':['API error',`Access to URL '' requires authentication by valid credentials.`],
            '403':['API error',`Access to URL '' is not allowed at this moment.`],
            '404':[undefined,undefined],
            '405':['API error',`URL '' does not handle POST requests.`],
            '415':['API error',`Media/content type '' is not supported.`],
            '418':[undefined, `The resource being a teapot refused to brew coffee. Pour a cup of tea instead! 🍵🫖`],
            '421':['API error',`URL '' does not handle requests.`]
        }

        let status = paths[1]

        if (!Object.keys(previewTexts).includes(status)) { return func.returnStatus(undefined, undefined, 404) }
        
        switch (params.get('preview')) {
            case '1':
                return new Response(await (await fetch(`https://raw.githubusercontent.com/halobobi/website/master/development/status/${status}.html`)).text(), { headers: { "content-type": "text/html;charset=UTF-8"}, status: status })
            case '2':
                return new Response(await (await fetch(`https://raw.githubusercontent.com/halobobi/website/master/development/status/${status}.html`)).text(), { headers: { "content-type": "text/plain;charset=UTF-8"}, status: status })
            default:
                console.log('nem jo')
                return func.returnStatus(previewTexts[status][0],previewTexts[status][1],status)       
        }
    }
}