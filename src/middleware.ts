import { NextResponse, NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl
    const problemRegex = /^\/problem\/\d+$/;
    // console.log(token)

    if((!token || !token.isAdmin) && url.pathname.startsWith('/problem/add')) {
      return NextResponse.redirect(new URL('/problem', request.url))
    }

    if(token && (
        url.pathname.startsWith('/login') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(!token && 
      (problemRegex.test(url.pathname) ||
      url.pathname.startsWith('/submissions'))
    ) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/verify/:path*',
    '/problem/:path*',
    '/submissions',
  ],
}