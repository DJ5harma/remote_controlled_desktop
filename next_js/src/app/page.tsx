import Link from "next/link";

export default function Home() {
	return (
		<section className="gap-2">
			<Link href={"/form"}>
				<button>Account Form</button>
			</Link>
			<Link href={"/shareScreen"}>
				<button>Share Screen</button>
			</Link>
		</section>
	);
}
