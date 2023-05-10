import multer from "multer"
import fs from "fs"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync('public')) {
            fs.mkdirSync('public')
        }

        if (!fs.existsSync('public/images')) {
            fs.mkdirSync('public/images')
        }

        callback(null, 'public/images')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname)
    }
})

export const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname)

        if (ext !== ".jpg" && ext !== ".png") {
            return callback(new Error("Only picture are allowed"))
        }


        callback(null, true)
    }
})
