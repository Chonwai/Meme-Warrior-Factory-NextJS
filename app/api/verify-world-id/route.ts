import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifySiweMessage } from '@worldcoin/minikit-js';

interface RequestPayload {
    payload: {
        status: 'success';
        message: string;
        signature: string;
        address: string;
        version: number;
    };
    nonce: string;
}

export async function POST(req: NextRequest) {
    try {
        // Get payload from request
        const { payload, nonce } = (await req.json()) as RequestPayload;

        // Get stored nonce from cookies
        const storedNonce = cookies().get('siwe')?.value;

        // Verify nonce matches
        if (nonce !== storedNonce) {
            return NextResponse.json(
                {
                    status: 'error',
                    isValid: false,
                    message: 'Invalid nonce',
                },
                { status: 400 }
            );
        }

        // Verify SIWE message
        const validationResult = await verifySiweMessage(payload, nonce);

        // Clear the nonce cookie after verification
        cookies().delete('siwe');

        return NextResponse.json({
            status: 'success',
            isValid: validationResult.isValid,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'error',
                isValid: false,
                message: error.message || 'An error occurred during verification',
            },
            { status: 500 }
        );
    }
}
