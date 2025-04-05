import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js';

interface IRequestPayload {
    payload: MiniAppWalletAuthSuccessPayload;
    nonce: string;
}

export async function POST(req: NextRequest) {
    try {
        // Get payload from request
        const { payload, nonce } = await req.json() as IRequestPayload;

        // Get stored nonce from cookies
        const storedNonce = cookies().get('siwe')?.value;

        // Verify nonce matches
        if (nonce != storedNonce) {
            return NextResponse.json({
                status: 'error',
                isValid: false,
                message: 'Invalid nonce',
            });
        }

        try {
            // Verify SIWE message
            const validMessage = await verifySiweMessage(payload, nonce);
            
            // Clear the nonce cookie after verification
            cookies().delete('siwe');
            
            return NextResponse.json({
                status: 'success',
                isValid: validMessage.isValid,
                address: payload.address
            });
        } catch (error: any) {
            // Handle errors in validation or processing
            console.error('Error verifying SIWE message:', error);
            return NextResponse.json({
                status: 'error',
                isValid: false,
                message: error.message || 'Error verifying signature',
            });
        }
    } catch (error: any) {
        console.error('Verification error:', error);
        return NextResponse.json({
            status: 'error',
            isValid: false,
            message: error.message || 'An error occurred during verification',
        }, { status: 500 });
    }
}
