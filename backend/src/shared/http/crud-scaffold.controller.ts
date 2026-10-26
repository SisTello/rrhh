import {
  Body,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotImplementedResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiNotImplementedResponse({
  description: 'This endpoint is documented but not implemented yet',
})
export abstract class CrudScaffoldController {
  @Get()
  @ApiOperation({ summary: 'List records (not implemented)' })
  findAll(): never {
    throw new NotImplementedException('CRUD operations are not implemented');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a record (not implemented)' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') _id: string): never {
    throw new NotImplementedException('CRUD operations are not implemented');
  }

  @Post()
  @ApiOperation({ summary: 'Create a record (not implemented)' })
  @ApiBody({ schema: { type: 'object', additionalProperties: true } })
  create(@Body() _input: Record<string, unknown>): never {
    throw new NotImplementedException('CRUD operations are not implemented');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a record (not implemented)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { type: 'object', additionalProperties: true } })
  update(
    @Param('id') _id: string,
    @Body() _input: Record<string, unknown>,
  ): never {
    throw new NotImplementedException('CRUD operations are not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a record (not implemented)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') _id: string): never {
    throw new NotImplementedException('CRUD operations are not implemented');
  }
}
