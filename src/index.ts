import App from './api/app';
import config from './config';

const app = new App({config: config});

app.start();
