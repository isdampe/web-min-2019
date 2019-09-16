const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const main = (argc, argv) => {
	if (argc < 3) {
		console.error("Syntax: proc.js [command]");
		process.exit(0);
	}

	switch (argv[argc -1]) {
		case "component":
			createComponent();
			break;
		default:
			console.error("ERROR: Unknown command " + argv[argc -1]);
			process.exit(1);
	}

};

const createComponent = () => {
	rl.question("Enter the component name: ", (name) => {
		if (! name) {
			console.error("ERROR: No component name provided");
			process.exit(0);
		}

		name = name.toLowerCase();

		rl.question("Is a TypeScript component needed? (Y/N) ", (answer) => {
			needsComponent = (answer.toLowerCase()[0] === "y");
			insertComponent(name, needsComponent)
		});

	});
};

const insertComponent = (name, needsComponent) => {
	if (fs.existsSync(`./assets/scss/components/_${name}.scss`)) {
		console.error(`ERROR: Component ${name} already exists in scss/components.`);
		process.exit(1);
	}

	const tsName = name.substr(0, 1).toUpperCase() + name.substr(1);
	if (needsComponent && fs.existsSync(`./assets/ts/components/${tsName}.ts`)) {
		console.error(`ERROR: Component ${name} already exists in ts/components.`);
		process.exit(1);
	}

	// Write the file.
	fs.writeFileSync(`./assets/scss/components/_${name}.scss`, 
		`@import "../_defs";\n\n`, {encoding: "utf8"});

	// Add it to app.scss.
	const appScss = fs.readFileSync(`./assets/scss/app.scss`, {encoding: "utf8"});
	let scssLines = appScss.split("\n");
	let newLines = [];
	for (let line of scssLines) {
		if (line.trim() == "// END COMPONENTS") {
			newLines.push(`@import "components/_${name}";`);
		}

		newLines.push(line);
	}
	fs.writeFileSync(`./assets/scss/app.scss`, newLines.join("\n"), {encoding: "utf8"});

	if (needsComponent) {
		fs.writeFileSync(`./assets/ts/components/${tsName}.ts`, 
			`import Base from "./_BaseComponent";\nimport $ from "jquery";\n\nclass ${tsName} extends Base.Component {\n\n\tpublic onMount(): void {\n\t}\n\n}\n\nexport default Base.Init("[data-component-${name}]", ${tsName});\n`, {encoding: "utf8"});

		const appTs = fs.readFileSync(`./assets/ts/App.ts`, {encoding: "utf8"});
		let appLines = appTs.split("\n");
		let newLines = [];
		for (let line of appLines) {
			if (line.trim() == "// END COMPONENT IMPORTS")
				newLines.push(`import ${tsName} from "./components/${tsName}";`);

			if (line.trim() == "// END COMPONENT CALLS")
				newLines.push(`\t${tsName}();`);

			newLines.push(line);
		}

		fs.writeFileSync(`./assets/ts/App.ts`, newLines.join("\n"), {encoding: "utf8"});
	}

	console.log(`${name} was created.`);
	process.exit(0);

};

main(process.argv.length, process.argv);
