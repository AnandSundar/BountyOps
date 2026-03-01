// A01: Broken Access Control + A07: Authentication Failures
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes
    const publicRoutes = ['/submit', '/api/agents/submit', '/_next', '/favicon.ico'];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Admin routes require auth
    if (pathname.startsWith('/api/agents') || pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/admin/:path*'],
};
