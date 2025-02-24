import fs from "fs";
import path from "path";

const dir = "./dist"; // Location of compiled JS files

function fixImports(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath); // Recursively fix subdirectories
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Append .js to relative module imports missing it
      content = content.replace(/from\s+["'](\.\/[^"']+)["']/g, (match, importPath) => {
        if (!importPath.endsWith(".js")) return `from "${importPath}.js"`; // Append .js
        return match;
      });

      fs.writeFileSync(fullPath, content);
      console.log(`✅ Fixed imports in: ${fullPath}`);
    }
  });
}

fixImports(dir);
console.log("🎉 All imports fixed!");
