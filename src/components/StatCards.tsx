import { ArrowUpRight } from "lucide-react";
import { stats } from "@/lib/data";

export function StatCards({ admin = false }: { admin?: boolean }) {
  const items = admin ? [
    {label:"Total users",value:"12,842",trend:"+8.4%"},{label:"Active organizers",value:"342",trend:"+12.1%"},{label:"Live events",value:"186",trend:"+5.2%"},{label:"Platform revenue",value:"Rs 8.7M",trend:"+18.6%"}
  ] : stats;
  return <div className="stat-grid">{items.map((s,i)=><div className="stat-card" key={s.label}><div><span>{s.label}</span><b>{s.value}</b></div><small className={i===0?"neutral":""}><ArrowUpRight size={13}/>{s.trend}</small><i className={`stat-dot dot-${i}`}></i></div>)}</div>
}
