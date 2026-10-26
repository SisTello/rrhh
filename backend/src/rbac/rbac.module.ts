import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { RolesController } from './roles.controller';

@Module({ controllers: [RolesController, PermissionsController] })
export class RbacModule {}
