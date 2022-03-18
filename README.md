# storage-hook

storage-hook ensures that the original type of js (String / Boolean / Number / Date / Object / Array) is stable.

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
