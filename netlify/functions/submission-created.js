// netlify/functions/submission-created.js
// ⬇️ Netlify "Form submission-created" 이벤트 핸들러(파일명으로 자동 트리거)
export const handler = async (event) => {
  try {
    // ⬇️ Netlify가 보내는 페이로드(JSON 문자열) 파싱
    const payload = JSON.parse(event.body);                        // 전체 이벤트
    const data = payload?.payload?.data || {};                     // 폼 필드(key-value)
    const formName = payload?.payload?.form_name || "CID-Contact-sendrequest"; // 폼 이름(표시 용도)
    const ip = payload?.payload?.ip || "N/A";                      // 제출자 IP(참고)

    // ⬇️ 빈 값 보정 함수(값이 없거나 공백이면 N/A로 대체)
    const get = (k) => (data[k] && String(data[k]).trim() !== "" ? data[k] : "N/A");

    // ⬇️ 이메일 본문(텍스트) 구성
    const lines = [
      `New ${formName} submission`,
      `----------------------------------`,
      `First Name: ${get("firstName")}`,
      `Last Name: ${get("lastName")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `Company: ${get("company")}`,
      `Role: ${get("role")}`,
      `Website: ${get("website")}`,
      `Product: ${get("product")}`,
      `Message: ${get("message")}`,
      `IP: ${ip}`,
      `Submitted At: ${new Date().toISOString()}`,
    ].join("\n"); // 줄바꿈으로 합치기

    // ⬇️ 환경변수 읽기(대시보드에서 설정)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY; // SendGrid API Key (필수)
    const FROM_EMAIL = process.env.FROM_EMAIL;             // Single Sender 검증된 Gmail(임시 발신자)
    const TO_EMAIL = process.env.TO_EMAIL;                 // 최종 수신자: sungjunan45@gmail.com

    // ⬇️ 필수값 체크(없으면 500 반환)
    if (!SENDGRID_API_KEY || !FROM_EMAIL || !TO_EMAIL) {
      console.error("Missing env vars:", { SENDGRID_API_KEY: !!SENDGRID_API_KEY, FROM_EMAIL, TO_EMAIL });
      return { statusCode: 500, body: "Missing email environment variables" };
    }

    // ⬇️ 수신자 배열 구성(콤마로 여러 명 가능 → 현재는 1명)
    const toList = TO_EMAIL.split(",").map(s => s.trim()).filter(Boolean);

    // ⬇️ SendGrid v3 API 호출(표준 fetch 사용)
    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST", // POST 메서드
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`, // API 키 인증
        "Content-Type": "application/json"             // JSON 본문
      },
      body: JSON.stringify({
        personalizations: [{ to: toList.map(email => ({ email })) }], // 수신자 배열
        from: { email: FROM_EMAIL, name: "CID Digital Dentistry" },   // 발신자(표시 이름 포함)
        subject: `CID Contact: ${get("firstName")} ${get("lastName")} | ${get("product")}`, // 제목
        content: [{ type: "text/plain", value: lines }]               // 본문(텍스트)
      })
    });

    // ⬇️ 실패 시 로그/에러 반환, 성공 시 200
    if (!resp.ok) {
      const text = await resp.text();
      console.error("SendGrid error:", resp.status, text);
      return { statusCode: 500, body: "SendGrid send failed" };
    }

    return { statusCode: 200, body: "ok" }; // 성공 응답
  } catch (err) {
    console.error("Function error:", err); // 에러 로그
    return { statusCode: 500, body: "error" }; // 서버 에러
  }
  
};
