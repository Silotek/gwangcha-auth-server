import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail", // gmail을 사용함
  auth: {
    user: "gwangcha-service@silotek.co.kr", // 나의 (작성자) 이메일 주소
    pass: process.env.GWANGCHA_MAILER_PASSWORD // 이메일의 비밀번호
  }
});

const logoBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAB2CAYAAADY+T/FAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABOxSURBVHgB7V1Ndts4Ei7KerNt98++5XEy22afIPIJ2jmBlRPYXrczll6c2cY+geUTtHOCKCdoZp1krOy7O5rtjCVOFQ3YEEyRoESABQnfe7IlCgSLFAofUFUoROAx+jdx53YGN7ABiACGr3aTF4u+d/QsBme7SR9qBMk9ncG7FKADllD27EzgQk4UdNQGj4EP6BQ2BFstGBR9fzuFS2p5toBVj1GGIdQM7EQOwGYjh/JnZwIXcs5u4bgFnoJ6LOyterAZGPR3kvGiL08+xl3UmC5YBD7rqyIZlgH9hvQPLILYcVW5Sc7IclsjOf/1jyTxliE3hR2NmCmy+yxssaOL39AXdpRyesmQxAibwo5lzOSCHVGIgQ12TB2wTh3sCA5Z3E+GjAI7KoWss+OrJ8kQaoYv7OhaTu8Y8uQm3rfOCEwwm8FFUQ//8lPcc8GOUDN8YkfXcnqnkNEM3sAGgJjp9dPkvKRQYMccoNwTH9mR4JVCEiNY9QNxQgkzOXkWnrIj1n/hIzsS/GLIDZo7ljKTp+yY+UstguRu12ARbmqO641CBnZ8gK/s6MIiXDbvNkGTc1x/GDKwo1rIS3aMWvbZsXTebYAmLcBeuD0COz6AAzsig2yjs/wIKgCV5UfbcqcRjE8+x/2iMjScLWJQERPcA4sosgD74YcM7KgWapwdscEe4r9KcqTgAGk2HO4u/D6CESpCHwrQtH+U/ZA1sOMDmLCj9bhOW2hH8KLoew7+UdYKmYUtBXZUC3FgxwMfO0iTQAEH/tFxmX+UtUL6+uMvBU/YESzHddpCmSLgvcUO/KOlK2bYKqTPQ6PKwLmND+zo6wobE3ZE/6jVCDBT/yhbhdwodoz8YEdfV9iUsSOn9aQsFdLnoVFlIDue7SSjkjJ2mcmAodeZHV2MPkyjh1gq5Cal5qC0DUXfO2HHaHPZ0dWKGdPoIXYKuUmpOWTahpJC1tmxjKEDO64kQ6WoJ3YKGRJXPeDkc3wa2HF5mLAjt5hgVpE6WUjWNHtAI2gSEWzj3xgsoqz3FmkHe1YjXAI7sosJ5qWQO8kE/+1Bw3j5Ob5MLStkaVpHB4mVTCJXbMd12oKP7EjwNg2kLXAIn3KVdtAgcsXL7Ay+siPB60TJNsAh+RKH5MEis98+eAhf2ZEQGFJBYMe5QmHuuLwMS68nDQqpgAM7kgxpw+zoxDdnCT6zIyEopAAXdmxaBlEosOPyMqyUbSEopAAXdoSGZfB5/anv7Eho3KiDLoYby1uRjV/tJjtFZRyZ9wecU0cohfwMzEgNklt5kIuoUYXk0mM5Wpg6hAZlIKwrO2bPdwsKk1v5kqmv2SErgx7LxcY9ZUtvwtxxNZg8Xw4rZkzQGEOy6bEYbOUW2HF5mDxfF37dsphgUzTHkEzYsenEvYEdV4MJO9r26xqtaTVEIwzJhR3bbZjc3tqNnX39tPngbYN8Mtv4HF5A3WhloXfWYoLXjR3vqmoAHCyrHCAsqzdgEcSO+CzqV7YSZKOPFrwDuxic7S7OsypWzPyObW0bLKHu5+t8yOqCHdMWOG+Ay8CXTUuXgoMpSZEyEkTUkzVlJNT9fN3PIRmsgOcARwt/a9+K3ASutlkv+tqXTWF1OFVIDvlhuMCF77OObdmWuraDTXU4JOWyMfpwppCufEGBHe+QGqYdrBubkrLSBjsSnFlZfbN22QSHyCCLF9+IhM625uaVFfKfN/FhOlvKlN21mh8GYBKh0qMF9wAaxHQKF0WZ5FylxaBrnHyuz+NQto0bwYnBLoW3pWVm8MXy2G9CSv9yxeebZ52t5PZwYab3GSbulpNP8Tvf1hqaupFsu7MEJtg57Ij8S7kgvyoqzI1tC+sqWOQuqdSP2N4f3nukzaestwKDIAuHoXelm8WSsiJLXgBjLBryGiukt43JESIG28lZgWnQtNt7OyQWLCrQbsM5/iYTYIgig5A5Q27IPo1LY13ZMWLFjhJes+TKOyj7nGPFBdaZHY3cSM3cm5csGdWyg3Jgx0KUher52qGVJVImNLhsyzuWjOrYQdnnHCtOwGE7OQswdnw3e29esWQ9OygHdiwGh81WLcDE8c3g3rxhyaiOHZQDOxaDWCSwY+PwgyUN94gsZsjAjoVY17QYnrCjBHuWjCpko1uokIEdi7GuaTE8Y0cJ3ixZIRvd4ljWNWFH+hHSCMZRCgl2MF9mKYzpeIt+nBRfEWzPsJfdwv8UaoXlf0xT6EQRxEWhV4EdWd2bZMn+ogLEkugLvsAf3mm7rsKOhFyF9JkdRS94ja8P2LiuV1kig71uPJ1mitlFBX0mn8kms6OIE+V4b8SShfITS6Lsh05jXFfdQVnkIfGqMUklxHnC1aun9a2HxB+XVm3Qa0ifRbRNb2trc9kRmegQeN6b7CgW+k6JJfG3Ocbf0ElMdlV2FOfMg/a1hwLq54RsOIqTder5iqL/XcPRqoe6MSjLUSM663ec702sBBkXlXH1++A06cVKW5o72de+BkhF3CJF3OWjiAQf2dF0QbOTReYroowlM9AwMmo+zUge5qys9MDZN6YZDLDx7Jw9TfqcWPEeHs4dTSJInCQcrgGUuiNLF1MAUhRSGLArSKW5o8Q9Q4rFx33giwSHI8+REcfAFFnC4Sm8R6XsgCdYJ3aUaJwlacna7nL7fNzPIXFcfZly7QFTuDh7khzBCqAO579T6KruDeXrCR77D14ngS2YYC+VrMK++CxJVus5QeuAyTzHh7njI7RgryyKytpc0uDai5ApJNfUHNlcERsMKuN1xVPh5AYtogDPUMm62OjiJZQjweuP0ha8Xebh+tCIK6Tm4NtZLwIF/f892SsqYiW7usF1i08Hng9cDKX2qvgRsyEj+qPQ4NOLalQEMd8YkVugojyd2xR+w07B2v4Wq8CUHb3No2TAVHXnODKx8hah5SiDdiVUVUZSROxU3lBiIzT69KOaWYlYjp4RNUzqvMqMBvdyofztCPbwhhJgBlMroG8+6TmkBrLXsMmqRFRDrtYWtwdeRRlJEXFoeioyjB25mLNVVUyai7JUSoOGyLGzrgScroipy0KcUSBJCiOoAXXkao1Me3uHmJgYVOhBRzO4bHKORp3HDODi9W5yXlZWbPnGZuh6ZhDR5GIqE90Z1Ox1pAZzOhGYvrIMdWQyj8BDcIsmoqEK9o7HLP2iS8LVVnkiqbHdUdoKVk/XaG4H5SVAPdmv2GsDs9A+YhHah5DhaGNpuErH72RZVOrPPNgbhcyGfOhG4BotQkNncnOsg1K63KzGyeJhg7kkF3ihkFIZAXi6DyTWRSldb1YTWPIBXigkNhAaprJWRglFKdlH6eShia3cAks+gL1CkgEHG8g+eARSyiwgwEM0tZVbYMk7sLaynnyK91FCLxs2AR/u+avd5LioDN7jeRTBN8AELtgxb9cnwsnHuO8gxcZ1nYqPbq8PJm4vUzjbsLUqRCzoG+5rM4tAwQo4TCqOhU2znD+HsAEgRShynjtKsbFfZ5uK0KUCNYLtkHUK2Q/TAd9RMkzivEtT3cDf86LIee7DNnIaruv2b7Icsq7bxrBlQdyUTOv2lv9SrVWBnU/psjZuEU1FMLmfqmCpkF4u9ymA6TKngAB2Crm226Z7FL4V0BzYzSFxuNKDdYRH4VsBzYGdQqLV6gDWEeiY9jVYIMAdWCkkGTfWwrK6AP+brSn7B9QGVgqJPqgurDGiCH6BgIACsFLINHXXYMXC2LFTHyDT3DoBfMBKIWnHKbCNCEYwgz10Q3z7Gl0R9L/dgp9RWa7APrbXac1kQP1gEzonllhZNXogA1+hEvb042JTnd7Jx3hsO5bydpp1OmMICMgBJ4bsgEWQc/71k8fKqIK2J6CkzGARqUdZzQPcg41CWg8dM0z3196C2iL38xB5kM08oDmwXe1RN6ZbZmkYKfj518/xOGLuftlGtFqtwzRNu3C3eJsUPYmi6Pqvv/5a2Pl89913p+KcDFj+LZZ/1Al9//33+7PZ7NEqFCw/xtf76XQ6mkwmYzAEXvdSvsfrvRD3cIj3EFN9f/755xA/d/CznDKM8+5DnqPKj+cuzGxP94H3+wu+OqJ8gvUe55TryTJCxr64Xhev19WP28LGKOTf1mhFhVCWS2xAOtvGeCz+4Ycf3v/xxx+jnPN6eF5fPYafc9dr4vE3kNMpYf306mHDHuFHo6VH1KjpHPFxpMhyTvXh/7d0jJRRlsP/j+rG++piR5Cdo8iZO8UQZS/x+44mfxc7hy9qJ0QdAZY7lfeL9zaU3+H7S0WZh2AZXmWdWwW3FRiPMzti4znAxkOLtqUyEjuMDM6TjU7FGFnu0ciBlAXmn8EIHl+jC4ZARbuPvsLGfaXJQjJcC4bq0QFq+HhsBJr8pGBgID89Iyz7TrmHMRRjbmcvlG0g6jnNO24TbBSy3bbLYNHMLCSPNlwFpqBGiY31vmfHBnz89evX5/j/rVru9vb2USMVQ8GOeoyGe3nXURWXlAOvsUcvmFfKERjKrLAjKdBQlYWYVlfQvIZvKr/+jPD9AGWnlTYT5f5GWvmeWp6G4jnHh1WG6MuCE0NaVUhazpWlBClA5iO0veFquvyWAtgoqNeXzEhzuHNx/FApQw1n7lnSvEtRintgwxzqx3R21JTj/jgxHRhga2urq8h2LeZ0PbV+Vdnwu4He8FX2LJNf1HX/jGjOR0NmmH9uiVa+Iz6OlTpzWdM22CgkGVOsR81E8Nuvd3s3PgJlJHOyfdzWcveoKwo20Bd5x/WGI3r6vvg4gYdnnDvc09lRKoc2fMuYDgyg1ofvr8TcVGIk7qWnXG8ImvxKHYXya2ycGaBkWTy+g0wZCaZfVP5KYccj5fiFC3YksDLqpHdjfavROqj0b15+jolRRni9L/j5m5QihGbQdZG/hzaDhSWQM4wc03ucK83NIfWGo7IqNSxsgKfi/aPhnjC0dJRryrnUgarUeQaXPAhm6kiZ8XWgWjKJZYV8hNyhKn7/m1JHofzIxjHWAUr9+yjD8SJlEkYkUK5/rhzf1o+7ADcr63twkH9VsGBPvBd/nGCplA+LFIUghqe5daqsRnMjbGTPlDqGennN6DMhC+O3337bgQdmJGV8YcoWZMyRDR7rfk/1qfXj9z9JBcX/j1hIyB+byo+dE7lk5qrAaxDT9fWyOjvSPeK5X/F+QbXiEmvKzs8FeFlZZ3AN64w063AqY9Ewsghk9ldYTc6NuvJzznBPN5psi/IdeV1sqD+TRRQMoBtz8HzJbLIzSTRjz7l+fhX5CeLYSD1GjEo+W72s4u8swjhP8W2ClUJS0iCnqy9cY6t6h1M2R8yD7iKgIabaAPXhnm5RBMpdisNDtQz5K6vMo1RjjkBHsJxc0dMBMZTWh8CkQMpQtlR+FWQU0o/huT2tfp0dr4WPcaTV5WzuKMFrgTKlAUzhLawhKJa2ak4daph57EgNCp3bffmiz+p5mlshs1qq0Tk5vf6cRZHcKfj6Ufl+pFtuy6ANfzvwwDaxcuxePlhN/nsI/6Xe8W3n1C8xJtcRRQ8pRqDsuM7aLsAvMCCFIawhcFZi5CbQQManjvygsCPNzU7F60Bt0LqLgMrgvCiFeQvp/XAvx6IoFUQNT/sAFaAacxQ59nKGiWM9FE3If6Scd4Dy3xTJT+dQx0QuFTqG15nr1PG5jdXy2vMZFB13DXYKWecW05zQblXvaPIc07oCqQ1nQTSOXufcUFTz22UspiuU6kg3gRqZI675iOWE7PpQNU/+Diiy6MNVGtqKMMJTfD8R9T5Tisy5aHR2lN8tOu4aPEPnUmikd7IFfbcnE+hKgQ0mY1hsdOTHkwqUqA1HWDE74j3N13bIEKPWi433WrlGrh8OHlu6R2Autz4/y1hQsFdHudZFyVD1ihQWX89hXv6hcq1YrZPid4uYjjs7Elgq5DqxJM0di/azWAR1hQGBjDQ4dPsKDzuBjdXGKqyk8pxMCajBk29OqSZRlUBnBdnYURl+0c4xnj/qxhwpI9Z9oF1Lt6qq0UT0/RHNB7G+bU0W1braVevA5/MOZf9dfhZKP1Q+q24XduxI4BtcviYsiX7qi6rseHfeTDfrd0AJ/yL2UKJoVBfB3FBQVQRiHfk+jxXEkFi6O+Q5lVw1mhGKFCIRRqd9/VqqLFqM7p7sBBbJvwBdUIIgsFM6Uq7RBeW+OLIjge3yK2LJk0/xBXi8M1RmWX263FZl5O/DxkKWP9kgyVH/hYac+koIYdYf0nv8/oPa2IXlUH6nWh9jdTkRWhrl+456XDunEEKxRsq5ffmVrFPIN9Tk76MiZOdRoLzS0dx3QAtkGWK9sXClUFnyd76lcng/I+0a+/IacBdPMRTHj/KON4UImOPk3/HvPmZrE0PVvWXYMWBzwX49ZDuC55GHSaHQn3oclDGgKtgrJDVqZJrnnkXwDM6eJOsdBhhgBeyHrBK0zYBYHrUNvDE42036EBCwBLxJ4UG5U2lOxnn4ms7gOChjwCrwhiElaFW/k4XEFZBtSzCD55n/NCBgBXiX5ErMKX+2ndDYGBGMSJ6gjAF1wDuGVJElpIrgtAm2JFZEp//g9ZJ+xoCAPHitkBInH+M+bfTqTDGRndtb0F9m9X9AQBHWQiEJ2dxyCl1bjCnmiRftNpwHRQywhbVRSBXImKSYvSiCZ6sop/B9XtOiaWTEUVDEANtYS4VUkfkvp0BbpVP43U9oxtqOUuio/sxsPkixoinFQmZulQ9oqBmJbeoCApzh/wd2kh7+4pZ4AAAAAElFTkSuQmCC";
const footer = `
<div style="margin-top: 24px; color: #666; font-size:12px">
  <strong>주식회사 사일로텍</strong><br>
  인천광역시 서구 심곡로 103, 3호<br>
  사업자등록번호 725-87-02961<br>
  Copyright ⓒ Silotek Inc. All Rights Reserved<br><br>
  ※ 본 메일 주소는 발신 전용이므로, 회신 내용을 확인할 수 없습니다.
</div>
`;

