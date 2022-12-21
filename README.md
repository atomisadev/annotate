# 📓 Annotate

Easily compile your notes in markdown into static web pages. You can then deploy these static pages to your host of choice such as GitHub Pages, Vercel, Netlify, etc.

## Features

- Automatic LaTex support (`$` for inline, `$$$` for multi-line)
- Table of Contents
- Instant compilation
- Easy deployment
- Development mode (serve your HTML websites automatically using `annotate serve`)
  - HMR (hot module replacement) coming soon

## Installation

Installation of this is quite simple. You can clone the source code and run it. Or, if you prefer a CLI tool, you can install `annotate` from npm.

```bash
npm install -g @atomdevelops/annotate
```

Once you've installed `annotate`, you can use it in your terminal.

```
annotate --help
```

## Usage

The `annotate` CLI currently only offers two stable commands. Suggestions are highly recommended, you may leave them in the [Issues](https://github.com/atomisadev/annotate/issues) tab.

### annotate compile
#### Description
Main command to compile your markdown files into statically generated, deployable HTML documents.

#### Parameters
- `inputDir` - Input directory containing the markdown files to be compiled
- `outputDir` - Output directory where the HTML files should be compiled to

#### Example
```bash
annotate compile inputDirectory/ outputDirectory/
```

### annotate serve -d (directory) -p (port)
#### Description
Automatically serve your statically generated HTML using Express to a provided port (defaulted to `8080`).

#### Parameters
- `--directory`, `-d` - Directory to serve the HTML files
- `--port`, `-p` - Port to listen to (if not provided, defaulted to `8080`)

#### Example
```bash
annotate serve -d outputDirectory/ -p 3000
```

## Preview

A preview is currently unavailable.
