import func from './modules/functions.js'
import status from './modules/status.js'

export default {
  async fetch(request, env, ctx) {

    if (!(request.method=='GET' || request.method=='POST')) return func.returnStatus('API error',`${request.method} requests are not handled.`,405)
    
    const url = new URL(request.url)

    if (url.pathname == '/') return func.returnStatus('API error',`URL '/' does not handle requests.`,421)

    let pathnames = url.pathname.split('/')
    pathnames.splice(0, 1)

    if (!pathnames.includes('')) {
      switch (pathnames[0]) {
        case 'mail':
          if (request.method=='GET') return func.returnStatus('API error',`URL '/mail' does not handle GET requests.`,405)

          return new Response(`Success mail!`, { status: 200 }) //mail.fetch(request, env, ctx, paths)
        case 'totp':
          if (request.method=='POST') return func.returnStatus('API error',`URL '/totp' does not handle POST requests.`,405)
          if (url.searchParams.size==0) return func.returnStatus('API error',`URL '/totp' does not handle requests with no search parameters.`)
          console.log(url.searchParams[0])
          return new Response(`Success totp!${request.url}`, { status: 200 }) //totp.fetch(request, env, ctx, paths)

        case 'status':
          return status.fetch(request,pathnames,url.searchParams)
          return func.returnStatus(undefined,`The resource being a teapot refused to brew coffee. Pour a cup of tea instead! 🍵🫖`,418)

        default:
          return func.returnStatus(undefined,undefined,404)
      }
    }

    let clpathnames = []

    pathnames.forEach(element => {
      if (element != '') {
        clpathnames.push(element)
      }
    });

    let search = ''

    if (url.searchParams.size!=0) {search = `?${url.searchParams}`}

    return Response.redirect(`https://${url.hostname}/${clpathnames.join('/')}${search}`, 301)
  }
};