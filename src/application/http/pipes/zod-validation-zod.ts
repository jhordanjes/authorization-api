import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe<T extends ZodSchema> implements PipeTransform {
  constructor(private schema: T) {}

  transform(value: unknown): z.infer<T> {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(error),
          message: 'Validation failed',
          statusCode: 400,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
