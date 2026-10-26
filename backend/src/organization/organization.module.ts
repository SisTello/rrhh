import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { DepartmentsController } from './departments.controller';
import { PositionsController } from './positions.controller';

@Module({
  controllers: [DepartmentsController, BranchesController, PositionsController],
})
export class OrganizationModule {}
