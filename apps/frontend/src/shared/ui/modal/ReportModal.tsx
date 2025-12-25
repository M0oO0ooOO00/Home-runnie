import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/shared/ui/primitives/dialog';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/primitives/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { Textarea } from '@/shared/ui/primitives/textarea';
import { Label } from '@/shared/ui/primitives/label';
import Image from 'next/image';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: string[];
}

const ReportModal = ({ isOpen, onClose, participants }: ReportModalProps) => {
  const reportReasons = ['욕설/비방', '스팸/홍보성 메시지', '불법 정보', '음란물/선정성', '기타'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[670px] p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Image src="/icons/report.svg" alt="신고 아이콘" width={24} height={24} />
            신고하기
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"></DialogClose>
        </DialogHeader>

        <div className="grid gap-[8px]">
          <div className="pb-[36px]">
            <Label className="text-b01-r mb-[20px] block">대상</Label>
            <RadioGroup defaultValue={participants[1]} className="flex flex-wrap gap-x-6 gap-y-2">
              {participants.map((name) => (
                <div key={name} className="flex items-center space-x-2">
                  <RadioGroupItem value={name} id={name} />
                  <Label htmlFor={name} className="text-b01-r">
                    {name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="reason" className="text-b01-r mb-[20px] block">
              사유
            </Label>
            <Select>
              <SelectTrigger id="reason" className="w-[260px] text-b03-r text-muted-foreground">
                <SelectValue placeholder="신고 사유를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="예시) 이런 기능 있으면 좋겠어요! 이런게 불편해요! 이건 어떻게 하는 건가요?"
            className="min-h-[120px] mb-[44px] placeholder:text-gray-400"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full bg-black text-white text-[18px] h-[70px] hover:bg-gray-800"
          >
            제출하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
