## babel-plugin-pipe-macro

Use right shift operator like the pipe operator in Elixir. For now, the right hand side of the >> operator should be a function call.

## Usage

Install

```
yarn add babel-plugin-pipe-macro

```

Put this in `.babelrc` along with other plugins

```
"plugins": ["babel-plugin-pipe-macro"]
```

and run babel on your sources.

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

// Create a range of numbers from 1 to 99, extract those that are divisble by 2. Then print with console.log.

({ start: 1, end: 100 })
	>> numberRange()
	>> filter(n => n % 2 == 0)
	>> console.log();

```
