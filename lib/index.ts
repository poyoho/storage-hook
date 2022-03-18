import { createCommonError, ErrorCodes } from './error'
import { OptionMap, useStorage } from './storage'

const localStorageUsedKeys = new Set<string>()
const sessionStorageUsedKeys = new Set<string>()

export function useLocalStorage<Options extends OptionMap = OptionMap>(
  options: Options
) {
  if (!window.localStorage) {
    throw createCommonError(ErrorCodes.LOCALSTORAGE_NOTSUPPORT)
  }
  Object.keys(options).forEach((key) => {
    if (localStorageUsedKeys.has(key)) {
      console.warn(createCommonError(ErrorCodes.STORAGE_KEY_REPEAT, `(${key})`))
    } else {
      localStorageUsedKeys.add(key)
    }
  })
  return useStorage(options, window.localStorage)
}

export function useSessionStorage<Options extends OptionMap = OptionMap>(
  options: Options
) {
  if (!window.sessionStorage) {
    throw createCommonError(ErrorCodes.SESSIONSTORAGE_NOTSUPPORT)
  }
  Object.keys(options).forEach((key) => {
    if (sessionStorageUsedKeys.has(key)) {
      console.warn(createCommonError(ErrorCodes.STORAGE_KEY_REPEAT, `(${key})`))
    } else {
      sessionStorageUsedKeys.add(key)
    }
  })
  return useStorage(options, window.sessionStorage)
}

export * from './storage'
export type { StorageError } from './error'
export { ErrorCodes, errorMessages } from './error'
