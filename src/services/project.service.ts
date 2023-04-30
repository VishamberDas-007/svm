import prisma from '../db'
import multer from 'multer'
import path from 'path'

export const projectExists = async (projectId: string): Promise<boolean> => {
    const project = await prisma.project.findFirst({
        where: {
            projectId,
        },
    })
    return project ? true : false
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../') + 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${ext}`)
    },
})

export const upload = multer({ storage: storage })
