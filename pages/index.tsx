import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseAbi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import useToken from "@/hooks/useToken";
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

  const token1Address = poolData?.[0]?.result as `0x${string}` | undefined;
  const token2Address = poolData?.[1]?.result as `0x${string}` | undefined;

  const { data: token1 } = useToken({ address: token1Address });
  const { data: token2 } = useToken({ address: token2Address });

  const { address } = useAccount();

  const { data: balances } = useReadContracts({
    contracts: [
      {
        address: token1Address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [LIQUIDITY_POOL_ADDRESS],
      },
      {
        address: token2Address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [LIQUIDITY_POOL_ADDRESS],
      },
    ],
  });

  console.log("balances", balances);
  console.log("token1", token1);
  console.log("token2", token2);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>My</span>
          <span className={title({ color: "violet" })}>Dex&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>ADV/SEN</div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
