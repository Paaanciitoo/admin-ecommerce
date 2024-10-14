import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white/80 bg-[radial-gradient(#c90000_1.75px,transparent_1.75px),radial-gradient(#c90000_1.75px,#ffffff_1.75px)] bg-[length:70px_70px] bg-[position:0_0,35px_35px]">
      <SignIn appearance={{ baseTheme: neobrutalism }} />
    </div>
  );
}
