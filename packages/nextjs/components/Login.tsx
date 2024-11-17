import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MetamaskConnectButton from "./Buttons/MetamaskConnectButton";
import SocialButton from "./Buttons/SocialButton";
import Logo from "@/app/assets/Aroha.png";
import DotPattern from "./ui/dot-pattern";
import { useAccount } from "wagmi";
import { Web3AuthProvider } from "@/hooks/useWeb3AuthConnectorInstance";
import { cn } from "@/lib/utils";

export const Login = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected]);

  return (
    <div className="bg-black w-full h-screen p-32">
      <Image src={Logo} width={250} height={250} alt="Logo" className="mx-auto" />

      <div className="flex flex-col justify-center h-full -mt-10">

          <p className=" text-xl md:text-3xl md:mx-auto text-nowrap text-start -ml-20">Login in to your account</p>


        <div className="flex flex-col gap-4 mt-2 w-[250px] md:w-1/2 md:mx-auto -ml-24">
          <SocialButton provider={Web3AuthProvider.GOOGLE} />
          <SocialButton provider={Web3AuthProvider.APPLE} />
          <MetamaskConnectButton />
          <DotPattern
            className={cn(" [mask-image:radial-gradient(200px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]")}
          />
          {/* <button onClick={() => disconnect()}>Disconnect</button> */}
        </div>
      </div>
    </div>
  );
};
