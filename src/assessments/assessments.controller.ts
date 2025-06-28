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
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  async create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return await this.assessmentsService.create(createAssessmentDto);
  }

  @Get()
  async findAll() {
    return await this.assessmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const assessment = await this.assessmentsService.findOne(+id);
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return assessment;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    const updated = await this.assessmentsService.update(+id, updateAssessmentDto);
    if (!updated) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.assessmentsService.remove(+id);
    if (result.affected === 0) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return { message: 'Assessment deleted successfully' };
  }
}
