import { z } from 'zod';
import { Team } from '@homerunnie/shared';

export const writeFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),

  gameDate: z
    .date()
    .refine(
      (date) => date instanceof Date && !isNaN(date.getTime()),
      '올바른 날짜를 선택해주세요.',
    ),

  stadium: z.enum(
    [
      'JAMSIL',
      'GOCHEOK',
      'SUWON',
      'MUNHAK',
      'DAEGU',
      'GWANGJU',
      'DAEJEON',
      'SAJIK',
      'CHANGWON',
    ] as const,
    { message: '경기 구장을 선택해주세요.' },
  ),

  teamA: z.nativeEnum(Team),

  teamB: z.nativeEnum(Team),

  headcount: z
    .string()
    .min(1, '모집 인원을 입력해주세요.')
    .regex(/^[1-9][0-9]*$/, '모집 인원은 1 이상의 숫자여야 합니다.'),

  ticketStatus: z.enum(['have', 'need']),

  favTeam: z.nativeEnum(Team).optional(),

  gender: z.enum(['F', 'M']).optional(),

  prefGender: z.enum(['F', 'M', 'ANY']),

  picked: z.array(z.string()).optional(),

  note: z.string().optional(),
});

export type WriteFormValues = z.infer<typeof writeFormSchema>;
