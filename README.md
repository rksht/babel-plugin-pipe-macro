## babel-plugin-pipe-macro

Use right shift operator like the pipe operator in Elixir.

## Usage

Put this in `.babelrc`

```
"plugins": ["babel-plugin-pipe-macro"]
```

## Example

```

"use rshift_pipe";

function filter(array, fn) {
	const out = [];
	for (const item of array) {
		if (fn(item)) {
			out.push(item);
		}
	}
	return out;
}

function numberRange({ start, end }) {
	const out = [];
	for (let i = start; i < end; ++i) {
		out.push(i);
	}
	return out;
}

({ start: 1, end: 100 })
	>> numberRange()
	>> filter(n => n % 2 == 0)
	>> console.log();


```