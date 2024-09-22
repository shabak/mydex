import { useReadContracts } from "wagmi";
import { erc20Abi, isAddress } from "viem";

type Params = {
  address?: `0x${string}`;
};

const useToken = ({ address }: Params) => {
  return useReadContracts({
    allowFailure: false,
    query: {
      enabled: !!address && isAddress(address),
    },
    contracts: [
      {
        address: address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: "totalSupply",
      },
    ],
  });
};

export default useToken;
