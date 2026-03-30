/* amplify/backend/function/contactUsFuction/src/index.js */

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// AWS SES 클라 세팅

const client = new SESClient({region: process.env.REGION});

exports.handler = async (event) => {
    try{
        // 1. 프론트엔드에서 보낸 json 데이터 parsing
        const body = JSON.parse(event.body);
        // 2. empty 값 보정 함수
        const get = (k) => (body[k] && String(body[k]).trim() !== "" ? body[k] : "N/A");
        // 3. 이메일 본문(텍스트) 구성 (기존 포맷 그대로 유지)
        const emailContent = [
            'New CID-Contact-sendrequest submission (via AWS)',
            '----------------------------------',
            'First Name: &{get("firstName")}',
            'Last Name: ${get("lastName")}',
            'Email: &{get("email")}',
            'Phone: ${get("phone")}',
            'Company: ${(get("company")}',
            'Role: ${(get("role")}',
            'Website: ${(get("website")}',
            'Product: ${(get("product")}',
            'Message: ${(get("message")}',
            'Submitted At: ${new Date().toISOString()}',
        ].join("\n");

        // 4. AWS SES 전송 세팅
        const command = new SendEmailCommand({
            Source: process.env.FROM_EMAIL, // 발신자 (환경변수에서 갖고옴)
            Destination: {
                ToAddresses: [process.env.TO_EMAIL] // 수신자 (환경변수에서 갖고옴)
            },
            Message: {
                Subject: {
                    Data: 'CID Contact: ${get("firstName")} ${get("lastName")} | ${get("product")}',
                    Charset: "UTF-8"
                },
                Body: {
                    Text: { Data: emailContent, Charset: "UTF-8" }
                }
            }
        });

        // 5. 이메일 발송!
        await client.send(command);

        // 6. 성공 응답 (CORS 설정 포함 - 프론트엔트 에러 방지)
        return {
            statusCode: 200,
            header: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Header": "*"
            },
            body: JSON.stringify({ error: "ok" }),
        };
    } catch (err) {
        console.error("Function error:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ error: "error"}),
        };
    }
};
