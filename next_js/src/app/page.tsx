import Link from "next/link";

export default function Home() {
	return (
		<section className="gap-2">
			<Link href={"/form"}>
				<button>Account Form</button>
			</Link>
			<Link href={"/videoCall"}>
				<button>Video call</button>
			</Link>
		</section>
	);
}
