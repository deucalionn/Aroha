import { Footer } from "@/components/Footer";
import { SidebarComponent } from "@/components/SidebarComponent";
import { Providers } from "@/components/web3auth/provider/providers";
import "@/styles/globals.css";
import { getMetadata } from "@/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({ title: "Scaffold-ETH 2 App", description: "Built with 🏗 Scaffold-ETH 2" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex h-screen">
            <SidebarComponent />

            <div className="flex-1 p-6 bg-gradient-to-l from-gray-900 to-black">{children}</div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
