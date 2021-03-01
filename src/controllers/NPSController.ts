import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveysUserRepository";

class NPSController {
    async execute(request: Request, response: Response) {
        const {survey_id} = request.params;
        const surveyUserRespository = getCustomRepository(SurveyUserRepository);

     const surveyUsers = await surveyUserRespository.find({
            survey_id
        });

        const detractor = surveyUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
            ).length;
        const promoters = surveyUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
            ).length;
        const passive = surveyUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
            ).length;

        const totalAswers = surveyUsers.length;
        const calculate = (promoters - detractor) / totalAswers;
        return response.json({
            detractor,
            promoters,
            passive,
            totalAswers,
            nps: calculate
        });
    }
}

export { NPSController }