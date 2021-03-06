import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveysUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import  SendEmailService  from "../services/SendEmailService";

class SendEmailController {
  async execute(request: Request, response: Response){
      const { email, survey_id} = request.body;
      const userRepository = getCustomRepository(UserRepository);
      const surveyRepository = getCustomRepository(SurveysRepository);
      const surveyUserRepository = getCustomRepository(SurveyUserRepository);
      const userAlreadyExists = await userRepository.findOne({ email })

      if(!userAlreadyExists) {
          throw new AppError("User does not exists!")
          
      };
      const surveyAlreadyExists = await surveyRepository.findOne({id: survey_id});
      if(!surveyAlreadyExists) {
          throw new AppError("Survey does not exists!")
          
      };
      const npsPath = resolve(__dirname, "..", "views", "emails", "nbsEmail.hbs");

     
      const surveyUserAlreadyExists = await surveyUserRepository.findOne({
          where: {user_id: userAlreadyExists.id, value: null},
          relations: ["user", "survey"],
      });

      const variables = {
        name: userAlreadyExists.name,
        title: surveyAlreadyExists.title,
        description: surveyAlreadyExists.description,
        user_id: userAlreadyExists.id,
        link: process.env.URL_MAIL,
        id: ""
    }

      if(surveyUserAlreadyExists) {
          variables.id = surveyAlreadyExists.id;
          await SendEmailService.execute(email, surveyAlreadyExists.title, variables, npsPath  );
          return response.json(surveyUserAlreadyExists);
      }
      const surveyUser = surveyUserRepository.create({
          user_id: userAlreadyExists.id, survey_id
      });
      await surveyUserRepository.save(surveyUser);
      variables.id = surveyUser.id;
      
      await SendEmailService.execute(email, surveyAlreadyExists.title, variables, npsPath);

      return response.json(surveyUser);
  }
}

export { SendEmailController }