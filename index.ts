import * as fs from "fs";
import { marked } from "marked";

const inputDir = "./input";
const outputDir = "./output";

// Check if the input directory exists
if (fs.existsSync(inputDir)) {
  // Read the contents of the input directory
  const files = fs.readdirSync(inputDir);

  // Filter the list of files to only include markdown files
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  // If there are markdown files in the input directory
  if (markdownFiles.length > 0) {
    // Iterate over the markdown files
    markdownFiles.forEach((file) => {
      // Read the contents of the markdown file
      const markdown = fs.readFileSync(`${inputDir}/${file}`, "utf8");

      // Convert the markdown to HTML
      const html = marked(markdown);

      // Add a stylesheet to the HTML
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
      .toc {
        grid-column: 1;
      }
      .content {
        grid-column: 2;
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
      const headings = document.querySelectorAll('main h2, main h3, main h4');

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

      // Check if the output directory exists
      if (!fs.existsSync(outputDir)) {
        // Create the output directory if it doesn't exist
        fs.mkdirSync(outputDir);
      }

      // Write the styled HTML to a file in the output directory
      fs.writeFileSync(`${outputDir}/${file}.html`, styledHtml);
    });
  }
}
