import * as fs from 'node:fs'
import { resolve } from 'node:path'
import { diskStorage } from 'multer'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'

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
			const documentId = randomUUID()
			const extension = extname(file.originalname)
			_req.body.id = documentId
			
			cb(null, `${documentId}${extension}`)
		}
	})
}
