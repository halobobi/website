import func from './modules/functions.js'
import status from './modules/status.js'
import totp from './modules/totp.js'
import mail from './modules/mail.js'
import zip from './modules/zip.js'
import random from './modules/random.js'
import train from './modules/train.js'

export default {
  async fetch(request, env, ctx) {

    if (!(request.method == 'GET' || request.method == 'POST')) return func.returnStatus('API error', `${request.method} requests are not handled.`, 405)

    const url = new URL(request.url)

    if (url.pathname == '/') return func.returnStatus('API error', `URL '/' does not handle requests.`, 421)

    let pathnames = url.pathname.split('/')
    pathnames.splice(0, 1)

    if (!pathnames.includes('')) {

      switch(pathnames.length){

        case 1:{

        switch (pathnames[0]) {
          case 'totp':
            if (request.method == 'POST') return func.returnStatus('API error', `URL '/totp' does not handle POST requests.`, 405)
            if (pathnames.length != 1) return func.returnStatus(undefined, undefined, 404)
  
            return totp.fetch(request, env, url.searchParams)

          case 'train':
            if (request.method == 'POST') return func.returnStatus('API error', `URL '/train' does not handle POST requests.`, 405)

            return train.fetch(request, env, url.searchParams)
  
          case 'status':
            return status.fetch(request, pathnames, url.searchParams)
  
          default: return func.returnStatus(undefined, undefined, 404)
        }

      }

      case 2:{

        switch (pathnames[0]) {

          case 'mail':
            if (pathnames.length == 1) return func.returnStatus('API error', `URL '/mail' does not handle requests.`, 421)
            if (request.method == 'GET') return func.returnStatus('API error', `URL '/mail' does not handle GET requests.`, 405)
  
            return mail.fetch(request, env, pathnames)

          case 'flowpro':{

            switch (pathnames[1]){

              case 'zip':
                if (request.method == 'POST') return func.returnStatus('API error', `URL '/flowpro/zip' does not handle POST requests.`, 405)
                return zip.fetch(request, pathnames, url.searchParams)
  
              case 'random':
                if (request.method == 'POST') return func.returnStatus('API error', `URL '/flowpro/random' does not handle POST requests.`, 405)
                return random.fetch(request, pathnames, url.searchParams)

              default: return func.returnStatus(undefined, undefined, 404)

            }

          }

          default: return func.returnStatus(undefined, undefined, 404)

        }

      }

        default: return func.returnStatus(undefined, undefined, 404)

      }

    }

    let clpathnames = []

    pathnames.forEach(element => {
      if (element != '') {
        clpathnames.push(element)
      }
    });

    let search = ''

    if (url.searchParams.size != 0) { search = `?${url.searchParams}` }

    return Response.redirect(`https://${url.hostname}/${clpathnames.join('/')}${search}`, 301)
  }
};