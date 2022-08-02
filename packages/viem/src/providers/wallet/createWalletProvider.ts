import { Chain } from '../../chains'
import { Events } from '../../types/ethereum-provider'
import {
  BaseProvider,
  BaseProviderRequestFn,
  createBaseProvider,
} from '../createBaseProvider'

export type WalletProviderConfig<
  TChain extends Chain = Chain,
  TRequestFn extends BaseProviderRequestFn = BaseProviderRequestFn,
> = BaseProvider<TChain, TRequestFn> & {
  /** Event listener callback that matches the EIP-1193 events spec. */
  on: Events['on']
  /** Event listener callback that matches the EIP-1193 events spec. */
  removeListener: Events['removeListener']
}

export type WalletProvider<
  TChain extends Chain = Chain,
  TRequestFn extends BaseProviderRequestFn = BaseProviderRequestFn,
> = WalletProviderConfig<TChain, TRequestFn> & {
  type: 'walletProvider'
}

/**
 * @description Creates a provider that is intended to be used as a base for
 * wallet providers. A wallet provider performs requests to an Ethereum node
 * via a JSON-RPC API that the wallet controls (Injected MetaMask, WalletConnect, etc).
 * They have access to "public" RPC methods as well as event listeners. */
export function createWalletProvider<
  TChain extends Chain,
  TRequestFn extends BaseProviderRequestFn,
>({
  chains,
  id,
  name,
  on,
  removeListener,
  request,
}: WalletProviderConfig<TChain, TRequestFn>): WalletProvider<
  TChain,
  TRequestFn
> {
  const baseProvider = createBaseProvider({
    chains,
    id,
    name,
    request,
  })
  return {
    ...baseProvider,
    on,
    removeListener,
    type: 'walletProvider',
  }
}
