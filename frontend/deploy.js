const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distHtmlPath = path.resolve(__dirname, '../employee_portal/public/portal/index.html');
const portalHtmlPath = path.resolve(__dirname, '../employee_portal/www/portal.html');

console.log('Building frontend...');
try {
	execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
	console.error('Build failed.');
	process.exit(1);
}

console.log('Reading generated index.html...');
if (!fs.existsSync(distHtmlPath)) {
	console.error(`Error: ${distHtmlPath} not found.`);
	process.exit(1);
}

let html = fs.readFileSync(distHtmlPath, 'utf8');

// Inject Jinja2 CSRF Token
console.log('Injecting CSRF token...');
const csrfScript = `<script> window.csrf_token = '{{ csrf_token }}'; </script>`;

if (html.includes('</body>')) {
	html = html.replace('</body>', `\n    ${csrfScript}\n  </body>`);
} else {
	// Fallback if no body tag found (unlikely)
	html += `\n${csrfScript}`;
}

console.log(`Writing to ${portalHtmlPath}...`);
fs.writeFileSync(portalHtmlPath, html);

console.log('✅ Specific deployment success: portal.html updated.');
