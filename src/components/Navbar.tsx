import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./ui/Button";

export default function Navbar() {
    return (
        <div className="my-8 mx-8 grid grid-cols-3 items-center text-2xl">
            {/* Logo */}
            <div className="flex items-center cursor-pointer gap-2">
                <Image
                    className="rounded-md w-15"
                    src={"/logo.png"}
                    alt={"logo"}
                    width={735}
                    height={485}
                />
                {/* <p className="opacity-85">Studio</p> */}
            </div>

            {/* Navigation Links */}
            <div className="flex gap-12 mx-auto">
                <a
                    href="#works"
                    className="tracking-wide transition-colors duration-200 relative group"
                >
                    <span className="flex gap-0.5">
                        <span className="text-sm">(1)</span>
                        Works
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                    href="#services"
                    className="tracking-wide transition-colors duration-200 relative group"
                >
                    <span className="flex gap-0.5">
                        <span className="text-sm">(2)</span>
                        Services
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                    href="#about"
                    className="tracking-wide transition-colors duration-200 relative group"
                >
                    <span className="flex gap-0.5">
                        <span className="text-sm">(3)</span>
                        About
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
            </div>
            {/* Crazy hover CTA */}
            <div className="ml-auto">
                <Button arrow={true}>Get In Touch</Button>
            </div>
        </div>
    );
}
