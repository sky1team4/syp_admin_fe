import Image from "next/image";
import Login from './admin-Login/page'
import Router from "./routes/test";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      {/* <Router /> */}
      <Login/>
    </div>
  );
}
