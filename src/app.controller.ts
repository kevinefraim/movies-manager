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
    <h2 style="color: #fff;">List of Endpoints</h2>
    <ul style="font-size: 18px; font-weight: bold;">
      <li><a style="color: #fff;" href="/auth">/auth</a></li>
      <li><a style="color: #fff;" href="/movies">/movies</a></li>
    </ul>
  </body>
</html>
`;
    return html;
  }
}
