import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "./chatgpt-auth";
import { DororiClient } from "./dorori-client";
export const dynamic = "force-dynamic";
export default async function Home(){const user=await getChatGPTUser();return <DororiClient user={user?{name:user.fullName??user.email}:null} signIn={chatGPTSignInPath("/")} signOut={chatGPTSignOutPath("/")}/>}
