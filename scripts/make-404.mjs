// GitHub Pages serves 404.html for any address that has no file, so a copy of the app's
// index.html there lets deep links such as /menu load the app and show the right page.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('Copied dist/index.html to dist/404.html for GitHub Pages');
