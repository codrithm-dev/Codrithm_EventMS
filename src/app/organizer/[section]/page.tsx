import { OrganizerSection } from "@/components/PortalPages";
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <OrganizerSection section={section}/>}
