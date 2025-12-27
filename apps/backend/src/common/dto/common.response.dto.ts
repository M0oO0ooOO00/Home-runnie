import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '@homerunnie/shared';

export class CommonResponseDto<T> implements CommonResponse<T> {
  @ApiProperty({ example: 200 })
  code: number;
  @ApiProperty({ type: () => Object, required: false })
  data?: T;

  constructor(code: number, data?: T) {
    this.code = code;
    if (data !== undefined) {
      this.data = data;
    }
  }
}
