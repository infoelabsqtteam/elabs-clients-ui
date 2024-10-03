import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// Create an Express application
const app = express();

// Define the path to the Angular build output
const distFolder = join(process.cwd(), 'dist');
const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';

// Configure the Express engine to use Angular Universal
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', distFolder);

// Serve static files from /browser
app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});