import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Wallet } from "lucide-react";
import { parseUnits } from "viem";
import { useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { unichainSepolia } from "wagmi/chains";

const BuyForm = ({ data }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const tokenData = {
    name: "ISO Token",
    symbol: "ISO",
    userBalance: "1000",
    price: "0.01",
    maxPurchase: "10000",
  };

  useEffect(() => {
    setIsWrongNetwork(chainId !== unichainSepolia.id);
  }, [chainId]);

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const {
    isLoading: isTransactionPending,
    isSuccess: isTransactionSuccess,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isTransactionSuccess) {
      setIsLoading(false);
      setAmount("");
    }
  }, [isTransactionSuccess]);

  useEffect(() => {
    if (writeError || transactionError) {
      setError(writeError?.message || transactionError?.message || "Transaction failed");
      setIsLoading(false);
    }
  }, [writeError, transactionError]);

  const getPythPriceData = async () => {
    try {
      const connection = new EvmPriceServiceConnection("https://hermes.pyth.network");
      const priceIds = ["0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"];
      const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);
      return priceFeedUpdateData;
    } catch (error) {
      console.error("Error fetching Pyth price data:", error);
      throw error;
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      await switchChain({ chainId: unichainSepolia.id });
    } catch (error: any) {
      setError("Failed to switch network: " + error.message);
    }
  };

  const handleBuy = async () => {
    try {
      if (isWrongNetwork) {
        await handleNetworkSwitch();
        return;
      }

      setIsLoading(true);
      setError("");

      const amountInUSD = parseUnits(amount, 6);
      const priceUpdates = await getPythPriceData();

      writeContract({
        address: "0xd9fbde12bac5681b8b9a92810c3f3a48286a916e",
        abi: [
          {
            type: "function",
            name: "buy",
            inputs: [
              { name: "token", type: "address", internalType: "address" },
              { name: "amountToBuyInUSD", type: "uint256", internalType: "uint256" },
              { name: "shouldCreateLP", type: "bool", internalType: "bool" },
              { name: "priceUpdates", type: "bytes[]", internalType: "bytes[]" },
            ],
            outputs: [],
            stateMutability: "payable",
          },
        ],
        functionName: "buy",
        args: [data.address, amountInUSD, false, priceUpdates],
        value: BigInt(50000000),
      });
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full max-w-lg mx-auto"
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-wheat to-wheat/80 bg-clip-text text-transparent">
            Buy {data.title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-wheat/60">
            <Wallet className="w-4 h-4" />
            <span>
              Your Balance: {tokenData.userBalance} {data.description}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm text-wheat/80">
            <span>Amount to Purchase</span>
            <span>Price: {tokenData.price} ETH per token</span>
          </div>

          <div className="relative">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-black/30 border-gray-800 rounded-xl pr-16 text-wheat placeholder:text-wheat/40 focus:ring-wheat/20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-wheat/60">{data.description}</span>
          </div>

          <div className="flex justify-between text-sm text-wheat/60">
            <span>Max: {tokenData.maxPurchase}</span>
            <span>Total: {amount ? (Number(amount) * Number(tokenData.price)).toFixed(4) : "0"} ETH</span>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <Button
            className="w-full bg-wheat/10 hover:bg-wheat/20 text-wheat border border-wheat/20 rounded-xl h-12 transition-all duration-200 shadow-lg shadow-wheat/5"
            onClick={handleBuy}
            disabled={isLoading || isTransactionPending || !amount}
          >
            {isLoading || isTransactionPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isTransactionPending ? "Confirming..." : "Processing..."}
              </>
            ) : isWrongNetwork ? (
              "Switch to Unichain"
            ) : (
              <>
                Buy {tokenData.symbol}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BuyForm;
