import { z } from 'zod';
import { Gender, Team } from '@homerunnie/shared';

const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export const signupSchema = z.object({
  nickName: z.string().min(1, { message: '이름을 입력해주세요.' }),
  birthDate: z
    .string()
    .regex(/^\d{4}\.\d{2}\.\d{2}$/, { message: '생년월일은 YYYY.MM.DD 형식으로 입력해주세요.' }),
  phoneNumber: z.string().regex(phoneRegex, { message: '올바른 휴대폰 번호 형식이 아닙니다.' }),
  gender: z.nativeEnum(Gender, { message: '성별을 선택해주세요.' }),
  supportTeam: z.nativeEnum(Team, { message: '응원하는 팀을 선택해주세요.' }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
