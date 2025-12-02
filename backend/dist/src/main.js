"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        rawBody: true,
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT', 4000);
    app.enableCors({
        origin: config.get('APP_CORS_ORIGIN', '*'),
    });
    app.useGlobalPipes(new common_2.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.listen(port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`API listening on port ${String(port)}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map