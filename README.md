# IMGNX `0Print`

Tailwind CSS "Printing Press" for Static Modules.

Works with `0Scrape (imgnx/open-src-scrape)` to create a scraper that can convert a website's CSS to TailwindCSS.

To initialize, just copy the files from the `/template` directory into a folder with the name of your website or run `init.sh` or `init.bat`, passing your websites as an environment (or "PATH") variable (`WEBSITE`).

Examples:
<!--
This README file provides instructions for running the `index.cjs` script on both MacOS and Windows PowerShell.

For MacOS:
- Set the `WEBSITE` environment variable and run the script using the `node` command.

For Windows PowerShell:
- Set the `WEBSITE` environment variable using `$env:WEBSITE` and run the script using the `node` command.
-->

```zsh
# MacOS
WEBSITE=mywebsite.com node index.cjs
```

```pwsh
# Windows PowerShell
$env:WEBSITE="mywebsite.com"
node index.cjs
```

## Tips

### Load from a CDN to reduce bundle size

Loading from a CDN:

```HTML
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://www.unpkg.com/react@^18.3.0/umd/react.development.js" crossorigin></script>
    </head>
    <body>
        <!-- ... -->
    </body>
</html>
```

```JS
const { default: React, useEffect, useState, useRef } = [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#description):("react")
import("./data.json", { with: { type: "json" } });
```

```JS
// webpack.config.js
module.exports = {
    ...
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    }
}
```

## Including static files

You can also just "import" (ie. "Download" ) JS files and put them in the `src/` folder to include them.

## Resources

\* [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#description)
