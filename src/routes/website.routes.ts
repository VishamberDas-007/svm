import express from 'express'
import * as websiteController from '../controllers/website.controller'

const websiteRouter = express.Router()

websiteRouter.post('/contact-us', websiteController.saveContactUs)

websiteRouter.get('/contact-us/list', websiteController.fetchContactUsList)

websiteRouter.post('/festival/create', websiteController.addFestivalDetails)

websiteRouter.get('/festival', websiteController.fetchFestivalDetails)

websiteRouter.get('/project/list', websiteController.fetchAllProjects)

export { websiteRouter }
