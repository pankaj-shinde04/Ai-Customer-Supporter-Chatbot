import HomeClient from "../components/HomeClient";
import { getSession } from "../lib/getSessions";

export default async function Home() {
  const token = await getSession();
  console.log("Token passed to HomeClient:", token?.user?.user?.email);
  
  return (
    <>
      <HomeClient email={token?.user?.user?.email || token?.user?.user?.name}/>
    </>
  );
}
