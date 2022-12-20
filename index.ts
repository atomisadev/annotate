import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";
import yargs from "yargs";

// Define the compile command
yargs.command({
  command: "compile <input> <output>",
  describe:
    "Compile Markdown files in the input directory to HTML files in the output directory",
  builder: (yargs: any) => {
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
  handler: (argv: any) => {
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
            const html = marked(data);

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
            const outputPath = path.join(
              outputDir,
              path.basename(file, ".md") + ".html"
            );
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
yargs.parse();

yargs.command({
  command: "help",
  describe: "Show the help text",
  handler: () => {
    yargs.showHelp();
  },
});

// Show the help text if no command is specified
yargs.showHelpOnFail(true);

// Parse the command-line arguments
yargs.parse();
