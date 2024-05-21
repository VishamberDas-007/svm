"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const project_routes_1 = require("./project.routes");
const customer_routes_1 = require("./customer.routes");
const referral_routes_1 = require("./referral.routes");
const adminAccount_routes_1 = require("./adminAccount.routes");
const auth_routes_1 = require("./auth.routes");
// import { adminMiddleware } from '../middlewares/auth.middleware'
const booking_routes_1 = require("./booking.routes");
const appConfig_routes_1 = require("./appConfig.routes");
const expense_routes_1 = require("./expense.routes");
const user_routes_1 = require("./user.routes");
const role_routes_1 = require("./role.routes");
const installment_routes_1 = require("./installment.routes");
// import { sendMessage } from '../services/twilio.service'
const website_routes_1 = require("./website.routes");
const mainRouter = (0, express_1.Router)();
exports.mainRouter = mainRouter;
mainRouter.get('/test', (req, res) => {
    return res.json({
        name: 'svm backend',
        version: '1.0.0',
        message: 'Welcome to the svm backend',
        // server: APP_ENV,
    });
});
mainRouter.use('/website', website_routes_1.websiteRouter);
mainRouter.use('/installment', installment_routes_1.installmentRouter);
mainRouter.use('/role', role_routes_1.roleRouter);
mainRouter.use('/user', user_routes_1.userRouter);
mainRouter.use('/appConfig', appConfig_routes_1.appConfigRouter);
mainRouter.use('/booking', booking_routes_1.bookingRouter);
mainRouter.use('/project', project_routes_1.projectRouter);
mainRouter.use('/expense', expense_routes_1.expenseRouter);
mainRouter.use('/customer', customer_routes_1.customerRouter);
mainRouter.use('/referral', referral_routes_1.referralRouter);
mainRouter.use('/account', adminAccount_routes_1.accountRouter);
mainRouter.use('/auth', auth_routes_1.authRouter);
