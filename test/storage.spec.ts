import { describe, expect, test, spyOn } from "vitest"
import { StorageError, ErrorCodes, errorMessages, useLocalStorage, useSessionStorage } from '../lib';

type Factory = typeof useLocalStorage | typeof useSessionStorage

describe('storage', () => {
  test("no support local storage", () => {
    const ls = globalThis.localStorage
    delete (globalThis as any).localStorage
    try {
      useLocalStorage({ numberTest: Number })
    } catch (e) {
      expect(e.message).toContain(errorMessages[ErrorCodes.LOCALSTORAGE_NOTSUPPORT])
      expect(e.code).toEqual(ErrorCodes.LOCALSTORAGE_NOTSUPPORT)
    }
    (globalThis as any).localStorage = ls
  })

  test("no support session storage", () => {
    const ss = globalThis.sessionStorage
    delete (globalThis as any).sessionStorage
    try {
      useSessionStorage({ numberTest: Number })
    } catch (e) {
      expect(e.message).toContain(errorMessages[ErrorCodes.SESSIONSTORAGE_NOTSUPPORT])
      expect(e.code).toEqual(ErrorCodes.SESSIONSTORAGE_NOTSUPPORT)
    }
    (globalThis as any).sessionStorage = ss
  })

  describe("localStorage", () => {
    testUnit(useLocalStorage, window.localStorage)
  })

  describe("sessionStorage", () => {
    testUnit(useSessionStorage, window.sessionStorage)
  })
})

function testUnit (factory: Factory, storage: Storage) {
  describe(`${factory.name} simple`, () => {
    test('number', async () => {
      const instance = factory({
        number: Number,
      })
      const val_reject = await instance.getItem("number").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)

      instance.setItem("number", 123)
      const val = await instance.getItem("number")
      expect(val).toBe(123)
    })

    test('string', async () => {
      const instance = factory({
        string: String,
      })
      const val_reject = await instance.getItem("string").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)

      instance.setItem("string", "123")
      const val = await instance.getItem("string")
      expect(val).toContain("123")
    })

    test('boolean', async () => {
      const instance = factory({
        boolean: Boolean,
      })
      const val_reject = await instance.getItem("boolean").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)

      instance.setItem("boolean", true)
      const val = await instance.getItem("boolean")
      expect(val).toBe(true)
    })

    test('date', async () => {
      const instance = factory({
        date: Date,
      })
      const val_reject = await instance.getItem("date").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)

      const date = new Date()
      instance.setItem("date", date)
      const val = await instance.getItem("date")
      expect(val).toEqual(date)
    })

    test('object', async () => {
      interface Hello {
        world: string
      }
      const instance = factory({
        hello: Object as unknown as Hello,
      })
      const val_reject = await instance.getItem("hello").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)

      const hello = { world: "world" }
      instance.setItem("hello", hello)
      const val = await instance.getItem("hello")
      expect(val).toEqual(hello)
    })

    test('array', async () => {
      const instance = factory({
        array: Array as unknown as Array<number>,
      })
      const val_reject = await instance.getItem("array").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)

      const testArray = [1,2,3]
      instance.setItem("array", testArray)
      const val = await instance.getItem("array")
      expect(val).toEqual(testArray)
    })

    test('removeItem', async () => {
      const instance = factory({
        delete1: Number,
        delete2: Number,
      })
      instance.setItem("delete1", 1)
      instance.setItem("delete2", 1)
      instance.removeItem("delete1")
      const val_reject = await instance.getItem("delete1").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)
      const val = await instance.getItem("delete2")
      expect(val).toEqual(1)
    })

    test('clear', async () => {
      const instance = factory({
        clear1: Number,
        clear2: Number,
      })
      instance.setItem("clear1", 1)
      instance.setItem("clear2", 1)
      instance.clear()
      const val_reject = await instance.getItem("clear1").catch((res: StorageError) => res.code)
      expect(val_reject).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)
      const val_reject2 = await instance.getItem("clear2").catch((res: StorageError) => res.code)
      expect(val_reject2).toBe(ErrorCodes.STORAGE_KEY_UNDEFINED)
    })
  })

  describe(`${factory.name} unexpected`, () => {
    test('number unexpected', async () => {
      storage.setItem("number_unexpected", "unexpected")
      const instance = factory({
        number_unexpected: Number,
      })
      const val_unexpected = await instance.getItem("number_unexpected").catch((e: StorageError) => e.code)
      expect(val_unexpected).toBe(ErrorCodes.STORAGE_UNEXPECTED_NUMBER)
    })

    test('date unexpected', async () => {
      storage.setItem("date_unexpected", "unexpected")
      const instance = factory({
        date_unexpected: Date,
      })
      const val_unexpected = await instance.getItem("date_unexpected").catch((e: StorageError) => e.code)
      expect(val_unexpected).toBe(ErrorCodes.STORAGE_UNEXPECTED_DATE)
    })

    test('object unexpected', async () => {
      interface User { name: string }
      storage.setItem("object_unexpected", "unexpected")
      const instance = factory({
        object_unexpected: Object as unknown as User,
      })
      const val_unexpected = await instance.getItem("object_unexpected").catch((e: StorageError) => e.code)
      expect(val_unexpected).toBe(ErrorCodes.STORAGE_UNEXPECTED_OBJECT)
    })

    test('array unexpected', async () => {
      storage.setItem("array_unexpected", "{}")
      const instance = factory({
        array_unexpected: Array as unknown as Array<number>,
      })
      const val_unexpected = await instance.getItem("array_unexpected").catch((e: StorageError) => e.code)
      expect(val_unexpected).toBe(ErrorCodes.STORAGE_UNEXPECTED_OBJECT)

      storage.setItem("array_unexpected", "unexpected")
      const val_unexpected2 = await instance.getItem("array_unexpected").catch((e: StorageError) => e.code)
      expect(val_unexpected2).toBe(ErrorCodes.STORAGE_UNEXPECTED_OBJECT)
    })

    test('key repeat', () => {
      spyOn(console, 'warn').mockImplementation((data) => {
        expect(data.code).toEqual(ErrorCodes.STORAGE_KEY_REPEAT);
      })
      factory({ numberTest: Number })
      factory({ numberTest: Number })      
    })
  })
}
