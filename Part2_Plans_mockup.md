The Project spans into second phase, which we now must plan to implement the following;

not necessarily in order:
a) Some kind of actual log-in method
b) a 'Shipping cart'.
c) a 'Milage' points (undecided?)
d) Check-out system using Card transaction

e) Upgrade the email-contactus system into something else ( current Sendgrid is valid only until Nov( Free Trial))




BrainStorming;

[a,b,c,d] Above requires that the system 'remembers' the user 
whether in an 'instance' or else.

[a]: needs some kind of 'security' method for user protection
        - User unique code...? Identification numbers...? (backend)

    : needs some kind of 'database' for "validation" of a 'password'
        - 

    : needs to "retain" the user's selection in a shipping cart and/or milage points.
    : 

[b,c] : requires database for user selection and accumulating milage points.

[d]


[e] as of October 1st 2025, 
    we have no access to the ciddentallab.com Domain to 'label' our website properly,
    but we can keep filling up our 'package box' with features regardless of the status of the Domain DNS.

    Therefore, 


예시 구조: Netlify + AWS 로그인 플로우

[사용자 브라우저]
    │
    ▼
(Netlify 프론트엔드)
- 로그인 폼 (이메일, 비밀번호 입력)
- 로그인 버튼 클릭 시 → fetch(API)
    │
    ▼
(AWS API Gateway)
- "/login" 요청 수신
    │
    ▼
(AWS Lambda)
- DB(User Table) 조회
- 비밀번호 검증 (bcrypt 등)
- JWT 토큰 생성 후 응답
    │
    ▼
(Netlify 프론트엔드)
- 브라우저 localStorage나 cookie에 JWT 저장
- 이후 요청마다 Authorization 헤더로 전송




Oct 6 2026 Conclusion: It would be an excuse to say that you can't work on the server-end cuz we dont have full access to domain. 



Oct 9 2026
0) 즉시 확인(오늘)

 도메인 상태 확정: redemption/갱신 필요 여부 확인(도메인 소유자에게 문의).
 - completed

 스테이징 주소 고정: Netlify 기본 도메인(*.netlify.app)로 계속 개발/검수 진행.
 - completed