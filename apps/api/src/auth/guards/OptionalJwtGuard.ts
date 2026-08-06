import { type ExecutionContext, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { JwtAuthGuard } from './JwtGuard'

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
	override canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>()
		if (!request.headers.authorization) return true

		return super.canActivate(context)
	}
}
