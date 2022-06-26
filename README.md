# storage-hook

<p align="start">
  <a href="https://www.npmjs.com/package/store-hook"><img src="https://img.shields.io/npm/v/store-hook.svg" alt="npm package"></a>
  <a href="https://github.com/poyoho/storage-hook/actions/workflows/ci.yml"><img src="https://github.com/poyoho/storage-hook/actions/workflows/ci.yml/badge.svg?branch=master" alt="build status"></a>
  <a href="https://codecov.io/gh/poyoho/storage-hook"><img src="https://codecov.io/gh/poyoho/storage-hook/branch/master/graph/badge.svg"/></a>
  <!-- <a href="https://packagephobia.com/result?p=store-hook"><img src="https://packagephobia.com/badge?p=store-hook"/></a> -->
</p>
<br/>

storage-hook ensures that the original type of js (String / Boolean / Number / Date / Object / Array) is stable in storage (localStorage, sessionStorage and more).

## Installing

Using npm:

```sh
$ npm install store-hook
```

Using yarn:

```sh
$ yarn add store-hook
```

Using unpkg CDN:

```
<script src="https://unpkg.com/store-hook/dist/storage-hook.iife.js"></script>
```

## Example

`useLocalStorage` create a type stable localstorage instance.

```ts
interface User {
  name: string
}

const ls = useLocalStorage({
  key1: Boolean,
  key2: Number,
  key3: String,
  user: Object as unknown as User
})
```

we can use localstorage api and had the expect type.

```ts
const key1 = ls.getItem('key1')
// must be boolean or not will throw a promise error
key1
```

setting storage.

```ts
ls.setItem('key1', true)
```

remove storage key.

```ts
ls.removeItem('key1')
```

clear all storage keys.

```ts
ls.clear()
```

exact the options types.

```ts
type Options = ExactStorageOptions<typeof ls>
```

### about deep object

But there is no way to ensure the type of Object after ts coercion (e.g. `interface User` in this example).

we don't traverse the object to make the object type stable.

```ts
const user = ls.getItem('key4')
// not necessarily exist and type not necessarily be string
user.name
```

Provide two ideas：

1. flat user object by new storage.

```ts
const user = useLocalStorage({
  name: String
  age: Number
})
```

2. validate by yourself.
