"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import DateSelect from "@/shared/ui/write/date-select";
import { RadioGroup } from "@/shared/ui/radio";
import { BgmTag } from "@/shared/ui/tag/bgm-tag";
import TeamDropdown from "@/shared/ui/dropdown/team-dropdown";
import { baseBallTeamItems, baseBallStadiumItems } from "@homerunnie/shared/types";

export default function Page() {
  const [title, setTitle] = useState("");
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [stadium, setStadium] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [headcount, setHeadcount] = useState<string>("");
  const [ticketStatus, setTicketStatus] = useState<"have" | "need">("need");
  const [favTeam, setFavTeam] = useState("");
  const [gender, setGender] = useState<"F" | "M">("M");
  const [prefGender, setPrefGender] = useState<"F" | "M" | "ANY">("M");
  const [note, setNote] = useState("");

  const allTags = useMemo(
    () => [
      "응원가 부르는거 좋아해요",
      "구경",
      "테이블",
      "경기보면서 맛있는거 먹기",
      "응원석이 가까이 있는게 좋아요",
      "응원석이 가까이 있는거 싫어요",
      "햇빛 좋아요",
      "햇빛 싫어요",
      "사진",
      "외야도",
      "선수 가까이",
    ],
    []
  );
  const [picked, setPicked] = useState<string[]>([
    "응원가 부르는거 좋아해요",
    "응원석이 가까이 있는게 좋아요",
    "햇빛 싫어요",
  ]);

  const toggleTag = (t: string) =>
    setPicked((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <main className="min-h-screen bg-gray-200">
      <div className="mx-auto max-w-[1207px] px-4 py-10 lg:px-0">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/icons/pencil.svg" alt="연필" width={36} height={36} />
          <h1 className="text-4xl font-bold leading-[54.4px] text-stone-950">
            직관 메이트 모집글 작성하기
          </h1>
        </div>

        <section className="mb-16">
          <p className="mb-2 text-lg leading-relaxed text-zinc-500">제목</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className="h-14 w-full rounded-2xl border border-zinc-200 bg-neutral-50 px-5 text-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </section>

        <section className="rounded-[20px] border border-zinc-200 bg-neutral-50 p-7 shadow-sm">
          <div className="mb-14">
            <p className="mb-7 text-lg leading-relaxed text-zinc-500">경기 정보</p>

            <div className="flex flex-wrap gap-7">
              <div className="w-80">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">경기 날짜</p>
                <DateSelect
                  value={gameDate}
                  onChange={setGameDate}
                  placeholder="경기 날짜 선택"
                  disabledBeforeToday
                  className="w-80"
                />
              </div>

              <div className="w-80">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">경기 구장</p>
                <TeamDropdown
                  items={baseBallStadiumItems}
                  placeholder="구장 선택"
                  value={stadium}
                  onChange={(v) => setStadium(v as string)}
                  className="w-full"
                />
              </div>

              <div className="w-96">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">경기하는 팀</p>
                <div className="flex items-center gap-4">
                  <TeamDropdown
                    items={baseBallTeamItems}
                    placeholder="팀 선택"
                    value={teamA}
                    onChange={(v) => setTeamA(v as string)}
                  />
                  <span className="text-lg text-zinc-800">vs</span>
                  <TeamDropdown
                    items={baseBallTeamItems}
                    placeholder="팀 선택"
                    value={teamB}
                    onChange={(v) => setTeamB(v as string)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-14 w-[632px] max-w-full">
            <p className="mb-7 text-lg leading-relaxed text-zinc-500">모집 정보</p>

            <div className="flex flex-wrap items-start gap-14">
              <div className="w-80">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">모집 인원</p>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value.replace(/\D/g, ""))}
                  placeholder="00"
                  className="h-14 w-80 rounded-2xl border border-zinc-200 bg-neutral-50 px-5 text-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                />
              </div>

              <div className="w-62">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">티켓 현황</p>
                <RadioGroup
                  name="ticket"
                  value={ticketStatus}
                  onChange={(nv) => setTicketStatus(nv as "have" | "need")}
                  options={[
                    { value: "have", label: "티켓 보유 중. 동행 구함" },
                    { value: "need", label: "티켓 X 동행 구한 후 티켓팅" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="w-[978px] max-w-full">
            <p className="mb-7 text-lg leading-relaxed text-zinc-500">작성자 정보</p>

            <div className="mb-6 flex flex-wrap gap-14">
              <div className="w-80">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">응원하는 팀</p>
                <TeamDropdown
                  items={baseBallTeamItems}
                  placeholder="팀 선택"
                  value={favTeam}
                  onChange={(v) => setFavTeam(v as string)}
                  className="w-80"
                />
              </div>

              <div className="w-20">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">성별</p>
                <RadioGroup
                  name="gender"
                  value={gender}
                  onChange={(nv) => setGender(nv as "F" | "M")}
                  options={[
                    { value: "F", label: "여자" },
                    { value: "M", label: "남자" },
                  ]}
                />
              </div>

              <div className="w-60">
                <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">선호하는 성별</p>
                <div className="flex gap-12">
                  <RadioGroup
                    name="prefGenderA"
                    value={prefGender}
                    onChange={(nv) => setPrefGender(nv as "F" | "M" | "ANY")}
                    options={[
                      { value: "F", label: "여자" },
                      { value: "M", label: "남자" },
                    ]}
                  />
                  <RadioGroup
                    name="prefGenderB"
                    value={prefGender}
                    onChange={(nv) => setPrefGender(nv as "F" | "M" | "ANY")}
                    options={[{ value: "ANY", label: "상관없음" }]}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-5 text-xl font-semibold leading-7 text-zinc-800">성향</p>

              <div className="mb-5 flex flex-wrap gap-3">
                {allTags.slice(0, 5).map((t) => (
                  <BgmTag
                    key={t}
                    text={t}
                    selected={picked.includes(t)}
                    onClick={() => toggleTag(t)}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {allTags.slice(5).map((t) => (
                  <BgmTag
                    key={t}
                    text={t}
                    selected={picked.includes(t)}
                    onClick={() => toggleTag(t)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <p className="mb-2 text-xl font-semibold leading-7 text-zinc-800">하고 싶은 말</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="하고싶은 말을 입력해주세요"
            className="h-52 w-full resize-none rounded-2xl border border-zinc-200 bg-neutral-50 px-5 py-4 text-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </section>
      </div>
    </main>
  );
}
