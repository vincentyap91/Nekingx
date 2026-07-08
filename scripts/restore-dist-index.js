const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "index.html.rebuilt");
const targetPath = path.join(rootDir, "dist", "index.html");

if (!fs.existsSync(sourcePath)) {
    console.error("Missing index.html.rebuilt. Run: node scripts/build-static.js");
    process.exit(1);
}

try {
    if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
    }
    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath);
    console.log("Restored dist/index.html");
} catch (error) {
    console.error(`Could not restore dist/index.html: ${error.message}`);
    console.error("Close any tab or app using dist/index.html, then run this script again.");
    process.exit(1);
}
