import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    // Generate a random nonce (at least 8 alphanumeric characters)
    const nonce = crypto.randomUUID().replace(/-/g, '');

    // Store the nonce in a cookie
    cookies().set('siwe', nonce, {
        secure: true,
        httpOnly: true,
        maxAge: 300, // 5 minutes
    });

    return NextResponse.json({ nonce });
}
