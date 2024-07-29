const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '../src/icons');
const outputDir = path.join(__dirname, '../src/components');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const svgFiles = fs.readdirSync(iconDir).filter(file => file.endsWith('.svg'));

svgFiles.forEach(file => {
  const componentName = path.basename(file, '.svg');
  const componentContent = `
    import React from 'react';
    import { ReactComponent as ${componentName}Icon } from '../icons/${file}';
    
    const ${componentName} = (props) => <${componentName}Icon {...props} />;
    
    export default ${componentName};
  `;
  fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), componentContent);
});

// Create index file
const indexContent = svgFiles
  .map(file => {
    const componentName = path.basename(file, '.svg');
    return `export { default as ${componentName} } from './${componentName}';`;
  })
  .join('\n');

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
