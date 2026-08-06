import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/JwtGuard'
import { JwtStrategy } from './guards/JwtStrategy'
import { OptionalJwtAuthGuard } from './guards/OptionalJwtGuard'
import { TokenService } from './token.service'

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		AuthRepository,
		TokenService,
		JwtStrategy,
		JwtAuthGuard,
		OptionalJwtAuthGuard
	],
	exports: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard]
})
export class AuthModule {}
