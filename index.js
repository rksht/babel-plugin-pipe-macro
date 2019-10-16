import traverse from "@babel/traverse";
import * as bt from "@babel/types";
import generate from "@babel/generator";
import { declare } from "@babel/helper-plugin-utils";

function onEnterBinaryExpression(path) {
	const { node } = path;

	if (node.operator !== ">>") {
		return;
	}

	// Rewrite expressions in the left child node
	path.get("left").traverse({
		BinaryExpression: onEnterBinaryExpression
	});

	// Check that the right child node is a function call. Otherwise we raise an exception
	const rightNodePath = path.get("right");
	const rightNode = rightNodePath.node;

	bt.assertCallExpression(rightNode);

	rightNode.arguments = [path.get("left").node, ...rightNode.arguments];

	// Replace the >> expression with the call expression
	path.replaceWith(rightNode);
}

function onEnterDirective(path) {
	const { node } = path;

	const parentType = path.parentPath.node.type;

	// Meaningless if not in program scope
	if (parentType !== "Program") {
		console.log("Not in program scope - Parent type =", parentType);
		return;
	}

	// Directive contains a DirectiveLiteral which contains the value.
	const value = node.value.value;

	if (value !== "use rshift_pipe") {
		return;
	}

	path.parentPath.traverse({ BinaryExpression: onEnterBinaryExpression });
}

function transpileSource(sourceString) {
	const ast = parser.parse(sourceString, { sourceType: "module" });

	traverse(ast, {
		Directive: onEnterDirective
	});

	return ast;
}

function transpile(fileName) {
	fs.readFile(fileName, (err, data) => {
		const source = data.toString();
		const ast = transpileSource(source);
		const { code } = generate(ast, {}, source);
		console.log(code);
	});
}

export default declare((api, options, dirname) => {
	api.assertVersion(7);

	return {
		name: "pipe-macro",
		visitor: {
			Directive: onEnterDirective
		}
	};
});
