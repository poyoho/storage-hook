# storage-hook

<p align="start">
  <a href="https://www.npmjs.com/package/@poyoho/storage-hook"><img src="https://img.shields.io/npm/v/@poyoho/storage-hook.svg" alt="npm package"></a>
  <a href="https://github.com/poyoho/storage-hook/actions/workflows/ci.yml"><img src="https://github.com/poyoho/storage-hook/actions/workflows/ci.yml/badge.svg?branch=master" alt="build status"></a>
  <a href="https://codecov.io/gh/poyoho/storage-hook"><img src="https://codecov.io/gh/poyoho/storage-hook/branch/master/graph/badge.svg?token=IM1TE3Y93B"/></a>
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
