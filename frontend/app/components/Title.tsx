"use client";

type TitleProps = {
  page: string;
};

export default function Title({ page }: TitleProps) {
  return <h1 className="text-2xl font-bold text-primary">{page}</h1>;
}
