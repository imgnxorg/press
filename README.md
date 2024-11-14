# IMGNX `0Print`

Tailwind CSS (and otherwise zero-dependency) "Printing Press" for Static Modules.

Works with `0Scrape` to create a scraper that can convert a website's CSS to TailwindCSS.

## Tips

Load from a CDN or use `import()` to reduce bundle size.

CDN:

```HTML
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

[`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#description):

```JS
const { default: React, useEffect, useState, useRef } = import("react")
import("./data.json", { with: { type: "json" } });
```
