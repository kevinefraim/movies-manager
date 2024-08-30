import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller('')
export class AppController {
  @Public()
  @Get('')
  listEndpoints() {
    const html = `
<html style="background-color: #222; text-align: center;">
  <head>
    <h1 style="color: #fff;">Welcome!</h1>
  </head>
  <body>
    <h2 style="color: #fff;">Go to Swagger Docs</h2>
    <ul style="font-size: 18px; font-weight: bold;">
      <li><a style="color: #fff;" href="/api/docs">/Swagger</a></li>
    </ul>
  </body>
</html>
`;
    return html;
  }
}
