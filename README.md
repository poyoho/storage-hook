# storage-hook

<p align="start">
  <a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/@poyoho/storage-hook.svg" alt="npm package"></a>
  <a href="https://github.com/vitejs/vite/actions/workflows/ci.yml"><img src="https://github.com/vitejs/vite/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
  <!-- <a href="https://codecov.io/github/poyoho/storage-hook"><img src="https://badgen.net/codecov/c/github/poyoho/storage-hook" alt="code coverage"></a> -->
</p>
<br/>

storage-hook ensures that the original type of js (String / Boolean / Number / Date / Object / Array) is stable in storage (localStorage, sessionStorage and more).

**example**

```ts
interface User {
  name: string
}

const test = useLocalStorage({
  aa: Boolean,
  bb: Number,
  cc: String,
  asd: Object as unknown as User
})

test.getItem('aa')
```

**about object**

```ts
interface User {
  name: string
  age?: number
}
useLocalStorage({
  user: Object as unknown as User
})
```

There is no way to ensure the type of Object after ts coercion (e.g. `interface User` in the above example).

Provide two ideas：

1. flat user object by new storage.

```ts
const user = useLocalStorage({
  name: String
  age: Number
})
```

2. validate by yourself.
