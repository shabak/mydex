import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";

import liquidityPoolAbi from "@/hooks/abi/LiquidityPoolAbi";
import { POOL_ADDRESS, TOKEN0_ADDRESS } from "@/config/contracts";

const SwapForm: React.FC = () => {
  const { address } = useAccount();
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  const { data: balance0 } = useBalance({
    address,
    token: TOKEN0_ADDRESS,
  });

  let amountInBN = parseUnits(amountIn || "0", 18);
  const { data: amountOutData, refetch: refetchAmountOut, isError, error } = useReadContract({
    address: POOL_ADDRESS,
    abi: liquidityPoolAbi,
    functionName: "getAmountOut",
    args: [amountInBN, TOKEN0_ADDRESS],
  });

  console.log("balance0", balance0);
  console.log("amountInBN, TOKEN0_ADDRESS, amountOutData", amountInBN, TOKEN0_ADDRESS, amountOutData);
  console.log("isError", isError, error);

  const { writeContract: swap, data: hash } = useWriteContract();

  const { isLoading: isSwapLoading, isSuccess: isSwapSuccess } =
    useWaitForTransactionReceipt({
      hash: hash,
      confirmations: 1,
    });

  useEffect(() => {
    if (amountOutData) {
      setAmountOut(formatUnits(amountOutData, 18));
    }
  }, [amountOutData]);

  const handleAmountInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountIn(event.target.value);
    refetchAmountOut();
    console.log('handleAmountInChange');
  };

  const handleSwap = () => {
    if (!amountIn || !amountOut) return;
    // console.log("to swap!");
    swap({
      abi: liquidityPoolAbi,
      address: POOL_ADDRESS,
      functionName: "swap",
      args: [
        parseUnits(amountIn, 18),
        TOKEN0_ADDRESS,
        (parseUnits(amountOut, 18) * BigInt(950)) / BigInt(1000), // 5% slippage
      ],
    });
  };

  const isAmountValid = balance0
    ? parseUnits(amountIn || "0", 18) < balance0?.value
    : true;

  return (
    <Card>
      <CardBody>
        <p>Swap Tokens</p>
        <p>
          Balance: {balance0 ? formatUnits(balance0.value, 18) : "0"} TOKEN0
        </p>
        <Input
          isInvalid={!isAmountValid}
          label="ADV"
          placeholder="0.0"
          value={amountIn}
          onChange={handleAmountInChange}
        />
        <Input readOnly label="SEN" placeholder="0.0" value={amountOut} />
        <Button disabled={!isAmountValid || isSwapLoading} onClick={handleSwap}>
          {isSwapLoading ? "Swapping..." : "Swap"}
        </Button>
        {isSwapSuccess && <p color="success">Swap successful!</p>}
      </CardBody>
    </Card>
  );
};

export default SwapForm;
