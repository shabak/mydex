import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import SwapForm from "@/components/swap/swap-form";
import useToken from "@/hooks/useToken";
import { parseAbi } from "viem";
import { useReadContracts } from "wagmi";
import liquidityPoolAbi from "@/hooks/abi/LiquidityPoolAbi";

export default function IndexPage() {
  const LIQUIDITY_POOL_ADDRESS = "0x5BD300735d859b51993C15403746a1D05C8e10A5";
  const erc20Abi = parseAbi([
    "function balanceOf(address) view returns (uint256)",
  ]);
  const { data: poolData } = useReadContracts({
    contracts: [
      {
        address: LIQUIDITY_POOL_ADDRESS,
        abi: liquidityPoolAbi,
        functionName: "token1",
      },
      {
        address: LIQUIDITY_POOL_ADDRESS,
        abi: liquidityPoolAbi,
        functionName: "token2",
      },
    ],
  });

  const token0Address = poolData?.[0]?.result as `0x${string}` | undefined;
  const token1Address = poolData?.[1]?.result as `0x${string}` | undefined;

  const { data: token0 } = useToken({ address: token0Address });
  const { data: token1 } = useToken({ address: token1Address });

  // const { address } = useAccount();
  //
  // const { data: balances } = useReadContracts({
  //   contracts: [
  //     {
  //       address: token0Address,
  //       abi: erc20Abi,
  //       functionName: "balanceOf",
  //       args: [LIQUIDITY_POOL_ADDRESS],
  //     },
  //     {
  //       address: token1Address,
  //       abi: erc20Abi,
  //       functionName: "balanceOf",
  //       args: [LIQUIDITY_POOL_ADDRESS],
  //     },
  //   ],
  // });
  //
  // console.log("balances", balances);
  // console.log("token0", token0);
  // console.log("token1", token1);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>My</span>
          <span className={title({ color: "violet" })}>Dex&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>{token0?.[2]}/{token1?.[2]}</div>
        </div>

        <div className="flex w-96 flex-col ">
          <Tabs aria-label="Action">
            <Tab key="swap" title="Swap">
              <SwapForm />
            </Tab>
            <Tab key="music" title="Add">
              <Card>
                <CardBody></CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </section>
    </DefaultLayout>
  );
}
