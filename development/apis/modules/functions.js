export default {
  async returnStatus(type = '', details = 'No further information.', status = 400) {
    let html = await (await fetch(`https://raw.githubusercontent.com/halobobi/website/master/development/status/${status}.html`)).text()
    if (type != '') type += ': '
    return new Response(html.replace('${type}', type).replace('${details}', details), { headers: { "content-type": "text/html;charset=UTF-8", }, status: status });
  },
  async returnTime(_lang = 0,time=-1) {
    let date

    if (time==-1){
      date=new Date()
    }else{
      date=new Date(time)
    }
    
    let hu = date.toLocaleTimeString('hu-HU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
      timeZoneName: 'short',
      timeZone: 'Europe/Budapest',
    })
    let en = date.toLocaleTimeString('en-EN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
      timeZoneName: 'short',
      timeZone: 'Europe/Budapest',
    })
    switch (_lang) {
      case 1:
        return en
      case 2:
        return hu
      default:
        return [en, hu]
    }
  },
  async readRequestBody(request) {
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
      return this.returnStatus('API error',`Media/content type '${contentType}' is not supported.`,415);
    }
  },

  async getKey(env,key) {
    const { value, metadata } = await env.TOTP_KEYS.getWithMetadata(key);
    if(metadata==null){return {isValid:false}}
    await env.TOTP_KEYS.delete(key);
    return metadata

},
async getRandomKey(env,length = 10, time = 4, size = 1) {

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

    return data
}
}