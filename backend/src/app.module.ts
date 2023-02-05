import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'root',
      password: 'Admin@2021',
      host: 'localhost',
      port: 3306,
      database: 'attachments',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}']
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
