import express from 'express'
import * as websiteController from '../controllers/website.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const websiteRouter = express.Router()

websiteRouter.post(
    '/contact-us',
    authMiddleware(['WEBSITE_WRITE']),
    websiteController.saveContactUs
)

websiteRouter.get(
    '/contact-us/list',
    authMiddleware(['WEBSITE_READ', 'WEBSITE_WRITE']),
    websiteController.fetchContactUsList
)

websiteRouter.post(
    '/festival/create',
    authMiddleware(['WEBSITE_WRITE']),
    websiteController.addFestivalDetails
)

websiteRouter.get(
    '/festival',
    authMiddleware(['WEBSITE_READ', 'WEBSITE_WRITE']),
    websiteController.fetchFestivalDetails
)

websiteRouter.get(
    '/project/list',
    authMiddleware(['WEBSITE_READ', 'WEBSITE_WRITE']),
    websiteController.fetchAllProjects
)

export { websiteRouter }
