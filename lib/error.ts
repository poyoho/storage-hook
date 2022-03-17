export const enum ErrorCodes {
  LOCALSTORAGE_NOTSUPPORT,
  SESSIONSTORAGE_NOTSUPPORT,
  STORAGE_KEY_REPEAT,
  STORAGE_KEY_UNDEFINED,
  STORAGE_UNEXPECTED_NUMBER,
  STORAGE_UNEXPECTED_OBJECT,
  STORAGE_UNEXPECTED_DATE,
}

export const errorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.LOCALSTORAGE_NOTSUPPORT]: '[LocalStorage] is not supprt',
  [ErrorCodes.SESSIONSTORAGE_NOTSUPPORT]: '[SessionStorage] is not supprt',
  [ErrorCodes.STORAGE_KEY_REPEAT]: '[Storage] used key',
  [ErrorCodes.STORAGE_KEY_UNDEFINED]: '[Storage] undefined key',
  [ErrorCodes.STORAGE_UNEXPECTED_NUMBER]: '[Storage] not expected number key',
  [ErrorCodes.STORAGE_UNEXPECTED_OBJECT]: '[Storage] not expected object key',
  [ErrorCodes.STORAGE_UNEXPECTED_DATE]: '[Storage] not expected date key',
}

export interface StorageError extends SyntaxError {
  code: ErrorCodes
}

export function createCommonError (
  code: ErrorCodes,
  additionalMessage?: string
) {
  const msg = errorMessages[code] + (additionalMessage || '')
  const error = new Error(msg) as StorageError
  error.code = code
  return error
}

export function createAsyncCommonError (
  code: ErrorCodes,
  additionalMessage?: string
) {
  return Promise.reject(createCommonError(code, additionalMessage || ''))
}
