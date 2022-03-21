import { createAsyncCommonError, ErrorCodes } from './error'

type Type<T = any> = { new (...args: any[]): T & {} } | { (): T }

// Boolean -> boolean Number -> number ...
export type InferKeyType<T> = T extends ObjectConstructor
  ? Record<string, any> | null
  : T extends NumberConstructor
  ? number
  : T extends StringConstructor
  ? string
  : T extends BooleanConstructor
  ? boolean
  : T extends DateConstructor
  ? Date
  : T extends Type<infer V>
  ? V | null
  : T

export type OptionMap<P = Record<string, unknown>> = {
  [K in keyof P]: Type<P[K]> | object // object for support `as any as Interface`
}

export type ExactStorageOptions<T> = T extends StorageAccessor<infer N>
  ? N extends Object
    ? { [K in keyof N]: InferKeyType<N[K]> }
    : never
  : never

export interface StorageAccessor<Options> {
  getItem<K extends string & keyof Options>(
    key: K
  ): Promise<InferKeyType<Options[K]>>
  setItem<K extends string & keyof Options>(
    key: K,
    val: InferKeyType<Options[K]>
  )
  clear(): void
  removeItem(key: string & keyof Options): void
}

export function useStorage<Options extends OptionMap = OptionMap>(
  options: Options,
  storage: Storage
): StorageAccessor<Options> {
  const result: StorageAccessor<Options> = {
    async getItem<K extends string & keyof Options>(
      key: K
    ): Promise<InferKeyType<Options[K]>> {
      const value = storage.getItem(key)
      const constructor: Type<unknown> = options[key] as any
      if (value === null) {
        return createAsyncCommonError(ErrorCodes.STORAGE_KEY_UNDEFINED)
      }
      let formatData: any
      switch (constructor) {
        case Boolean:
          formatData =
            value === 'true' ? true : value === 'false' ? false : Boolean(value)
          break
        case Number:
          formatData = Number(value)
          if (Number.isNaN(formatData)) {
            return createAsyncCommonError(
              ErrorCodes.STORAGE_UNEXPECTED_NUMBER,
              `(${key})`
            )
          }
          break
        case Date: // save number can accurate to the millisecond
          formatData = Number(value)
          if (Number.isNaN(formatData)) {
            return createAsyncCommonError(
              ErrorCodes.STORAGE_UNEXPECTED_DATE,
              `(${key})`
            )
          }
          formatData = new Date(formatData)
          break
        case Object:
          try {
            formatData = JSON.parse(value)
          } catch (e) {
            return createAsyncCommonError(
              ErrorCodes.STORAGE_UNEXPECTED_OBJECT,
              `(${key})`
            )
          }
          break
        case Array:
          try {
            formatData = JSON.parse(value)
            if (!Array.isArray(formatData)) {
              return createAsyncCommonError(
                ErrorCodes.STORAGE_UNEXPECTED_OBJECT,
                `(${key})`
              )
            }
          } catch (e) {
            return createAsyncCommonError(
              ErrorCodes.STORAGE_UNEXPECTED_OBJECT,
              `(${key})`
            )
          }
          break
        default:
          formatData = String(value)
      }
      return formatData
    },

    setItem<K extends string & keyof Options>(
      key: K,
      val: InferKeyType<Options[K]>
    ) {
      if (val instanceof Date) {
        storage.setItem(key, String(val.getTime()))
      } else if (typeof val === 'object') {
        storage.setItem(key, JSON.stringify(val))
      } else {
        storage.setItem(key, String(val))
      }
    },

    clear() {
      storage.clear()
    },

    removeItem(key: string & keyof Options) {
      storage.removeItem(key)
    }
  }

  return result
}
