import contractConfig from "./contract-config.json";
import { type TransactionReceipt, decodeEventLog } from "viem";

export const PASEO_CHAIN = {
  id: contractConfig.chain.id,
  name: contractConfig.chain.name,
  rpcUrls: contractConfig.chain.rpcUrls,
  blockExplorers: contractConfig.chain.blockExplorers,
  nativeCurrency: contractConfig.chain.nativeCurrency,
};

export const CONTRACT = {
  address: contractConfig.address as `0x${string}`,
  abi: contractConfig.abi,
};

export interface DecodedEvent {
  eventName: string;
  args: Record<string, unknown>; // <- siempre objeto
}

// Convierte array/undefined a objeto plano {"0":..., "1":...}
function toRecord(args: readonly unknown[] | Record<string, unknown> | undefined): Record<string, unknown> {
  if (!args) return {};
  if (Array.isArray(args)) {
    const out: Record<string, unknown> = {};
    args.forEach((v, i) => {
      out[String(i)] = v;
    });
    return out;
  }
  return args as Record<string, unknown>;
}

export function decodeReceiptEvents(receipt: TransactionReceipt): DecodedEvent[] {
  const decodedEvents: DecodedEvent[] = [];

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: CONTRACT.abi,
        data: log.data,
        topics: log.topics,
      });
      decodedEvents.push({
        eventName: decoded.eventName ?? "UnknownEvent",
        args: toRecord(decoded.args as readonly unknown[] | Record<string, unknown> | undefined),
      });
    } catch (error) {
      console.log("Could not decode log:", error);
    }
  }

  return decodedEvents;
}

export function generateClaimId(): `0x${string}` {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return `0x${Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}` as `0x${string}`;
}
