import { NextRequest,NextResponse } from "next/server";
import { tokenData } from "../helpers/tokenData";

export function middleware(req: NextRequest, res : NextResponse){
    const {pathname} = req.nextUrl;
    console.log(pathname);
    const isPublic = pathname === '/login' || pathname === '/signup'; 
    const token = req.cookies?.get('token')?.value || "";
    
    const data = tokenData(req);
    console.log(data);

    if(isPublic && token){
        return NextResponse.redirect(new URL('/',req.nextUrl));
    }

    if(!isPublic && !token){
        return NextResponse.redirect(new URL('/login',req.nextUrl));
    }
}

export const config = {
    matcher : [
        '/',
        '/login',
        '/profile',
        '/profile/me',
        '/signup'
    ]
}