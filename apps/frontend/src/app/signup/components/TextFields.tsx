'use client';

import { useState, ReactNode } from 'react';
import { TextField } from '@/shared/ui/input/text-field';
import { FormLabel } from './FormLabel';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { Button } from '@/shared/ui/primitives/button';
import Image from 'next/image';
import { DEFAULT_PROFILE_IMAGE, TEAM_ASSETS } from '@homerunnie/shared';

interface FormData {
  name: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  favoriteTeam: string;
}

type FieldConfig = {
  label: string;
  name: keyof FormData;
  type: 'text' | 'dropdown';
  placeholder: string;
  items?: { options: { value: string; text: string }[] }[];
};

const toDropdownFormat = (items: { value: string; label: string }[]) => [
  { options: items.map(({ value, label }) => ({ value, text: label })) },
];

const FormField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2.5 w-full">
    <FormLabel>{label}</FormLabel>
    {children}
  </div>
);

export default function TextFields({
  genderItems,
  baseBallTeamItems,
}: Readonly<{
  genderItems: { value: string; label: string }[];
  baseBallTeamItems: { value: string; label: string }[];
}>) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: genderItems?.[0]?.value ?? '',
    birthDate: '',
    phoneNumber: '',
    favoriteTeam: baseBallTeamItems?.[0]?.value ?? '',
  });

  const teamAssets = TEAM_ASSETS[formData.favoriteTeam as keyof typeof TEAM_ASSETS];
  const profileImage = teamAssets?.image ?? DEFAULT_PROFILE_IMAGE;

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fields: FieldConfig[] = [
    {
      label: '이름',
      name: 'name',
      type: 'text',
      placeholder: '이름을 입력해주세요',
    },
    {
      label: '성별',
      name: 'gender',
      type: 'dropdown',
      placeholder: '성별을 선택하세요',
      items: toDropdownFormat(genderItems),
    },
    {
      label: '생년월일',
      name: 'birthDate',
      type: 'text',
      placeholder: '0000.00.00',
    },
    {
      label: '휴대폰 번호',
      name: 'phoneNumber',
      type: 'text',
      placeholder: '010-0000-0000',
    },
    {
      label: '응원하는 팀',
      name: 'favoriteTeam',
      type: 'dropdown',
      placeholder: '응원하는 팀을 선택하세요.',
      items: toDropdownFormat(baseBallTeamItems),
    },
  ];

  return (
    <div className="gap-12 w-full items-center flex flex-col">
      <Image
        src={profileImage}
        width={170}
        height={170}
        className={'rounded-full'}
        alt={'프로필 사진'}
      />
      <div className="flex flex-col gap-[60px]">
        <div className="flex flex-col justify-start gap-5 w-full">
          {fields.map(({ label, name, type, placeholder, items }) => (
            <FormField key={name} label={label}>
              {type === 'text' ? (
                <TextField
                  className="h-[60px] px-[22px] py-4 leading-[28px] !text-b02-m placeholder:font-normal font-medium"
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={(e) => updateField(name, e.target.value)}
                />
              ) : (
                <Dropdown
                  className="!h-[60px] px-[22px] py-4 !text-b02-m"
                  placeholder={placeholder}
                  items={items!}
                  value={formData[name]}
                  onValueChange={(value) => updateField(name, value)}
                />
              )}
            </FormField>
          ))}
        </div>
        <Button className="w-full h-16 px-44 py-5 text-b01-sb">회원가입 완료</Button>
      </div>
    </div>
  );
}
