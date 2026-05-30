"use client";
import ForensicsForm from "@/components/forensicsForm";
import { Steps } from "@/components/steps";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-[#1e1e1e] justify-center items-center p-12 gap-12 ">
      <h1 className="text-red-700 text-4xl">PlaceHolder</h1>
      <ForensicsForm />
      <Steps />
    </div>
  );
}
