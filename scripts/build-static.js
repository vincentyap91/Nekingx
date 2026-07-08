const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
let includeId = 0;

const readText = (filePath) => fs.readFileSync(filePath, "utf8");

const includePathToFile = (includePath) => {
    const localPath = includePath.replace(/^\/+/, "");
    return path.join(rootDir, localPath);
};

const selectVariant = (html, variant) => {
    if (!variant) {
        return html;
    }

    const escapedVariant = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`<template\\s+data-component-variant=["']${escapedVariant}["']\\s*>\\s*([\\s\\S]*?)\\s*</template>`, "i");
    const match = html.match(pattern);
    return match ? match[1].trim() : html;
};

const expandIncludes = (html) => {
    const includePattern = /<div\b([^>]*?)\sdata-include=["']([^"']+)["']([^>]*)>\s*<\/div>/gi;
    let output = html;

    while (includePattern.test(output)) {
        includePattern.lastIndex = 0;
        output = output.replace(includePattern, (fullMatch, beforeAttrs, includePath, afterAttrs) => {
            const attrs = `${beforeAttrs} ${afterAttrs}`;
            const variantMatch = attrs.match(/\sdata-variant=["']([^"']+)["']/i);
            const includeFile = includePathToFile(includePath);

            if (!fs.existsSync(includeFile)) {
                throw new Error(`Missing include file: ${includePath}`);
            }

            const variant = variantMatch ? variantMatch[1] : "";
            return selectVariant(readText(includeFile), variant).replaceAll("__INCLUDE_ID__", `static${++includeId}`);
        });
    }

    return output;
};

const rewriteUrlForDist = (url) => {
    if (
        !url ||
        url.startsWith("#") ||
        /^[a-z][a-z0-9+.-]*:/i.test(url) ||
        url.startsWith("//")
    ) {
        return url;
    }

    if (url.startsWith("/assets/")) {
        return `..${url}`;
    }

    if (url.startsWith("/css/")) {
        return `..${url}`;
    }

    if (url.startsWith("/js/")) {
        return `..${url}`;
    }

    if (url.startsWith("/") && url.endsWith(".html")) {
        return path.posix.basename(url);
    }

    if (url.startsWith("/")) {
        return `..${url}`;
    }

    if (url.startsWith("assets/") || url.startsWith("css/") || url.startsWith("js/")) {
        return `../${url}`;
    }

    return url;
};

const rewritePathsForDist = (html) => {
    return html.replace(/\b(src|href)=["']([^"']+)["']/gi, (match, attr, url) => {
        return `${attr}="${rewriteUrlForDist(url)}"`;
    });
};

const writeBuiltPage = (fileName, output) => {
    const targetPath = path.join(distDir, fileName);
    const tempPath = `${targetPath}.build-tmp`;
    const fallbackPath = path.join(rootDir, `${fileName}.rebuilt`);

    fs.writeFileSync(tempPath, output, "utf8");

    try {
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }
        fs.renameSync(tempPath, targetPath);
        if (fs.existsSync(fallbackPath)) {
            fs.unlinkSync(fallbackPath);
        }
        return;
    } catch (error) {
        try {
            fs.writeFileSync(targetPath, output, "utf8");
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
            if (fs.existsSync(fallbackPath)) {
                fs.unlinkSync(fallbackPath);
            }
            return;
        } catch (writeError) {
            fs.writeFileSync(fallbackPath, output, "utf8");
            const alternatePath = path.join(distDir, fileName.replace(/\.html$/i, "-new.html"));
            try {
                fs.writeFileSync(alternatePath, output, "utf8");
            } catch (alternateError) {
                console.warn(`Could not write ${path.basename(alternatePath)}: ${alternateError.message}`);
            }
            if (fs.existsSync(tempPath)) {
                try {
                    fs.unlinkSync(tempPath);
                } catch (cleanupError) {
                    // Keep the temp file when cleanup is blocked.
                }
            }
            throw new Error(
                `${fileName} is locked. Fresh copy saved to ${path.basename(fallbackPath)}. Close any app using dist/${fileName}, delete it, then rename ${path.basename(fallbackPath)} to dist/${fileName}.`
            );
        }
    }
};

const buildPage = (fileName) => {
    includeId = 0;
    const sourcePath = path.join(rootDir, fileName);
    const expanded = expandIncludes(readText(sourcePath));
    const output = rewritePathsForDist(expanded);

    if (fileName === "index.html") {
        try {
            fs.writeFileSync(path.join(distDir, "index-new.html"), output, "utf8");
        } catch (error) {
            console.warn(`Could not refresh index-new.html: ${error.message}`);
        }
    }

    writeBuiltPage(fileName, output);
};

fs.mkdirSync(distDir, { recursive: true });

const htmlPages = fs.readdirSync(rootDir).filter((fileName) => fileName.endsWith(".html"));
const builtNames = new Set(htmlPages);

htmlPages.forEach((fileName) => {
    try {
        buildPage(fileName);
    } catch (error) {
        console.warn(`Skipped ${fileName}: ${error.message}`);
    }
});

fs.readdirSync(distDir)
    .filter((fileName) => fileName.endsWith(".html") && !builtNames.has(fileName) && !fileName.endsWith("-new.html"))
    .forEach((fileName) => {
        try {
            fs.unlinkSync(path.join(distDir, fileName));
        } catch (error) {
            console.warn(`Could not remove stale ${fileName}: ${error.message}`);
        }
    });

console.log(`Built static HTML files in ${path.relative(rootDir, distDir)}`);
