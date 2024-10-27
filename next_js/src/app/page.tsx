import Link from "next/link";

export default function Home() {
	return (
		<section className="gap-2">
			<Link href={"/form"}>
				<button>Account Form</button>
			</Link>
			<Link href={"/videoRoom"}>
				<button>Video Room</button>
			</Link>
		</section>
	);
}
