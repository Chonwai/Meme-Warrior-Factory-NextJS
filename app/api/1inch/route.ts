import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 獲取代幣價格
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chainId = searchParams.get("chainId");
  const fromToken = searchParams.get("fromToken");
  const toToken = searchParams.get("toToken");
  const amount = searchParams.get("amount");

  if (!chainId || !fromToken || !toToken || !amount) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // 調用1inch API獲取報價
    const response = await axios.get(
      `https://api.1inch.io/v5.0/${chainId}/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching from 1inch API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch from 1inch API" },
      { status: 500 }
    );
  }
}

// 處理跨鏈兌換請求
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromChain, toChain, fromToken, toToken, amount, userAddress } = body;

    if (!fromChain || !toChain || !fromToken || !toToken || !amount || !userAddress) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 這裡是模擬的Fusion+調用，實際實現需要使用Fusion SDK
    // 在實際項目中，這裡將使用Fusion+的API進行跨鏈兌換
    
    return NextResponse.json({
      // 模擬響應
      success: true,
      txHash: "0x" + Math.random().toString(16).substr(2, 64),
      estimatedTime: "30 seconds",
      fromAmount: amount,
      toAmount: (parseFloat(amount) * 0.98).toString(), // 模擬滑點
    });
  } catch (error: any) {
    console.error("Error processing cross-chain swap:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process swap" },
      { status: 500 }
    );
  }
}
