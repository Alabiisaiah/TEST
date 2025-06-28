import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.create(createClassDto);
  }

  @Get()
  async findAll(): Promise<Class[]> {
    return this.classesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Class> {
    const result = await this.classesService.findOne(+id);
    if (!result) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    const result = await this.classesService.update(+id, updateClassDto);
    if (!result) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.classesService.remove(+id);
    return { message: `Class with ID ${id} deleted successfully` };
  }
}
