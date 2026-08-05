import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { DocumentController } from './document.controller'
import { DocumentRepository } from './document.repository'
import { DocumentService } from './document.service'

@Module({
	imports: [AuthModule],
	controllers: [DocumentController],
	providers: [DocumentService, DocumentRepository]
})
export class DocumentModule {}
