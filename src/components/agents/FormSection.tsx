import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function FormSection({ title, children }: Props) {
  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {title}
      </h2>
      {children}
    </div>
  );
}
