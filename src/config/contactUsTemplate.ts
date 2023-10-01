export const contactUstemplate = (name: string) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Acknowledgment of Your Inquiry</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                color: #ffffff;
                margin: 0;
                padding: 0;
            }

            .container {
                width: 80%;
                margin: auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                border: 15px solid #16A34A;
                margin-top: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            h2 {
                color: #005893;
                border-bottom: 2px solid #005893;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }

            p {
                color: #005893;
                line-height: 1.6;
                margin-bottom: 15px;
            }

            .footer {
                margin-top: 20px;
                text-align: center;
                color: #005893;
            }

            .footer p {
                font-size: 0.8rem;
            }

        </style>
    </head>

    <body>
        <div class="container">
            <h2>Acknowledgment of Your Inquiry</h2>
            <p>Dear ${name},</p>
            <p>
                Thank you for reaching out to us with your inquiry. We
                appreciate your trust in our platform.
            </p>
            <p>
                Our team has received your query and is currently looking into
                the details. We understand the importance of your matter and
                want to assure you that we are working diligently to provide you
                with a comprehensive response.
            </p>
            <p>
                We value your patience and understanding. Thank you for choosing
                SVM Builders and Developers. We are committed to ensuring your experience with us
                is seamless.
            </p>
            <p>
                Best Regards,<br />
                Team SVM<br />
            </p>
        </div>
        <div class="footer">
            <p>&copy; 2023 SVM Builders and Developers. All rights reserved.</p>
        </div>
    </body>
</html>
`
