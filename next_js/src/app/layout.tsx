import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/providers/UserProvider";
import Nav from "@/components/Nav";
// import SocketProvider from "@/providers/SocketProvider";
// import SocketProvider from "@/providers/SocketProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
			>
				<Toaster
					position="bottom-center"
					toastOptions={{
						style: {
							color: "white",
							backgroundImage:
								"linear-gradient(to bottom left, rgb(180, 0, 100), rgb(100, 0, 180))",
							textAlign: "center",
							padding: 10,
						},
					}}
				/>
				<UserProvider>
					<>
						<>
							<section
								style={{
									backgroundImage:
										"linear-gradient(to right, rgb(150, 0, 255), rgb(255, 0, 150))",
									height: "100vh",
								}}
								className="w-screen border-4 border-purple-900 [&>*]:w-full [&>*]:h-full"
							>
								<Nav />
								{children}
							</section>
						</>
					</>
				</UserProvider>
			</body>
		</html>
	);
}
