import type { WalletClient } from '../../clients'
import { BaseError } from '../../errors'
import type { Address, ByteArray, Hex } from '../../types'
import { encodeHex } from '../../utils'

export type SignMessageArgs = {
  from: Address
  data: Hex | ByteArray
}

export type SignMessageResponse = Hex

export async function signMessage(
  client: WalletClient,
  { from, data: data_ }: SignMessageArgs,
): Promise<SignMessageResponse> {
  let data
  if (typeof data_ === 'string') {
    if (!data_.startsWith('0x'))
      throw new BaseError(
        `data ("${data_}") must be a hex value. Encode it first to a hex with the \`encodeHex\` util.`,
        {
          docsPath: '/TODO',
        },
      )
    data = data_
  } else {
    data = encodeHex(data_)
  }
  const signed = await client.request({
    method: 'personal_sign',
    params: [data, from],
  })
  return signed
}
