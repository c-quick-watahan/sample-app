import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  return (
    <div>
      <h1> Protected </h1>
      <h2> {userName} </h2>
      <h2> {userEmail} </h2>
    </div>
  );
}
