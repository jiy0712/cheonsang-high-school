import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'cheonsang-hs-api', time: new Date().toISOString() };
  }
}
