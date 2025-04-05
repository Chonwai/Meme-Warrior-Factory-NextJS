import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { CrossChainSwap } from "@/components/CrossChainSwap";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <VerifyBlock />
      <PayBlock />
      <CrossChainSwap />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">MemeWarriors</h1>
        <p className="mb-8">用AI生成Meme士兵，參與像素戰場！</p>
        <Link 
          href="/soldier-prep" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
        >
          開始創建你的Meme士兵
        </Link>
      </div>
    </main>
  );
}
