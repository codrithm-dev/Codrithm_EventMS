import { UserSection } from "@/components/PortalPages";
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <UserSection section={section}/>}
