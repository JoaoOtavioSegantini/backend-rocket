import { Router } from "express";
import { AswerController } from "./controllers/AswerController";
import { SendEmailController } from "./controllers/SendEmailController";
import { SurveysController } from "./controllers/SurveyController";
import {UserController} from "./controllers/UserController"

const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();
const sendEmailController = new SendEmailController();
const aswerController = new AswerController();
router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);
router.post("/sendEmail", sendEmailController.execute);
router.get("/aswers/:value", aswerController.execute)
export { router }