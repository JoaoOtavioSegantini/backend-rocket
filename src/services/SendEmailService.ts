import  nodemailer, { Transporter }  from "nodemailer"
import handlebars from "handlebars";
import fs from "fs";


class SendEmailService {
    private client: Transporter
    constructor() {
        nodemailer.createTestAccount().then(account => {
           const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                auth: {
                  user: account.user,
                  pass: account.pass
                }
              });
              this.client = transporter;
            
        })
    }

    async execute (to: string, subject: string, template: string, path: string){
     const templateFileContent = fs.readFileSync(path).toString("utf-8");

     const mailTemplateParse = handlebars.compile(templateFileContent);
     const html = mailTemplateParse({
         name: to,
         title: subject,
         description: template

     });

     const message = await this.client.sendMail({
             to,
             subject,
             html,
             from: "NPS<noreplay@test.com>"
      });
      console.log("Message sent: %s", message.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
    
}

export default new SendEmailService();