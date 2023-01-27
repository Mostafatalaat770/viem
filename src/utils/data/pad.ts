import { SizeExceedsPaddingSizeError } from '../../errors'
import type { ByteArray, Hex } from '../../types'

type PadOptions = {
  dir?: 'left' | 'right'
  size?: number
}
type PadResult<TValue extends ByteArray | Hex> = TValue extends Hex
  ? Hex
  : ByteArray

export function pad<TValue extends ByteArray | Hex>(
  hexOrBytes: TValue,
  { dir, size = 32 }: PadOptions = {},
): PadResult<TValue> {
  if (typeof hexOrBytes === 'string')
    return padHex(hexOrBytes, { dir, size }) as PadResult<TValue>
  return padBytes(hexOrBytes, { dir, size }) as PadResult<TValue>
}

export function padHex(hex_: Hex, { dir, size = 32 }: PadOptions = {}) {
  let hex = hex_.replace('0x', '')
  if (hex.length > size * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size,
      type: 'hex',
    })

  return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](
    size * 2,
    '0',
  )}` as Hex
}

export function padBytes(
  bytes: ByteArray,
  { dir, size = 32 }: PadOptions = {},
) {
  if (bytes.length > size)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size,
      type: 'bytes',
    })
  const paddedBytes = new Uint8Array(size)
  for (let i = 0; i < size; i++) {
    const padEnd = dir === 'right'
    paddedBytes[padEnd ? i : size - i - 1] =
      bytes[padEnd ? i : bytes.length - i - 1]
  }
  return paddedBytes
}
