'use client' // Required for Next.js

import { ReactNode, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

export default function MiniKitProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Passing appId in the install is optional
        // but allows you to access it later via `window.MiniKit.appId`
        const worldAppId = process.env.NEXT_PUBLIC_WORLD_KEY;
        MiniKit.install(worldAppId);
        
        // Log whether MiniKit is installed
        console.log('MiniKit installed:', MiniKit.isInstalled());
    }, []);

    return <>{children}</>;
} 