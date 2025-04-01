import { DynamicModule, Module } from '@nestjs/common';
import { ValidationService } from './validation/validation.service';

@Module({})
export class ValidationModule {
  static forRoot(isGlobal: boolean): DynamicModule {
    return {
      module: ValidationModule,
      providers: [ValidationService],
      global: isGlobal,
      exports: [ValidationService],
    };
  }
}
