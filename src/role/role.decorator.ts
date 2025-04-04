/* eslint-disable @typescript-eslint/unbound-method */
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
