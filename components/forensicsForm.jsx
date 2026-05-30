"use client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function forensicsForm() {
  return (
    <div>
      <form className="w-120 flex flex-col gap-8">
        <Field>
          <Input
            id="input-field-projectName"
            type="text"
            placeholder="Enter The Project Name"
          />
        </Field>
        <Field className="flex flex-row justify-center items-center">
          <Input id="input-field-mem" type="text" placeholder=".mem" />
          <Input
            id="input-field-projectName"
            type="text"
            placeholder="Enter Dump File Path"
          />
        </Field>
        <Button type="submit" className="cursor-pointer">
          Submit
        </Button>
      </form>
    </div>
  );
}
