"use client";
import Link from "next/link";
import { CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const Navbar = () => {
  const { data: session,status } = useSession();
  
  
  return (
    <header className="sticky z-50 top-0 flex w-full h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <nav className="hidden  flex-col gap-8 text-lg font-medium md:flex md:flex-row md:items-center md:gap-8 md:text-sm lg:gap-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src={'https://utfs.io/f/DbhgrrAIqRoKWCwFFv4kujRo2cBDzhfSAtQ1p0ZrLwxy9lHG'} alt="Acme Inc" width={290} height={290} priority />
        </Link>
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          href="/questionset"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Questions
        </Link>
        <Link
          href="/challenge"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Challenge
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white w-[220px] ">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image src={'https://utfs.io/f/DbhgrrAIqRoKWCwFFv4kujRo2cBDzhfSAtQ1p0ZrLwxy9lHG'} alt="Acme Inc" width={60} height={60} />
            </Link>
            <Link
              href="/"
              className="text-muted-foreground  hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/questionset"
              className="text-muted-foreground hover:text-foreground"
            >
              Question
            </Link>
            <Link
              href="/challenge"
              className="text-muted-foreground hover:text-foreground"
            >
              Challenge
            </Link>

            
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end  md:ml-auto md:gap-2 lg:gap-4">
        {
          status === "loading" ? null: status === "authenticated" ? (
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="secondary" size="icon" className="rounded-full">
                 {session?.user?.image ? (
                   <Image
                     src={session.user.image}
                     alt="User profile"
                     width={28}
                     height={28}
                     className="rounded-full"
                   />
                 ) : (
                   <CircleUser className="h-7 w-7" />
                 )}
                 <span className="sr-only">Toggle user menu</span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent >
               <DropdownMenuLabel>{session?.user?.name || "User"}</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
                 <Link href={`/u/${session?.user?.username}`}>Profile</Link>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                 Log Out
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
          ):(
            <div className="flex gap-1 md:gap-2">
            <Link href={"/sign-in"}>
              {" "}
              <Button>Login</Button>
            </Link>
            <Link href={"/sign-up"}>
              {" "}
              <Button>Register</Button>
            </Link>
          </div>)

        }


        
      </div>
    </header>
  );
};

export default Navbar;