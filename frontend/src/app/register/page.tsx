import Image from "next/image";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4">
      <Image
        src="/fast-ariam-bg.jpg"
        alt="Background Fast Logistics"
        fill
        priority
        className="object-cover object-center -z-10"
      />

      <div className="absolute inset-0 bg-black/40 -z-10" />

      <RegisterForm />
    </main>
  );
}