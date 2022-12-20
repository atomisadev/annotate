#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const marked_1 = require("marked");
const express_1 = __importDefault(require("express"));
const yargs_1 = __importDefault(require("yargs"));
// Define the compile command
yargs_1.default.command({
    command: "compile <input> <output>",
    describe: "Compile Markdown files in the input directory to HTML files in the output directory",
    builder: (yargs) => {
        return yargs
            .positional("input", {
            describe: "The input directory",
            type: "string",
        })
            .positional("output", {
            describe: "The output directory",
            type: "string",
        });
    },
    handler: (argv) => {
        const inputDir = argv.input;
        const outputDir = argv.output;
        // Read the contents of the input directory
        fs.readdir(inputDir, (err, files) => {
            if (err) {
                console.error(`Error reading input directory: ${err}`);
                return;
            }
            // Iterate over the files in the input directory
            for (const file of files) {
                // Check if the file is a Markdown file
                if (path.extname(file) === ".md") {
                    // Read the contents of the Markdown file
                    fs.readFile(path.join(inputDir, file), "utf8", (readErr, data) => {
                        if (readErr) {
                            console.error(`Error reading file ${file}: ${readErr}`);
                            return;
                        }
                        // Convert the Markdown content to HTML
                        const html = (0, marked_1.marked)(data);
                        const styledHtml = `
               <html>
        <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            body {
            font-family: "Inter", sans-serif; 
            }
            .container {
              display: grid;
              grid-template-columns: 250px 1fr;
            }
            a {
              text-decoration: none;
              color: black;
            }
            a:hover {
              text-decoration: underline;
              text-underline-offset: 2px;
            }
            .toc {
              grid-column: 1;
            }
            .content {
              grid-column: 2;
            }
            .toc h2 {
              margin-left: 15px;
            }
            .toc h3 {
              margin-left: 30;
            }
            .toc h4 {
              margin-left: 45px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <nav class="toc">
              <!-- TOC goes here -->
            </nav>
            <main class="content">
              ${html}
            </main>
          </div>
          <script>
            // Extract headings from the content
            const headings = document.querySelectorAll('main h1, main h2, main h3, main h4');
            // Generate the TOC
            const toc = document.createElement('ul');
            headings.forEach(heading => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.textContent = heading.textContent;
              a.href = \`#\${heading.id}\`;
              li.appendChild(a);
              toc.appendChild(li);
            });
            // Insert the TOC into the page
            document.querySelector('.toc').appendChild(toc);
          </script>
        </body>
      </html>
            `;
                        // Write the HTML content to a new file in the output directory
                        const outputPath = path.join(outputDir, path.basename(file, ".md") + ".html");
                        fs.writeFile(outputPath, styledHtml, (writeErr) => {
                            if (writeErr) {
                                console.error(`Error writing file ${outputPath}: ${writeErr}`);
                                return;
                            }
                            console.log(`Successfully converted ${file} to ${outputPath}`);
                        });
                    });
                }
            }
        });
    },
});
// Parse the command-line arguments
yargs_1.default.parse();
yargs_1.default.command({
    command: "serve",
    describe: "Serve HTML files from a directory on a given port",
    builder: (yargs) => {
        return yargs
            .option("directory", {
            alias: "d",
            describe: "The directory containing the HTML files",
            type: "string",
            demandOption: true,
        })
            .option("port", {
            alias: "p",
            describe: "The port to serve the files on",
            type: "number",
            default: 8080,
        });
    },
    handler: (argv) => {
        const directory = argv.directory;
        const port = argv.port;
        // Create an Express app
        const app = (0, express_1.default)();
        // Serve static files from the specified directory
        app.use(express_1.default.static(directory));
        // Listen for requests on the specified port
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    },
});
yargs_1.default.parse();
yargs_1.default.command({
    command: "help",
    describe: "Show the help text",
    handler: () => {
        yargs_1.default.showHelp();
    },
});
// Show the help text if no command is specified
yargs_1.default.showHelpOnFail(true);
// Parse the command-line arguments
yargs_1.default.parse();