// ${buttonText ? `<a href=${href} style="text-decoration: none; display: inline-block; margin: 16px 0; padding: 8px 16px; background: #111111; border-radius: 8px; overflow: hidden;">
//   <div style="text-align: center; color: #A4F65F; font-size: 14px; font-weight: 500; line-height: 21px; word-wrap: break-word">
//     ${buttonText}
//   </div>
// </a>` : ''}

const useEmailTemplate = ({
  title,
  description,
  body
}: {
  title: string;
  description: string;
  body?: string;
}) => `
<div style="font-family: SF Pro KR, SF Pro Display, SF Pro Icons, -apple-system, BlinkMacSystemFont, Basier Square, Apple SD Gothic Neo, Roboto, Noto Sans KR, Noto Sans, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;">
  <div style="display: flex; justify-content: center; height: 100%; padding: 64px 16px; background: #f2f2f2; border-radius: 14px; color: #555; font-size: 16px;">
    <div style="width: auto; margin: 0 auto">
      <div style="color: #333333; font-size: 16px; font-weight: 400; line-height: 24px; word-wrap: break-word">
        <img src="cid:logo" style="width: 136px">
        <h1 style="color: #333333">${title}</h2>
      </div>
      <p>
        ${description}
      </p>
      ${body}
      ${footer}
    </div>
</div>
</div>
`;

export const useEmailVerificationMailOptions = ({
  authCode,
  email
}: {
  authCode: string;
  email: string;
}) => {
  const html = useEmailTemplate({
    title: "이메일 인증 안내",
    description: `
    아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요. <br />
    즐거운 세차 문화를 위한 첫걸음, 광차와 함께하세요! <br />
  `,
    body: `
      <h3>${authCode}</h3>
      <p>
        인증 코드는 10분간 유효합니다. <br />
        인증 코드를 다른 사람과 공유하지 마세요.
      </p>
    `
  });
  const mailOptions: Mail.Options = {
    from: "광차 gwangcha-service@silotek.co.kr", // 작성자
    to: email, // 수신자
    subject: "[광차] 이메일 인증을 완료해주세요.", // 메일 제목
    html,
    attachments: [
      {
        filename: "Logo.png",
        path: logoBase64,
        cid: "logo"
      }
    ]
  };

  return mailOptions;
};
