import express from 'express'
import * as websiteController from '../controllers/website.controller'

const contactUsRouter = express.Router()

contactUsRouter.post('/contact-us', websiteController.saveContactUs)

contactUsRouter.get('/contact-us/list', websiteController.fetchContactUsList)

contactUsRouter.post('/festival/create', websiteController.addFestivalDetails)

export { contactUsRouter }
