import * as fs from 'node:fs'
import { resolve } from 'node:path'
import { diskStorage } from 'multer'

export const multerConfig = {
	storage: diskStorage({
		destination: (_req, _file, cb) => {
			const uploadPath = resolve(process.cwd(), 'uploads')
			if (!fs.existsSync(uploadPath)) {
				fs.mkdirSync(uploadPath, { recursive: true })
			}
			cb(null, uploadPath)
		},
		// acrescentar uuid ao nome do arquivo
		filename: (_req, file, cb) => {
			cb(null, file.originalname)
		}
	})
}
