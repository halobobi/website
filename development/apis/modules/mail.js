export default {

    async fetch(request, env, ctx) {
  
        const headers = Object.fromEntries(request.headers)
  
        function currentTime(_lang = 0) {
            let hu = new Date().toLocaleTimeString('hu-HU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                fractionalSecondDigits: 3,
                timeZoneName: 'short',
                timeZone: 'Europe/Budapest', // Set the time zone to Hungarian time
            })
            let en = new Date().toLocaleTimeString('en-EN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                fractionalSecondDigits: 3,
                timeZoneName: 'short',
                timeZone: 'Europe/Budapest', // Set the time zone to Hungarian time
            })
            switch (_lang) {
                case 1:
                    return en
                case 2:
                    return hu
                default:
                    return [en, hu]
            }
        }
  
        async function readRequestBody(request) {
            const contentType = request.headers.get("content-type");
            if (contentType.includes("application/json")) {
                return JSON.stringify(await request.json());
            } else if (contentType.includes("application/text")) {
                return request.text();
            } else if (contentType.includes("text/html")) {
                return request.text();
            } else if (contentType.includes("form")) {
                const formData = await request.formData();
                const body = {};
                for (const entry of formData.entries()) {
                    body[entry[0]] = entry[1];
                }
                return JSON.stringify(body);
            } else {
                return new Response('Status: 400 - Bad request. Reason: Unidenfiable package.', { status: 400 });
            }
        }
  
        // You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
        const url = new URL(request.url);
  
        if (!url.pathname.startsWith("/api/") || (url.pathname.endsWith("/api/") || url.pathname.endsWith("/api"))) {
            return Response.redirect('https://www.andrasbiro.work/mail');
        } else if (url.pathname.endsWith('handle') || url.pathname.endsWith('handle/')) {
            if (request.method === "POST") {
                const reqBody = await readRequestBody(request);
                let obj = JSON.parse(reqBody)
                if (obj._pw == env.API_PW) {
                    let formhtml = await (await fetch('https://raw.githubusercontent.com/halobobi/website/master/development/form.html')).text()
                    return new Response(formhtml, {
                        headers: {
                            "content-type": "text/html;charset=UTF-8",
                        }
                    });
                }
                else {
                    return new Response('Authentication failed.')
                }
  
            } else if (request.method === "GET") {
                return new Response('Status: 400 - Bad request. Reason: GET requests are not handled.', { status: 400 });
            }
        }
        else if (url.pathname.endsWith('send') || url.pathname.endsWith('send/')) {
            const respintime = currentTime()
            if (request.method === "POST") {
                const reqBody = await readRequestBody(request);
                let obj = JSON.parse(reqBody)
                //return new Response(JSON.stringify(obj))
                if (obj._pw != env.API_PW) {
                    return new Response('Authentication failed.')
                }
  
                const keys = Object.keys(obj)
  
                const furl = obj.furl
                let fname = obj.fname
  
                if (fname == undefined || fname == '') {
                    fname = furl
                    if (furl.length > 20) fname = furl.substring(0, 10) + '...' + furl.substring(furl.length - 10, furl.length)
                }
  
                let emails = []
  
                if (keys.includes('email1')) if (obj.email1 == 'on') emails.push({ email: 'orosz.hanna.07.25@gmail.com' })
                if (keys.includes('email2')) if (obj.email2 == 'on') emails.push({ email: 'andrasbir@gmail.com' })
                if (keys.includes('email3')) if (obj.email3 == 'on') emails.push({ email: 'andrasbir2@gmail.com' })
                if (keys.includes('email4')) if (obj.email4 == 'on') emails.push({ email: 'laandro3@gmail.com' })
  
                for (let index = 0; index < keys.length; index++) {
                    if (keys[index].includes('+') && (obj[keys[index]] != '')) emails.push({ email: obj[keys[index]] })
                }
  
                const lang = obj.lang
  
                let langu
  
                let emailbody
                let emailsu
  
                if (lang == 'on') {
                    langu = 'EN - English'
  
                    emailsu = `🌥️ The following item has been shared with you`
                    emailbody=await (await fetch('https://raw.githubusercontent.com/halobobi/website/master/development/email_en.html')).text()
                }
                else {
                    langu = 'HU - Hungarian'
  
                    emailsu = `🌥️ A következőt osztották meg Önnel`
                    emailbody=await (await fetch('https://raw.githubusercontent.com/halobobi/website/master/development/email_hu.html')).text()
                }
  
                let resps = []
  
                for (let index = 0; index < emails.length; index++) {
                    let element = emails[index];
                    let emailb
  
                    emailb = emailbody.replaceAll('${furl}', furl)
                        .replaceAll('${fname}', fname)
                        .replaceAll('${element.email}', element.email)
  
                    let send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            personalizations: [
                                {
                                    to: [{ email: element.email }],
                                },
                            ],
                            from: {
                                email: 'sharing@mail.andrasbiro.work',
                                name: 'Sharing System',
                            },
                            subject: emailsu,
                            content: [
                                {
                                    type: 'text/html',
                                    value: emailb,
                                },
                            ],
                        }),
                    })
  
                    const inittime = currentTime()
  
                    const resp = await fetch(send_request)
                    const resptime = currentTime()
                    const respt = await resp.text()
  
                    resps.push({ email: element.email, 'initial-timestamp': inittime, 'response-timestamp': resptime, 'mailchannels-response': respt })
  
                };
  
                obj._pw = '**********'
  
                let etable = ``
  
                resps.forEach(element => {
                    etable += '<tr style="border:1px solid black">'
                    etable += `<td style="border:1px solid black; padding:10px;">${element.email}</td>
            <td style="border:1px solid black; padding:10px;">${element['initial-timestamp'][0]}</td>
            <td style="border:1px solid black; padding:10px;">${element['initial-timestamp'][1]}</td>
            <td style="border:1px solid black; padding:10px;">${element['response-timestamp'][0]}</td>
            <td style="border:1px solid black; padding:10px;">${element['response-timestamp'][1]}</td>
            <td style="border:1px solid black; padding:10px;">${element['mailchannels-response']}</td>`
                    etable += '</tr>'
                });
  
                let syse = await (await fetch('https://raw.githubusercontent.com/halobobi/website/master/development/logs.html')).text()
  
                let stime = currentTime()
  
                syse = syse.replaceAll('${respintime[0]}', respintime[0])
                    .replaceAll('${respintime[1]}', respintime[1])
                    .replaceAll('${JSON.stringify(obj)}', JSON.stringify(obj))
                    .replaceAll('${fname}', fname)
                    .replaceAll('${furl}', furl)
                    .replaceAll('${etable}', etable)
                    .replaceAll('${langu}', langu)
                    .replaceAll("${localen}", stime[0])
                    .replaceAll("${localhu}", stime[1])
                    .replaceAll("${headers['cf-connecting-ip']}", headers['cf-connecting-ip'])
                    .replaceAll("${headers['x-real-ip']}", headers['x-real-ip'])
                    .replaceAll("${headers['sec-ch-ua-platform']}", headers['sec-ch-ua-platform'])
                    .replaceAll("${headers['user-agent']}", headers['user-agent'])
                    .replaceAll("${headers['sec-ch-ua']}", headers['sec-ch-ua'])
                    .replaceAll("${request.cf.asOrganization}", request.cf.asOrganization)
                    .replaceAll("${request.cf.continent}", request.cf.continent)
                    .replaceAll('${request.cf.country}', request.cf.country)
                    .replaceAll('${request.cf.region}', request.cf.region)
                    .replaceAll('${request.cf.regionCode}', request.cf.regionCode)
                    .replaceAll('${request.cf.postalCode}', request.cf.postalCode)
                    .replaceAll('${request.cf.city}', request.cf.city)
                    .replaceAll('${request.cf.latitude}', request.cf.latitude)
                    .replaceAll('${request.cf.longitude}', request.cf.longitude)
  
                let send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        personalizations: [
                            {
                                to: [{ email: 'laandro3@gmail.com' }],
                            },
                        ],
                        from: {
                            email: 'sharing-logs@mail.andrasbiro.work',
                            name: 'Sharing System Logs',
                        },
                        subject: 'sharing@mail.andrasbiro.work: Shared an item.',
                        content: [
                            {
                                type: 'text/html',
                                value: syse,
                            },
                        ],
                    }),
                })
  
                const inittime = currentTime()
  
                const resp = await fetch(send_request)
  
                const resptime = currentTime()
                resps.push({ system: { email: 'laandro3@gmail.com', 'initial-timestamp': inittime, 'response-timestamp': resptime, 'mailchannels-response': await resp.text() } })
                let successhtml = await (await fetch('https://raw.githubusercontent.com/halobobi/website/master/development/success.html')).text()
                return new Response(successhtml.replaceAll('${JSON.stringify(resps)}', JSON.stringify(resps)), {
                    headers: {
                        "content-type": "text/html;charset=UTF-8",
                    }
                });
            }
            else if (request.method === "GET") {
                return new Response('Status: 400 - Bad request. Reason: GET requests are not handled.', { status: 400 });
            }
        }
        else {
            return Response.redirect('https://www.andrasbiro.work/mail');
        }
    }
  };