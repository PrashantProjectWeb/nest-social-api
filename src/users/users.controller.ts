import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async getUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
  ) {
    return await this.usersService.getUsers(page, limit, name);
  }

  @Get(':id')
  @HttpCode(200)
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
