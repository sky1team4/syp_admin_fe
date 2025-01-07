import Image from "next/image";
import Login from './admin-Login/page'
import Router from "./routes/index";

export default function Home() {
  return (
    <div className="">
      <Login />
      {/* <Router/> */}
    </div>
  );
}
