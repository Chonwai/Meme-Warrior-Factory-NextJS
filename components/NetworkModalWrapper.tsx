'use client';

import { useWallet } from '@/lib/wallet-context';
import NetworkSelectionModal from './NetworkSelectionModal';

export default function NetworkModalWrapper() {
    const { showNetworkModal, setShowNetworkModal } = useWallet();
    
    if (!showNetworkModal) return null;
    
    return (
        <NetworkSelectionModal 
            onClose={() => setShowNetworkModal(false)} 
        />
    );
} 